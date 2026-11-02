import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { FaGaugeHigh } from "react-icons/fa6";
import { FaHouse } from "react-icons/fa6";
import { FaRightToBracket, FaRightFromBracket } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import "../styles/PanaderiaLayout.css";

const claseItem = ({ isActive }) =>
  `menu-lateral__item${isActive ? " menu-lateral__item--activo" : ""}`;

const Menu = () => {
  const navigate = useNavigate();
  const estaLogueado = Boolean(localStorage.getItem("accessToken"));
  const [sesionAbierta, setSesionAbierta] = useState(false);

  // Recupera el nombre del usuario guardado al iniciar sesión.
  const obtenerNombreUsuario = () => {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
      return usuario?.nombre || "Usuario";
    } catch {
      return "Usuario";
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("usuario");
    navigate("/", { replace: true });
  };

  return (
    <nav className="menu-lateral">
      <Link to="/" className="menu-lateral__item">
        <img
          src="/logo.png"
          alt="Logo de la panadería"
          className="menu-lateral__logo"
          onError={(e) =>
            console.error("No se pudo cargar:", e.currentTarget.src)
          }
        />
      </Link>

      <NavLink to="/" end className={claseItem}>
        <FaHouse size={18} />
        <span>Inicio</span>
      </NavLink>

      <NavLink to="/panel-control" className={claseItem}>
        <FaGaugeHigh size={18} />
        <span>Panel de control</span>
      </NavLink>

      <NavLink to="/productos" className={claseItem}>
        <FaBoxesStacked size={18} />
        <span>Productos</span>
      </NavLink>

      {estaLogueado && (
        <NavLink
          to="/carrito"
          className={claseItem}
          aria-label="Ver carrito de compras"
        >
          <i className="bi bi-cart3"></i>
          <span>Carrito</span>
        </NavLink>
      )}

      {estaLogueado ? (
        <NavLink to="/usuarios" className={claseItem}>
          <FaUsers size={18} />
          <span>Gestión usuarios</span>
        </NavLink>
      ) : (
        <NavLink to="/login" className={claseItem}>
          <FaUserCircle size={18} />
          <span>Iniciar sesión</span>
        </NavLink>
      )}

      <details
        open={sesionAbierta}
        onToggle={(e) => setSesionAbierta(e.target.open)}
      >
        <summary className="menu-lateral__item">
          <FaUserCircle size={18} />
          <span>Sesión</span>
        </summary>
        <div className="menu-lateral__sub">
          <NavLink to="/login" className={claseItem}>
            <FaRightToBracket size={18} />
            <span>Iniciar sesión</span>
          </NavLink>
          <NavLink to="/registro" className={claseItem}>
            <FaUserPlus size={18} />
            <span>Registrarse</span>
          </NavLink>
          <button
            type="button"
            className="menu-lateral__item"
            onClick={cerrarSesion}
            style={{
              background: "none",
              border: "none",
              width: "100%",
              textAlign: "left",
            }}
          >
            <FaRightFromBracket size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </details>

      {/* Panel inferior del usuario, estilo AdminLTE */}
      <div className="menu-usuario mt-auto w-100">
        {estaLogueado ? (
          <div className="menu-usuario__panel">
            <span className="menu-usuario__avatar" aria-hidden="true">
              <i className="bi bi-person-circle"></i>
            </span>
            <div className="menu-usuario__datos">
              <span className="menu-usuario__nombre">
                {obtenerNombreUsuario()}
              </span>
              <span className="menu-usuario__rol">Sesión activa</span>
            </div>
            <button
              type="button"
              className="menu-usuario__salir"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              onClick={cerrarSesion}
            >
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="menu-usuario__panel menu-usuario__panel--enlace"
          >
            <span
              className="menu-usuario__avatar menu-usuario__avatar--anonimo"
              aria-hidden="true"
            >
              <i className="bi bi-person"></i>
            </span>
            <div className="menu-usuario__datos">
              <span className="menu-usuario__nombre">Invitado</span>
              <span className="menu-usuario__rol">Iniciar sesión</span>
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Menu;
