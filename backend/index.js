const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const nodemailer = require('nodemailer')
require('dotenv').config()
const { createHmac, createHash, randomBytes, scrypt, timingSafeEqual } = require('crypto')
const { promisify } = require('util')
// Biblioteca mantenida para OAuth 2.0 / OpenID Connect (Panva, certified OIDC).
const { discovery, buildAuthorizationUrl, calculatePKCECodeChallenge, authorizationCodeGrant } = require('openid-client')

const scryptAsync = promisify(scrypt)
const AUTH_SECRET = process.env.AUTH_SECRET || randomBytes(32)
const TOKEN_TTL_SECONDS = 60 * 60

if (!process.env.AUTH_SECRET) {
    console.warn('AUTH_SECRET no está definido; los tokens dejarán de ser válidos al reiniciar el servidor.')
}

const app = express()
app.use(cors())
app.use(express.json())

// Sirve las imágenes de los productos guardadas en C:\frank\Imagenes\panaderia
// bajo la URL http://localhost:3000/imagenes/panaderia/<archivo>
app.use('/imagenes/panaderia', express.static('C:\\frank\\Imagenes\\panaderia'))

const db = mysql.createPool({
    host: 'localhost',
    user:'root',
    password:'',
    database:'db_pruebas',
    connectionLimit: 10
})

db.getConnection((err, connection) => {
    if (err){
        console.error("Error de conexion "+ err.stack)
        return
    }
    connection.release()
    console.log('Conectado a la base de datos')
})

const hashPassword = async (password) => {
    const salt = randomBytes(16)
    const derivedKey = await scryptAsync(password, salt, 64)
    return `$scrypt$${salt.toString('hex')}$${derivedKey.toString('hex')}`
}

const verifyPassword = async (password, storedHash) => {
    const parts = storedHash.split('$')
    if (parts.length !== 4 || parts[1] !== 'scrypt') return false

    const salt = Buffer.from(parts[2], 'hex')
    const expectedKey = Buffer.from(parts[3], 'hex')
    if (!salt.length || !expectedKey.length) return false

    const actualKey = await scryptAsync(password, salt, expectedKey.length)
    return timingSafeEqual(expectedKey, actualKey)
}

