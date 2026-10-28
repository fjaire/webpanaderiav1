import { Navigate } from "react-router-dom";

const RutaProtegida = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  const usuario = localStorage.getItem("usuario");

  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutaProtegida;
