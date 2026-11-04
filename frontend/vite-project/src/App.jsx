import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layouts/Layout";
import RutaProtegida from "./components/RutaProtegida";

const Inicio = lazy(() => import("./pages/Inicio"));
const CrudUsuarios = lazy(() => import("./pages/CrudUsuarios"));
const RegistroUsuarios = lazy(() => import("./pages/RegistroUsuarios"));
const InicioSesion = lazy(() => import("./pages/InicioSesion"));
const RecuperarContrasena = lazy(() => import("./pages/RecuperarContrasena"));
const CambiarContrasena = lazy(() => import("./pages/CambiarContrasena"));
const PortafolioPanaderia = lazy(() => import("./pages/PortafolioPanaderia"));
const DetalleProducto = lazy(() => import("./pages/DetalleProducto"));
const CarritoCompras = lazy(() => import("./pages/CarritoCompras"));
const OAuthCallback = lazy(() => import("./pages/OAuthCallback"));

const App = () => (
  <Suspense fallback={<p className="p-3">Cargando página...</p>}>
    <Routes>
      {/* Páginas con el layout actual */}
      <Route
        path="/"
        element={
          <Layout>
            <Inicio />
          </Layout>
        }
      />

      <Route
        path="/usuarios"
        element={
          <Layout>
            <RutaProtegida>
              <CrudUsuarios />
            </RutaProtegida>
          </Layout>
        }
      />

      <Route
        path="/registro"
        element={
          <Layout>
            <RegistroUsuarios />
          </Layout>
        }
      />

      <Route
        path="/login"
        element={
          <Layout>
            <InicioSesion />
          </Layout>
        }
      />

      <Route
        path="/recuperar-contrasena"
        element={
          <Layout>
            <RecuperarContrasena />
          </Layout>
        }
      />

      {/* Página que recibe el token tras el OAuth del proveedor */}
      <Route path="/oauth-callback" element={<OAuthCallback />} />

      <Route
        path="/cambiar-contrasena"
        element={
          <Layout>
            <CambiarContrasena />
          </Layout>
        }
      />

      {/* Página con diseño independiente */}
      <Route path="/productos" element={<PortafolioPanaderia />} />
      <Route path="/productos/:id" element={<DetalleProducto />} />
      <Route
        path="/carrito"
        element={
          <RutaProtegida>
            <CarritoCompras />
          </RutaProtegida>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default App;
