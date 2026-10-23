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

2) Adaptamos React Router al proyecto, lanzar el comando, en carpeta frontend/vite-project:
npm install react-router-dom

¿Por qué recomiendo esta organización?
- main.jsx configura el enrutador una sola vez para toda la aplicación.
- App.jsx concentra las rutas y facilita agregar páginas nuevas.
- CrudUsuarios.jsx conserva su responsabilidad de administrar usuarios.
- lazy() permite cargar el componente cuando se necesita y Suspense muestra el indicador de carga.

1. Principales ventajas de React Router

1. Navegación sin recargar la página

Permite cambiar entre vistas sin realizar una recarga completa del sitio. Esto hace que la navegación se sienta más fluida.




2. URLs independientes para cada sección

Puedes tener direcciones específicas para cada vista, como /usuarios, /reportes y /estadisticas. Facilita compartir enlaces y acceder directamente a una sección.




3. Organización del código

Cada página puede estar en su propio componente. Así evitas que App.jsx concentre toda la lógica de la aplicación.




4. Carga diferida con lazy()

Puedes cargar páginas solo cuando se necesitan. Esto ayuda a reducir el JavaScript inicial descargado en aplicaciones con muchas vistas.




5. Rutas protegidas

Puedes controlar qué vistas se muestran según el estado de autenticación o los permisos del usuario. Recuerda que la autorización real también debe validarse en el servidor.




6. Navegación programática

Con useNavigate() puedes redirigir al usuario después de iniciar sesión, guardar un registro o completar una operación.



2. Ejemplo aplicado a tu CRUD de usuarios
Imagina que tu aplicación crece y necesitas varias secciones:
Inicio

Ruta: /



Gestión de usuarios

Ruta: /usuarios



Estadísticas

Ruta: /estadisticas



Reportes

Ruta: /reportes

Cada ruta puede tener su propio componente, lo que facilita desarrollar, mantener y probar cada sección de forma independiente.

Por ejemplo, podrías usar Link para navegar sin recargar la página:
import { Link } from "react-router-dom";

<Link to="/usuarios">Gestionar usuarios</Link>
<Link to="/estadisticas">Ver estadísticas</Link>


Para que estos enlaces funcionen, debes declarar las rutas correspondientes en App.jsx.
3. ¿React Router mejora el rendimiento?
Puede ayudar, especialmente combinado con lazy() y Suspense, pero son conceptos diferentes:
Característica	Beneficio
React Router	Gestiona la navegación y las URLs.
lazy()	Permite cargar componentes bajo demanda.
Suspense	Muestra una interfaz provisional mientras se carga un componente compatible.
Link	Facilita navegar sin recargar toda la página.
React Router por sí solo no garantiza que la aplicación sea más rápida. El beneficio de rendimiento depende de cómo estructures y cargues tus componentes.
4. ¿Cuándo conviene utilizarlo?
- Aplicación de una sola vista: puede que no lo necesites todavía.
- CRUD con varias secciones: resulta útil para separar usuarios, reportes, estadísticas y otras vistas.
- Aplicación con autenticación: facilita organizar las rutas públicas y las que requieren sesión.
- Aplicación grande: permite estructurar la navegación y aplicar carga diferida por página.

3) El siguiente paso es instalar bootrstrap en carpeta vite, para la construccion del paginador:
npm install bootstrap