const createAccessToken = (user) => {
    const issuedAt = Math.floor(Date.now() / 1000)
    const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url')
    const unsignedToken = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({
        sub: String(user.id),
        email: user.email,
        iat: issuedAt,
        exp: issuedAt + TOKEN_TTL_SECONDS
    })}`
    const signature = createHmac('sha256', AUTH_SECRET).update(unsignedToken).digest('base64url')
    return `${unsignedToken}.${signature}`
}

// Verifica que la petición incluya un token válido en el header Authorization.
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || ''
    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'No autenticado. Debe iniciar sesión.' })
    }

    const parts = token.split('.')
    if (parts.length !== 3) {
        return res.status(401).json({ error: 'Token inválido.' })
    }

    const unsignedToken = `${parts[0]}.${parts[1]}`
    const expectedSignature = createHmac('sha256', AUTH_SECRET).update(unsignedToken).digest('base64url')

    const tokenBuffer = Buffer.from(parts[2])
    const expectedBuffer = Buffer.from(expectedSignature)
    if (tokenBuffer.length !== expectedBuffer.length || !timingSafeEqual(tokenBuffer, expectedBuffer)) {
        return res.status(401).json({ error: 'Token inválido.' })
    }

    try {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
        if (typeof payload.exp !== 'number' || payload.exp <= Math.floor(Date.now() / 1000)) {
            return res.status(401).json({ error: 'Sesión expirada. Inicie sesión nuevamente.' })
        }

        req.usuarioAutenticado = payload
        next()
    } catch {
        return res.status(401).json({ error: 'Token inválido.' })
    }
}

// ============================================================
// Recuperación de contraseña
// Genera un token aleatorio de un solo uso y guarda su hash en
// `password_resets`. Con SMTP configurado, el token se envía por correo.
// ============================================================
const RESET_TOKEN_TTL_MINUTES = 30

// Transportador de correo (SMTP). Solo se crea si hay credenciales en .env.
const SMTP_CONFIGURADO = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)

const transporter = SMTP_CONFIGURADO
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE !== 'false',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })
    : null

const enviarCorreoRecuperacion = (email, resetToken) => {
    return new Promise((resolve, reject) => {
        if (!transporter) {
            return reject(new Error('SMTP no configurado'))
        }

        // URL del frontend donde el usuario ingresa el token.
        const urlCambiar = `${process.env.FRONTEND_URL || 'http://192.168.20.41:5173'}/cambiar-contrasena`

        transporter.sendMail({
            from: process.env.MAIL_FROM || process.env.SMTP_USER,
            to: email,
            subject: 'Recuperación de contraseña - Panadería',
            text: [
                'Recuperación de contraseña',
                '',
                'Recibimos una solicitud para restablecer tu contraseña.',
                `Abre este enlace (válido por ${RESET_TOKEN_TTL_MINUTES} minutos):`,
                `${urlCambiar}?token=${resetToken}`,
                '',
                'Si el enlace no funciona, copia este token y pégalo en la página de cambio de contraseña:',
                resetToken,
                '',
                'Si tú no solicitaste esto, ignora este mensaje.'
            ].join('\n'),
            html: `
                <h2>Recuperación de contraseña</h2>
                <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                <p>El enlace y el token son válidos por ${RESET_TOKEN_TTL_MINUTES} minutos.</p>
                <p><a href="${urlCambiar}?token=${resetToken}">Restablecer mi contraseña</a></p>
                <p>También puedes copiar este token y pegarlo en la página de cambio de contraseña:</p>
                <p style="padding:12px;background:#f3f4f6;border-radius:6px;font-family:monospace;font-size:18px;word-break:break-all"><strong>${resetToken}</strong></p>
                <p>Si tú no solicitaste esto, ignora este mensaje.</p>
            `
        }, (err) => (err ? reject(err) : resolve()))
    })
}

const ensureResetTable = (callback) => {
    db.query(
        `CREATE TABLE IF NOT EXISTS password_resets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario_id INT NOT NULL,
            token_hash CHAR(64) NOT NULL,
            expires_at DATETIME NOT NULL,
            used_at DATETIME NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_token_hash (token_hash)
        )`,
        callback
    )
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex')

// ============================================================
// OAuth 2.0 / OpenID Connect: Google, Microsoft y Facebook.
// Las credenciales de cada proveedor se leen del .env; nunca
// se guardan client secrets en el código fuente.
// ============================================================
const OAUTH_CONFIG = {
    google: {
        enabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        scope: 'openid email profile'
    },
    microsoft: {
        enabled: Boolean(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET),
        authUrl: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || 'common'}/oauth2/v2.0/authorize`,
        tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        scope: 'openid email profile',
        clientId: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        usePkce: true,
        // Microsoft incluye id_token en el response_type=code openid.
        userinfoFromTokens: (tokenData) => {
            const payload = JSON.parse(Buffer.from(tokenData.id_token.split('.')[1], 'base64url').toString())
            // Microsoft usa 'preferred_username' o 'email' para el correo.
            return { providerId: payload.oid, email: payload.email || payload.preferred_username, nombre: payload.name, emailVerificado: true }
        }
    },
    facebook: {
        enabled: Boolean(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET),
        authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
        tokenUrl: 'https://graph.facebook.com/v19.0/oauth/access_token',
        scope: 'email public_profile',
        clientId: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        usePkce: false,
        // Facebook no emite id_token: se consulta el Graph API.
        userinfoFromTokens: null
    }
}

const fetchJson = async (url, options) => {
    const response = await fetch(url, options)
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.error_description || data.error?.message || `HTTP ${response.status}`)
    }
    return data
}

// Obtiene el perfil del usuario desde el proveedor validando el código.
const intercambiarCodigoYObtenerPerfil = async (provider, code, codeVerifier) => {
    const config = OAUTH_CONFIG[provider]
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: obtenerRedirectUri(provider),
        client_id: config.clientId,
        client_secret: config.clientSecret
    })
    if (config.usePkce && codeVerifier) body.set('code_verifier', codeVerifier)

    const tokens = await fetchJson(config.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    })

    if (config.userinfoFromTokens) {
        return config.userinfoFromTokens(tokens)
    }

    // Facebook: consultar el Graph API con el access_token.
    const params = new URLSearchParams({
        fields: 'id,name,email',
        access_token: tokens.access_token,
        appsecret_proof: createHmac('sha256', config.clientSecret).update(tokens.access_token).digest('hex')
    })
    const profile = await fetchJson(`https://graph.facebook.com/me?${params}`)
    return { providerId: profile.id, email: profile.email, nombre: profile.name, emailVerificado: Boolean(profile.email) }
}

// URL base de redirección registrada en cada proveedor. El backend
// agrega la ruta del callback según el proveedor.
const obtenerRedirectUri = (provider) =>
    provider === 'google'
        ? (process.env.GOOGLE_CALLBACK_URL ||
           `${(process.env.OAUTH_REDIRECT_URI || 'http://localhost:3000').replace(/\/$/, '')}/auth/google/callback`)
        : `${(process.env.OAUTH_REDIRECT_URI || 'http://192.168.20.41:3000').replace(/\/$/, '')}/auth/oauth/${provider}/callback`

