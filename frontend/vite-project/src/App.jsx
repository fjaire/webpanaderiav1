import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layouts/Layout";
import RutaProtegida from "./components/RutaProtegida";

const Inicio = lazy(() => import("./pages/Inicio"));
const CrudUsuarios = lazy(() => import("./pages/CrudUsuarios"));
const RegistroUsuarios = lazy(() => import("./pages/RegistroUsuarios"));
const InicioSesion = lazy(() => import("./pages/InicioSesion"));
const PortafolioPanaderia = lazy(() => import("./pages/PortafolioPanaderia"));

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

      {/* Página con diseño independiente */}
      <Route path="/productos" element={<PortafolioPanaderia />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default App;
