// Script de verificación SMTP: valida el login con Gmail y envía
// un correo de prueba a la misma cuenta configurada en .env.
// Ejecutar con:  node test-smtp.js
require('dotenv').config()
const nodemailer = require('nodemailer')

console.log('SMTP_USER:', process.env.SMTP_USER)
console.log('SMTP_PASS longitud:', (process.env.SMTP_PASS || '').length)

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

transporter.verify()
  .then(() => {
    console.log('SMTP OK: login exitoso')
    return transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'Prueba SMTP - Panadería',
      text: 'Si ves este correo en tu bandeja, el envío funciona.'
    }).then(info => console.log('Correo enviado:', info.response))
  })
  .catch(err => {
    console.error('FALLO SMTP:', err.message)
    if (err.code) console.error('Código:', err.code)
    if (err.response) console.error('Respuesta del servidor:', err.response)
    process.exit(1)
  })