// ====================================================================
// GOOGLE con openid-client (biblioteca mantenida, certificada OIDC).
// - Descubre los endpoints desde https://accounts.google.com/.well-known/openid-configuration
// - Valida id_token (firma, iss, aud, exp, nonce) automáticamente.
// - PKCE S256 y state gestionados por la biblioteca.
// ====================================================================
const GOOGLE_ENABLED = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

let googleConfig = null
let googleConfigCargadaEn = 0
const GOOGLE_CONFIG_TTL_MS = 60 * 60 * 1000 // refrescar cada hora

const obtenerGoogleConfig = async () => {
    if (!GOOGLE_ENABLED) throw new Error('Google OAuth no está configurado en el servidor.')
    if (googleConfig && Date.now() - googleConfigCargadaEn < GOOGLE_CONFIG_TTL_MS) return googleConfig

    googleConfig = await discovery(
        new URL('https://accounts.google.com'),           // issuer → descubre /.well-known/openid-configuration
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    )
    googleConfigCargadaEn = Date.now()
    return googleConfig
}

// ====================================================================
// Busca el usuario por vínculo OAuth o correo verificado, o lo crea junto
// con su vínculo dentro de una transacción MySQL.
// ====================================================================
const buscarOCrearUsuarioOAuth = async (provider, perfil) => {
    if (!perfil?.providerId || !perfil?.email || !perfil.emailVerificado) {
        throw new Error('El proveedor no entregó un identificador y un correo verificado.')
    }

    const connection = await new Promise((resolve, reject) => {
        db.getConnection((err, conn) => err ? reject(err) : resolve(conn))
    })
    const query = (sql, params = []) => new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => err ? reject(err) : resolve(results))
    })
    const transaction = (method) => new Promise((resolve, reject) => {
        connection[method]((err) => err ? reject(err) : resolve())
    })

    try {
        await transaction('beginTransaction')
        // Si ya existe el vínculo, siempre se usa la cuenta local vinculada.
        const vinculos = await query(
            'SELECT u.id, u.nombre, u.email FROM usuarios u JOIN usuarios_oauth o ON o.usuario_id = u.id WHERE o.proveedor = ? AND o.proveedor_id = ? LIMIT 1',
            [provider, perfil.providerId]
        )
        if (vinculos.length) {
            await transaction('commit')
            return vinculos[0]
        }

        // Si el correo verificado ya tenía cuenta local, vincularla al
        // proveedor. Antes se retornaba sin guardar este vínculo.
        const usuarios = await query(
            'SELECT id, nombre, email FROM usuarios WHERE LOWER(email) = LOWER(?) LIMIT 1',
            [perfil.email]
        )
        let usuario = usuarios[0]

        if (!usuario) {
            const nombre = perfil.nombre || perfil.email.split('@')[0]
            const resultado = await query(
                'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?,?,NULL)',
                [nombre, perfil.email]
            )
            usuario = { id: resultado.insertId, nombre, email: perfil.email }
        }

        // El usuario y su vínculo se guardan en la misma transacción. Si
        // falla la tabla/migración OAuth, tampoco queda una cuenta a medias.
        await query(
            'INSERT INTO usuarios_oauth (usuario_id, proveedor, proveedor_id) VALUES (?,?,?)',
            [usuario.id, provider, perfil.providerId]
        )
        await transaction('commit')
        return usuario
    } catch (err) {
        await transaction('rollback').catch(() => {})
        throw err
    } finally {
        connection.release()
    }
}

// ============================================================
// GOOGLE: inicio de flujo con openid-client.
// Genera state + nonce + PKCE y redirige a accounts.google.com.
// ============================================================
app.get('/auth/google', async (req, res) => {
    try {
        const config = await obtenerGoogleConfig()

        // Parámetros que openid-client firmará/validará en el callback.
        const state = randomBytes(16).toString('hex')
        const nonce = randomBytes(16).toString('hex')
        // PKCE S256: verificador aleatorio de 32 bytes en base64url (43 chars,
        // dentro del rango RFC 7636: 43-128). El challenge es
        // BASE64URL(SHA256(ASCII(verifier))).
        const codeVerifier = randomBytes(32).toString('base64url')
        // IMPORTANTE: en openid-client v6 calculatePKCECodeChallenge devuelve
        // una Promise; hay que hacer await. Sin await se envía la cadena
        // "Promise { <pending> }" y Google responde:
        // "Code Challenge must be base64 encoded".
        const codeChallenge = await calculatePKCECodeChallenge(codeVerifier)

        if (typeof codeChallenge !== 'string' || codeChallenge.length !== 43) {
            throw new Error('El code_challenge generado no es base64url válido de 43 caracteres.')
        }

        // El verifier queda asociado al state y se recupera en el callback
        // para enviarlo al token endpoint (Google lo compara con el challenge).
        sesionesOAuth.set(state, { nonce, codeVerifier, provider: 'google', expira: Date.now() + 10 * 60 * 1000 })

        const redirectUri = obtenerRedirectUri('google')
        const url = buildAuthorizationUrl(config, {
            redirect_uri: redirectUri,
            scope: 'openid email profile',
            state,
            nonce,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            // Sugerir la cuenta si el usuario ya inició sesión en Google.
            prompt: 'consent select_account'
        })

        res.redirect(url.href)
    } catch (err) {
        console.error('Error al iniciar el flujo Google:', err.message)
        res.status(502).json({ error: 'No se pudo iniciar el inicio de sesión con Google.' })
    }
})

