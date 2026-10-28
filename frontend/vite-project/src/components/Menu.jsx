import { Link, useNavigate } from "react-router-dom";

const estiloOpcionSesion = {
  background: "none",
  border: "none",
  padding: 0,
  font: "inherit",
  color: "#ffffff",
  cursor: "pointer",
  textDecoration: "none",
};

const Menu = () => {
  const navigate = useNavigate();
  const estaLogueado = Boolean(localStorage.getItem("accessToken"));

  const cerrarSesion = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("usuario");
    navigate("/", { replace: true });
  };

  const estiloEnlace = {
    color: "#ffffff",
    textDecoration: "none",
  };

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        padding: "10px 16px",
      }}
    >
      <Link to="/" style={estiloEnlace}>
        Inicio
      </Link>

      <Link to="/productos" style={estiloEnlace}>
        Productos
      </Link>

      {estaLogueado ? (
        <Link to="/usuarios" style={estiloEnlace}>
          Gestión de usuarios
        </Link>
      ) : (
        <Link to="/login" style={estiloEnlace}>
          Gestión de usuarios (requiere iniciar sesión)
        </Link>
      )}

      <details>
        <summary
          style={{
            listStyle: "none",
            cursor: "pointer",
            color: "#ffffff",
            textDecoration: "underline",
          }}
        >
          Sesión ▾
        </summary>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            paddingLeft: "16px",
          }}
        >
          <Link to="/login" style={estiloEnlace}>
            Iniciar sesión
          </Link>

          <Link to="/registro" style={estiloEnlace}>
            Registrarse
          </Link>

          <button
            onClick={cerrarSesion}
            style={{ ...estiloOpcionSesion, textAlign: "left" }}
          >
            Cerrar sesión
          </button>
        </div>
      </details>
    </nav>
  );
};

export default Menu;
