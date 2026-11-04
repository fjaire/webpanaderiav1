// Reproduce el authorizationCodeGrant exactamente como lo llama index.js
// y dumpa TODAS las propiedades del error (message, cause, response).
require('dotenv').config()
const { discovery, authorizationCodeGrant } = require('openid-client')

;(async () => {
  const config = await discovery(
    new URL('https://accounts.google.com'),
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  const redirectUri = process.env.GOOGLE_CALLBACK_URL
  const currentUrl = new URL(`${redirectUri}?code=FAKE&state=fake`)
  try {
    await authorizationCodeGrant(config, currentUrl, {
      pkceCodeVerifier: 'a'.repeat(43),
      expectedState: 'fake',
      expectedNonce: 'fake-nonce'
    })
  } catch (e) {
    console.log('name :', e.name)
    console.log('code :', e.code)
    console.log('msg  :', e.message)
    console.log('cause:', e.cause?.message || e.cause)
    // some errors attach the parsed response
    for (const k of Object.getOwnPropertyNames(e)) {
      if (['stack', 'message', 'code', 'name'].includes(k)) continue
      try { console.log(`  ${k}:`, JSON.stringify(e[k]).slice(0, 300)) } catch { console.log(`  ${k}: [no serializable]`) }
    }
  }
})()