// ============================================================
// GOOGLE: callback. Ruta exacta: /auth/google/callback
// - Valida state (CSRF) y expiración de la sesión en memoria.
// - authorizationCodeGrant valida el id_token (firma, iss, aud,
//   exp, nonce) contra las JWKS de Google automáticamente.
// - Crea/recupera el usuario y emite NUESTRO propio JWT.
// ============================================================
app.get('/auth/google/callback', async (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const redirigirConError = (mensaje, detalle) => {
        // El detalle técnico solo va al log del servidor; al usuario solo
        // llega el mensaje genérico. Nunca se exponen tokens ni secretos.
        if (detalle) console.error('[google/callback]', detalle)
        return res.redirect(`${frontendUrl}/login?oauthError=${encodeURIComponent(mensaje)}`)
    }

    if (!GOOGLE_ENABLED) {
        return redirigirConError('Google OAuth no está configurado en el servidor.', 'Faltan GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET en el .env')
    }
    console.log('[google/callback] paso 1/5 OK: callback alcanzado; GOOGLE_ENABLED')
    if (req.query.error) {
        // El usuario canceló o Google reportó un error en la autorización.
        console.warn('[google/callback] error de autorización:', req.query.error, req.query.error_description || '')
        const mensaje = req.query.error === 'access_denied'
            ? 'Cancelaste el acceso en Google. Intenta de nuevo.'
            : 'Google rechazó la autorización. Intenta de nuevo.'
        return redirigirConError(mensaje)
    }

    const { code, state } = req.query
    console.log('[google/callback] paso 2/5: validando state y PKCE')
    const sesion = sesionesOAuth.get(state)
    sesionesOAuth.delete(state) // single-use: nunca se reutiliza un state

    if (!code || !sesion || sesion.provider !== 'google' || sesion.expira < Date.now()) {
        const motivo = !code ? 'falta el parámetro code'
            : !sesion ? 'state desconocido (sesión expirada o callback repetido)'
            : sesion.provider !== 'google' ? 'state de otro proveedor'
            : 'sesión expirada (>10 min)'
        return redirigirConError('Estado OAuth inválido o expirado. Intenta de nuevo.', `state invalido: ${motivo}`)
    }

    try {
        const config = await obtenerGoogleConfig()
        console.log('[google/callback] paso 3/5 OK: discovery del issuer listo')

        // Diagnóstico: nombres de los parámetros que Google envió en el
        // query string del redirect (nunca sus valores: sin code, tokens
        // ni datos personales).
        console.log('[google/callback] parámetros recibidos:', Object.keys(req.query).join(', '))
        if (!req.query.iss) {
            console.warn('[google/callback] aviso: Google no envió `iss` en este redirect')
        }

        // IMPORTANTE: pasar la URL COMPLETA que Google construyó (code, state
        // e iss incluidos). Reconstruirla a mano descarta el `iss` y
        // openid-client v6 —que lo exige cuando el issuer lo anuncia—
        // falla con: "response parameter \"iss\" (issuer) missing".
        // Solo se reescribe el host/puerto al redirect_uri registrado para
        // que la URL coincida con la del flujo inicial detrás de proxies.
        const redirectUri = new URL(obtenerRedirectUri('google'))
        const currentUrl = new URL(req.originalUrl, `${req.protocol}://${req.get('host')}`)
        currentUrl.protocol = redirectUri.protocol
        currentUrl.host = redirectUri.host
        currentUrl.port = redirectUri.port

        // Intercambio del código: la biblioteca valida iss, state y PKCE.
        // Google responde invalid_grant si el código ya se usó o expiró.
        const tokens = await authorizationCodeGrant(config, currentUrl, {
            pkceCodeVerifier: sesion.codeVerifier,
            expectedState: state,
            expectedNonce: sesion.nonce
        })
        console.log('[google/callback] paso 4/5 OK: código intercambiado por tokens; id_token validado (firma, iss, aud, exp, nonce)')

        // openid-client v6 adjunta claims() a la respuesta del grant. Devuelve
        // los claims del id_token ya validados por authorizationCodeGrant.
        const claims = tokens.claims()
        if (!claims) {
            return redirigirConError('Google no devolvió información de identidad.', 'id_token ausente en la respuesta validada')
        }
        const perfil = {
            providerId: claims.sub,
            email: claims.email,
            nombre: claims.name,
            emailVerificado: claims.email_verified === true
        }

        if (!perfil.email) {
            return redirigirConError('Google no compartió tu correo electrónico.', 'userinfo sin email (cuenta sin correo visible)')
        }
        if (!perfil.emailVerificado) {
            return redirigirConError('El correo de tu cuenta de Google no está verificado.', `email_verified=false para sub=${perfil.providerId}`)
        }

        let usuario
        try {
            usuario = await buscarOCrearUsuarioOAuth('google', perfil)
        } catch (errUsuario) {
            console.error('[google/callback] paso 5/5 FALLO: no se pudo crear o vincular el usuario en MySQL:', errUsuario.code || errUsuario.name)
            return redirigirConError('No se pudo crear o vincular tu usuario. Revisa que las migraciones de usuarios y OAuth estén aplicadas.')
        }

        console.log(`[google/callback] paso 5/5 OK: usuario id=${usuario.id} en MySQL; sesión emitida via JWT propio`)

        // Emitimos NUESTRO token de sesión (mismo formato que el login local).
        const token = createAccessToken(usuario)
        // El token viaja en el fragmento (#), nunca en la URL que el servidor ve.
        res.redirect(`${frontendUrl}/oauth-callback#token=${encodeURIComponent(token)}&usuario=${encodeURIComponent(JSON.stringify({ id: usuario.id, nombre: usuario.nombre, email: usuario.email }))}`)
    } catch (oauthErr) {
        //openid-client lanza OAuth2Error con error/error_description legibles.
        console.error('[google/callback] paso 4/5 FALLO: procesamiento de la respuesta de autorización')
        const oauth = oauthErr.error || oauthErr.cause?.error
        const desc = oauthErr.error_description || oauthErr.cause?.error_description || oauthErr.cause?.message || oauthErr.message
        console.error('[google/callback] detalle:', oauth || oauthErr.name, '-', desc)

        const mensaje = oauth === 'invalid_grant'
            ? 'El código de autorización expiró o ya se usó. Intenta de nuevo.'
            : 'No se pudo completar el inicio de sesión con Google.'
        redirigirConError(mensaje)
    }
})

