// Reproduce el flujo completo desde el backend como lo ve el navegador:
// 1) GET /auth/google → captura la URL de autorización
// 2) GET a Google con esa URL → confirma que la cuenta-chooser carga
// (el paso de "elegir cuenta" requiere navegador; lo dejamos indicado)
// 3) GET /auth/google/callback con código falso pero state válido →
//    captura el error exacto que produce la redirección a ?oauthError=
require('dotenv').config()
const { discovery } = require('openid-client')

;(async () => {
  const base = 'http://localhost:3000'

  // 1) Iniciar flujo en el backend
  const r1 = await fetch(`${base}/auth/google`, { redirect: 'manual' })
  const authUrl = new URL(r1.headers.get('location'))
  console.log('1) Backend redirige a Google. Params:')
  console.log('   redirect_uri =', authUrl.searchParams.get('redirect_uri'))
  console.log('   state        =', authUrl.searchParams.get('state'))
  console.log('   code_challenge =', authUrl.searchParams.get('code_challenge'))

  // 2) Preguntar a Google si la URL es válida (esperamos 200 con chooser)
  const r2 = await fetch(authUrl, { redirect: 'follow' })
  console.log('2) GET a accounts.google.com → HTTP', r2.status)
  const html = await r2.text()
  if (html.includes('invalid_request') || html.includes('Error 400')) {
    console.log('   ⚠ Google rechaza la petición. Buscando detalles...')
    const m = html.match(/<div[^>]*>([^<]{10,120})<\/div>/)
    console.log(html.match(/invalid[^<]{0,100}/)?.[0] || '(sin detalle)')
  } else {
    console.log('   OK: Google muestra la pantalla de elección de cuenta.')
  }
})()
