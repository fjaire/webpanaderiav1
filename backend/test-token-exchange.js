// Diagnóstico del intercambio de código con Google (usa credenciales del .env).
// Ejecutar con:  node test-token-exchange.js
require('dotenv').config()
const { discovery, authorizationCodeGrant } = require('openid-client')

;(async () => {
  console.log('GOOGLE_CALLBACK_URL =', process.env.GOOGLE_CALLBACK_URL)
  console.log('CLIENT_ID prefix    =', process.env.GOOGLE_CLIENT_ID?.slice(0, 12) + '...')
  console.log('SECRET presente     =', Boolean(process.env.GOOGLE_CLIENT_SECRET))

  try {
    const config = await discovery(
      new URL('https://accounts.google.com'),
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )
    console.log('Discovery OK. metadata:')
    console.log('  token_endpoint    =', config.serverMetadata().token_endpoint)
    console.log('  userinfo_endpoint =', config.serverMetadata().userinfo_endpoint)

    // Simular un intercambio con código falso para ver el error REAL que
    // devuelve Google (nos dirá qué está mal: redirect_uri, secret, etc.)
    const redirectUri = process.env.GOOGLE_CALLBACK_URL
    const fakeUrl = new URL(`${redirectUri}?code=FAKE_CODE_DIAG&state=diag`)
    try {
      await authorizationCodeGrant(config, fakeUrl, { pkceCodeVerifier: 'a'.repeat(43) })
      console.log('Inesperado: el intercambio se aceptó')
    } catch (e) {
      console.log('\n--- ERROR DEL INTERCAMBIO (código falso) ---')
      console.log('name   :', e.name)
      console.log('message:', e.message)
      if (e.error) console.log('oauth error      :', e.error)
      if (e.error_description) console.log('oauth description:', e.error_description)
      if (e.response?.body) console.log('body:', JSON.stringify(e.response.body))
      if (e.cause) console.log('cause:', e.cause?.message || e.cause)
    }
  } catch (e) {
    console.log('FALLO en discovery:', e.message)
  }
})()