// ---------------------------------------------------------------
// Paso 1 genérico (Microsoft/Facebook): redirige al proveedor.
// ---------------------------------------------------------------
const sesionesOAuth = new Map() // state -> { nonce, codeVerifier, provider, expira }

// Limpieza periódica: descarta sesiones OAuth expiradas de la memoria.
setInterval(() => {
    const ahora = Date.now()
    for (const [state, s] of sesionesOAuth) {
        if (s.expira < ahora) sesionesOAuth.delete(state)
    }
}, 5 * 60 * 1000).unref()

app.get('/auth/oauth/:provider', (req, res) => {
    const provider = req.params.provider
    const config = OAUTH_CONFIG[provider]

    if (!config || !config.enabled) {
        return res.status(404).json({ error: `El proveedor '${provider}' no está configurado en el servidor.` })
    }

    const state = randomBytes(16).toString('hex')
    const nonce = randomBytes(16).toString('hex')
    let codeVerifier = null
    let codeChallenge = null

    if (config.usePkce) {
        codeVerifier = randomBytes(32).toString('base64url')
        codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url')
    }

    // Expira en 10 minutos.
    sesionesOAuth.set(state, { nonce, codeVerifier, provider, expira: Date.now() + 10 * 60 * 1000 })

    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: obtenerRedirectUri(provider),
        response_type: 'code',
        scope: config.scope,
        state,
        nonce
    })
    if (codeChallenge) {
        params.set('code_challenge', codeChallenge)
        params.set('code_challenge_method', 'S256')
    }

    res.redirect(`${config.authUrl}?${params}`)
})

