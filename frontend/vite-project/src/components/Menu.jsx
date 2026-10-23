import { Link } from "react-router-dom";

const estiloOpcionSesion = {
  background: "none",
  border: "none",
  padding: 0,
  font: "inherit",
  color: "#ffffff",
  cursor: "pointer",
  textDecoration: "underline",
};

const Menu = () => {
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
      <Link to="/" style={{ color: "#ffffff", textDecoration: "none" }}>Inicio</Link>
      <Link to="/usuarios" style={{ color: "#ffffff", textDecoration: "none" }}>Gestión de usuarios</Link>

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
          <Link to="/login" style={{ color: "#ffffff", textDecoration: "none" }}>Iniciar sesión</Link>
          <Link to="/registro" style={{ color: "#ffffff", textDecoration: "none" }}>Registrarse</Link>
          <button
            onClick={() => console.log("Logout")}
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

