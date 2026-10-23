import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";

const Inicio = lazy(() => import("./pages/Inicio"));
const CrudUsuarios = lazy(() => import("./pages/CrudUsuarios"));
const RegistroUsuarios = lazy(() => import("./pages/RegistroUsuarios"));
const InicioSesion = lazy(() => import("./pages/InicioSesion"));

const App = () => (
  <Layout>
    <Suspense fallback={<p className="p-3">Cargando página...</p>}>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/usuarios" element={<CrudUsuarios />} />
        <Route path="/registro" element={<RegistroUsuarios />} />
        <Route path="/login" element={<InicioSesion />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </Layout>
);

export default App;