// ---------------------------------------------------------------
// Paso 2: el proveedor redirige aquí con ?code=&state=. Validamos
// state contra la sesión CSRF, intercambiamos el código por tokens,
// creamos/recuperamos el usuario y emitimos nuestro propio JWT.
// ---------------------------------------------------------------
app.get('/auth/oauth/:provider/callback', async (req, res) => {
    const provider = req.params.provider
    const config = OAUTH_CONFIG[provider]
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

    if (!config || !config.enabled) {
        return res.redirect(`${frontendUrl}/login?oauthError=${encodeURIComponent('Proveedor no configurado.')}`)
    }
    if (req.query.error) {
        return res.redirect(`${frontendUrl}/login?oauthError=${encodeURIComponent(req.query.error_description || req.query.error)}`)
    }

    const { code, state } = req.query
    const sesion = sesionesOAuth.get(state)
    sesionesOAuth.delete(state) // single-use

    if (!code || !sesion || sesion.provider !== provider || sesion.expira < Date.now()) {
        return res.redirect(`${frontendUrl}/login?oauthError=${encodeURIComponent('Estado OAuth inválido o expirado. Intenta de nuevo.')}`)
    }

    try {
        const perfil = await intercambiarCodigoYObtenerPerfil(provider, code, sesion.codeVerifier)

        if (!perfil.email) {
            return res.redirect(`${frontendUrl}/login?oauthError=${encodeURIComponent('El proveedor no compartió tu correo electrónico.')}`)
        }

        const registrarYEntrar = (usuario) => {
            const token = createAccessToken(usuario)
            // El token se entrega vía fragmento (#) para que no viaje en la URL del servidor.
            res.redirect(`${frontendUrl}/oauth-callback#token=${encodeURIComponent(token)}&usuario=${encodeURIComponent(JSON.stringify({ id: usuario.id, nombre: usuario.nombre, email: usuario.email }))}`)
        }

        // 1) ¿Ya existe el vínculo con ese proveedor?
        db.query(
            'SELECT u.id, u.nombre, u.email FROM usuarios u JOIN usuarios_oauth o ON o.usuario_id = u.id WHERE o.proveedor = ? AND o.proveedor_id = ? LIMIT 1',
            [provider, perfil.providerId],
            (errVinculo, vinculos) => {
                if (errVinculo) {
                    console.error(errVinculo)
                    return res.redirect(`${frontendUrl}/login?oauthError=${encodeURIComponent('Error al buscar el vínculo OAuth.')}`)
                }
                if (vinculos.length) return registrarYEntrar(vinculos[0])

                // 2) ¿Existe un usuario local con ese correo?
                db.query('SELECT id, nombre, email FROM usuarios WHERE LOWER(email) = LOWER(?) LIMIT 1', [perfil.email], (errUser, usuarios) => {
                    if (errUser) {
                        console.error(errUser)
                        return res.redirect(`${frontendUrl}/login?oauthError=${encodeURIComponent('Error al buscar el usuario.')}`)
                    }
                    if (usuarios.length) return registrarYEntrar(usuarios[0])

                    // 3) Crear usuario nuevo + vínculo OAuth.
                    db.query('INSERT INTO usuarios (nombre, email, password_hash) VALUES (?,?,NULL)', [perfil.nombre || perfil.email.split('@')[0], perfil.email], (errInsert, insertResult) => {
                        if (errInsert) {
                            console.error(errInsert)
                            return res.redirect(`${frontendUrl}/login?oauthError=${encodeURIComponent('No se pudo crear el usuario.')}`)
                        }
                        const nuevoUsuario = { id: insertResult.insertId, nombre: perfil.nombre || perfil.email.split('@')[0], email: perfil.email }
                        db.query('INSERT INTO usuarios_oauth (usuario_id, proveedor, proveedor_id) VALUES (?,?,?)',
                            [nuevoUsuario.id, provider, perfil.providerId],
                            (errVinculo2) => {
                                if (errVinculo2) console.error('No se pudo guardar el vínculo OAuth:', errVinculo2)
                                return registrarYEntrar(nuevoUsuario)
                            })
                    })
                })
            }
        )
    } catch (oauthErr) {
        console.error('Error OAuth:', oauthErr.message)
        res.redirect(`${frontendUrl}/login?oauthError=${encodeURIComponent('No se pudo completar el inicio de sesión con el proveedor.')}`)
    }
})

