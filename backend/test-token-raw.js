// Diagnóstico HTTP crudo del token endpoint de Google (sin openid-client).
// Muestra la respuesta REAL de Google ante un código inválido.
// Ejecutar con:  node test-token-raw.js
require('dotenv').config()

;(async () => {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: 'FAKE_CODE_DIAGNOSTICO',
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    code_verifier: 'a'.repeat(43)
  })

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  })
  const text = await resp.text()
  console.log('HTTP', resp.status)
  console.log(text)
})()
