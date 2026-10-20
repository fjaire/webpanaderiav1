1- CONFIGURACION DEL ENTORNO:
a. Descarga de Noje.js version 24.22 windows installer .msi desde el sitio oficial:
https://nodejs.org/es/download
b. Instalar extension Spanish Language Pack for Visual Studio Code, para configurar vscode en español
c. Instalar extension vscode-icons
d. Utilizar vite para generar proyecto react. desde el terminal de vscode comando:
npm create vite@latest
e. en terminal de vscode:
npm install
instala dependencias del proyecto en package.json
f. instalar el paquete json-server via npm, desde terminal de vscode
https://www.npmjs.com/package/json-server
comando:
npm install json-server
para crear documentos, antes ubique en la carpeta src del proyecto:
npx json-server db.json
g. de este enlace se bajan los emoji
https://es.piliapp.com/emoji/list/
h. Instalar la libreria para instalar iconos desde la pagina oficial:
https://lucide.dev/guide/installation
i. Mejorar estilos css:
https://copy-paste-css.com/
j. sitio para descargar xampp contiene un servidor mysql
https://sourceforge.net/projects/xampp/

Nota: video 2,01,56 minutos.

Código Final
https://cuty.io/aVHsKgR

Luego, en las preguntas, seleccionar proyecto react, javascript y Eslint.

Video recursos:
Enlace: https://www.youtube.com/watch?v=2xhAcqhSuVU
Nombre: CURSO de REACT desde cero 2025 – Aprende React Desde Cero
Autor(canal): rocoDev
Fecha: 15 Jul 2025

avance: 16.30
Enlace: https://www.youtube.com/watch?v=KkmC8KJVc60
Nombre: CRUD usando MySQL, Node, Express, Vite y React
Autor: web.xcheko51x
Fecha: 18-12-2024

CONFIGURACION PARA NODE, EXPRESS.JS Y MYSQL - MODULO BACKEND
1. Configurar package.son, dentro carpeta backend
npm install

`npm install` instala las dependencias que ya están listadas en el `package.json` del proyecto. En tu caso instala React, Vite, `json-server` y otros paquetes del proyecto.

En cambio:

```bash
npm install mysql express cors
npm install -D nodemon
```

agrega esas dependencias nuevas al proyecto y actualiza `package.json` y `package-lock.json`.

Si solo querías instalar lo que el proyecto ya necesita, `npm install` era suficiente.
2. Siguiente configuracion, dentro carpeta backend
npm install mysql express cors nodemon

- mysql: permite que el servidor Node.js se conecte a una base de datos MySQL y ejecute consultas.
- express: sirve para crear un servidor web y una API, por ejemplo, rutas como /api/productos.
- cors: permite que el frontend React, si corre en otro puerto, pueda hacer solicitudes a esa API.
- nodemon: reinicia el servidor automáticamente cuando guardas cambios. Se suele instalar como dependencia de desarrollo.
En conjunto, se usan para agregar un backend/API con MySQL al proyecto React. React corre en el navegador; Express y MySQL se ejecutan en el servidor. mysql no instala MySQL Server: solo el conector.

2. Dentro de la carpeta webpanaderiav1 instalamos la ultima version de vite:
npm create vite@latest
3. Instalamos la dependencia de axios, en la carpeta vite-project:
npm install axios

usos:
Permite hacer peticiones http a una API o un servidor.