// ---------------------------------------------------------------
// Paso 3 (opcional, para clientes que no pueden leer el fragmento):
// intercambia un código de autorización recibido en el frontend.
// ---------------------------------------------------------------
app.post('/auth/oauth/:provider/token', async (req, res) => {
    const provider = req.params.provider
    const config = OAUTH_CONFIG[provider]
    const { code, codeVerifier, state } = req.body || {}

    if (!config || !config.enabled) {
        return res.status(404).json({ error: `El proveedor '${provider}' no está configurado en el servidor.` })
    }

    const sesion = sesionesOAuth.get(state)
    if (!code || !sesion || sesion.provider !== provider || sesion.expira < Date.now()) {
        return res.status(400).json({ error: 'Estado OAuth inválido o expirado. Intenta de nuevo.' })
    }
    sesionesOAuth.delete(state)

    try {
        const perfil = await intercambiarCodigoYObtenerPerfil(provider, code, codeVerifier || sesion.codeVerifier)
        if (!perfil.email) {
            return res.status(400).json({ error: 'El proveedor no compartió tu correo electrónico.' })
        }

        db.query(
            'SELECT u.id, u.nombre, u.email FROM usuarios u JOIN usuarios_oauth o ON o.usuario_id = u.id WHERE o.proveedor = ? AND o.proveedor_id = ? LIMIT 1',
            [provider, perfil.providerId],
            (errVinculo, vinculos) => {
                if (errVinculo) {
                    console.error(errVinculo)
                    return res.status(500).json({ error: 'Error al buscar el vínculo OAuth.' })
                }

                const responderConUsuario = (usuario) => res.json({
                    token: createAccessToken(usuario),
                    tokenType: 'Bearer',
                    expiresIn: TOKEN_TTL_SECONDS,
                    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
                })

                if (vinculos.length) return responderConUsuario(vinculos[0])

                db.query('SELECT id, nombre, email FROM usuarios WHERE LOWER(email) = LOWER(?) LIMIT 1', [perfil.email], (errUser, usuarios) => {
                    if (errUser) {
                        console.error(errUser)
                        return res.status(500).json({ error: 'Error al buscar el usuario.' })
                    }
                    if (usuarios.length) return responderConUsuario(usuarios[0])

                    db.query('INSERT INTO usuarios (nombre, email, password_hash) VALUES (?,?,NULL)', [perfil.nombre || perfil.email.split('@')[0], perfil.email], (errInsert, insertResult) => {
                        if (errInsert) {
                            console.error(errInsert)
                            return res.status(500).json({ error: 'No se pudo crear el usuario.' })
                        }
                        const nuevoUsuario = { id: insertResult.insertId, nombre: perfil.nombre || perfil.email.split('@')[0], email: perfil.email }
                        db.query('INSERT INTO usuarios_oauth (usuario_id, proveedor, proveedor_id) VALUES (?,?,?)',
                            [nuevoUsuario.id, provider, perfil.providerId],
                            (errVinculo2) => {
                                if (errVinculo2) console.error('No se pudo guardar el vínculo OAuth:', errVinculo2)
                                return responderConUsuario(nuevoUsuario)
                            })
                    })
                })
            }
        )
    } catch (oauthErr) {
        console.error('Error OAuth:', oauthErr.message)
        res.status(502).json({ error: 'No se pudo validar el inicio de sesión con el proveedor.' })
    }
})

// Solicita el restablecimiento: siempre responde 200 para no
// revelar si el correo existe o no (evita enumerar usuarios).
app.post('/auth/forgot-password', (req, res) => {
    const { email } = req.body || {}
    if (typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ error: 'El correo es obligatorio.' })
    }

    ensureResetTable((tableErr) => {
        if (tableErr) {
            console.error('Error al preparar la tabla de recuperación:', tableErr)
            return res.status(500).json({ error: 'No se pudo preparar la recuperación de contraseña.' })
        }

        const query = 'SELECT id, email FROM usuarios WHERE LOWER(email) = LOWER(?) LIMIT 1'
        db.query(query, [email.trim()], async (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Error al procesar la solicitud.' })
        }

        if (results.length) {
            const user = results[0]
            const resetToken = randomBytes(32).toString('hex')
            const tokenHash = sha256(resetToken)
            const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000)

            db.query(
                'INSERT INTO password_resets (usuario_id, token_hash, expires_at) VALUES (?,?,?)',
                [user.id, tokenHash, expiresAt],
                (insertErr) => {
                    if (insertErr) {
                        console.error(insertErr)
                        return res.status(500).json({ error: 'Error al generar el token de recuperación.' })
                    }

                    if (!SMTP_CONFIGURADO) {
                        // Sin SMTP: se devuelve el token para poder probar el flujo.
                        console.warn('SMTP no configurado: devolviendo resetToken en la respuesta (solo para desarrollo).')
                        return res.json({
                            message: 'SMTP no configurado. Token devuelto para pruebas.',
                            resetToken,
                            expiresAt
                        })
                    }

                    enviarCorreoRecuperacion(user.email, resetToken)
                        .then(() => res.json({
                            message: 'Si el correo existe, se envió un correo con el enlace y el token de recuperación.'
                        }))
                        .catch((mailErr) => {
                            console.error('Error SMTP:', mailErr.message, mailErr.code, mailErr.response)
                            // Fallback: si el correo falla (credenciales,
                            // cuota, red...), devolvemos el token para que
                            // el usuario pueda continuar el flujo igual.
                            res.json({
                                message: 'No se pudo enviar el correo. Token devuelto como respaldo.',
                                correoEnviado: false,
                                resetToken,
                                expiresAt
                            })
                        })
                }
            )
        } else {
            res.json({ message: 'Si el correo existe, se envió un enlace de recuperación.' })
        }
        })
    })
})

