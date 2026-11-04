// Prueba local del cálculo PKCE (no hace peticiones de red, no usa secretos).
// Ejecutar con:  node test-pkce.js
const { calculatePKCECodeChallenge } = require('openid-client')
const { createHash, randomBytes } = require('crypto')

;(async () => {
  const verifier = randomBytes(32).toString('base64url')

  // 1) Lo que produce la biblioteca (con await, como debe ser)
  const challenge = await calculatePKCECodeChallenge(verifier)

  // 2) Referencia manual RFC 7636: BASE64URL(SHA256(ASCII(verifier)))
  const manual = createHash('sha256').update(verifier, 'ascii').digest('base64url')

  console.log('code_verifier       :', verifier, `(${verifier.length} chars)`)
  console.log('code_challenge (bib):', challenge)
  console.log('code_challenge (ref):', manual)
  console.log('coinciden           :', challenge === manual)
  console.log('longitud 43 (S256)  :', challenge.length === 43)
  console.log('solo base64url      :', /^[A-Za-z0-9_-]+$/.test(challenge))

  if (challenge === manual && challenge.length === 43 && /^[A-Za-z0-9_-]+$/.test(challenge)) {
    console.log('\nPKCE S256 OK: el challenge enviado a Google es válido.')
    process.exit(0)
  }
  console.error('\nFALLO en el cálculo PKCE.')
  process.exit(1)
})()
