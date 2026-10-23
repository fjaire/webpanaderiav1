
const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const { createHmac, randomBytes, scrypt, timingSafeEqual } = require('crypto')
const { promisify } = require('util')

const scryptAsync = promisify(scrypt)
const AUTH_SECRET = process.env.AUTH_SECRET || randomBytes(32)
const TOKEN_TTL_SECONDS = 60 * 60

if (!process.env.AUTH_SECRET) {
    console.warn('AUTH_SECRET no está definido; los tokens dejarán de ser válidos al reiniciar el servidor.')
}

const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'',
    database:'db_pruebas'
})

db.connect(err => {
    if (err){
        console.error("Error de conexion "+ err.stack)
        return
    }
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

// Lista de end-points
app.get('/usuarios', (req,res)=>{
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

app.put('/usuarios/update/:id', (req, res)=>{
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

app.delete('/usuarios/delete/:id', (req, res)=>{
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