// Restablece la contraseña usando el token recibido.
app.post('/auth/reset-password', (req, res) => {
    const { token, password } = req.body || {}
    if (typeof token !== 'string' || !token.trim()) {
        return res.status(400).json({ error: 'El token es obligatorio.' })
    }
    if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' })
    }

    ensureResetTable((tableErr) => {
        if (tableErr) {
            console.error('Error al preparar la tabla de recuperación:', tableErr)
            return res.status(500).json({ error: 'No se pudo preparar la recuperación de contraseña.' })
        }

        const tokenHash = sha256(token.trim())
        const query = `
        SELECT pr.id, pr.usuario_id, pr.expires_at, pr.used_at, u.email
        FROM password_resets pr
        JOIN usuarios u ON u.id = pr.usuario_id
        WHERE pr.token_hash = ?
        ORDER BY pr.id DESC
        LIMIT 1`

        db.query(query, [tokenHash], async (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Error al validar el token.' })
        }

        const reset = results[0]
        if (!reset || reset.used_at || new Date(reset.expires_at) < new Date()) {
            return res.status(400).json({ error: 'Token inválido o expirado. Solicita uno nuevo.' })
        }

        try {
            const passwordHash = await hashPassword(password)
            db.query(
                'UPDATE usuarios SET password_hash = ? WHERE id = ?',
                [passwordHash, reset.usuario_id],
                (updateErr) => {
                    if (updateErr) {
                        console.error(updateErr)
                        return res.status(500).json({ error: 'Error al actualizar la contraseña.' })
                    }

                    // Marca el token como usado para que no se reutilice.
                    db.query('UPDATE password_resets SET used_at = NOW() WHERE id = ?', [reset.id])
                    res.json({ message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' })
                }
            )
        } catch (hashErr) {
            console.error(hashErr)
            res.status(500).json({ error: 'Error al proteger la contraseña.' })
        }
        })
    })
})

// Lista de end-points
// Devuelve el catálogo de productos de la panadería.
app.get('/productos', (req,res)=>{
    const query = 'SELECT id, nombre, descripcion, precio, descuento, iva, ruta_imagen FROM productos ORDER BY nombre'

    db.query(query, (err, results)=>{
        if (err){
            console.error(err)
            return res.status(500).json({ error: 'Error al obtener los productos' })
        }

        res.json(results)
    })
})

app.get('/usuarios', requireAuth, (req,res)=>{
    db.query("SELECT * FROM usuarios", (err, results)=>{
        if (err){
            console.error(err)
            res.status(500).send({
                error: 'Error al obtener los usuarios'
            })
        } else{
            res.json(results)
        }
    })
})

app.post('/usuarios/add', async (req, res) => {
    const { nombre, email, password } = req.body || {}
    if (typeof nombre !== 'string' || !nombre.trim() || typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ error: 'Nombre y correo son obligatorios.' })
    }

    if (password !== undefined && (typeof password !== 'string' || password.length < 8)) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' })
    }

    try {
        const passwordHash = password ? await hashPassword(password) : null
        const query = 'INSERT INTO usuarios (nombre, email, password_hash) VALUES(?,?,?)'
        db.query(query, [nombre.trim(), email.trim(), passwordHash], (err, results) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ error: 'Error al crear el usuario.' })
            }

            res.status(201).json({
                id: results.insertId,
                nombre: nombre.trim(),
                email: email.trim()
            })
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error al proteger la contraseña.' })
    }
})

app.post('/auth/login', (req, res) => {
    const { email, password } = req.body || {}
    if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' })
    }

    const query = 'SELECT id, nombre, email, password_hash FROM usuarios WHERE LOWER(email) = LOWER(?) LIMIT 1'
    db.query(query, [email.trim()], async (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Error al validar las credenciales.' })
        }

        const user = results[0]
        if (!user || !user.password_hash) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos.' })
        }

        try {
            const passwordIsValid = await verifyPassword(password, user.password_hash)
            if (!passwordIsValid) {
                return res.status(401).json({ error: 'Correo o contraseña incorrectos.' })
            }

            res.json({
                token: createAccessToken(user),
                tokenType: 'Bearer',
                expiresIn: TOKEN_TTL_SECONDS,
                usuario: { id: user.id, nombre: user.nombre, email: user.email }
            })
        } catch (verifyError) {
            console.error(verifyError)
            res.status(500).json({ error: 'Error al validar las credenciales.' })
        }
    })
})

app.put('/usuarios/update/:id', requireAuth, (req, res)=>{
    const {id} = req.params
    const {nombre, email}=req.body

    const query = 'UPDATE usuarios SET nombre =?, email=? WHERE id=?'

    db.query(query, [nombre, email, id], (err, results)=>{
        if(err){
           res.status(500).send({
                error: 'Error al actualizar el usuario'
           })
        } else{
            res.json({
                id,
                nombre,
                email
            })
        }
    })
})

app.delete('/usuarios/delete/:id', requireAuth, (req, res)=>{
    const {id} = req.params
    
    const query = "DELETE FROM usuarios WHERE id = ?"
    
    db.query(query,[id], (err, results)=>{
        if(err){
            res.status(500).send({
                error: 'Error al eliminar el usuario'
            })
        } else{
            res.status(204).send()
        }
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
