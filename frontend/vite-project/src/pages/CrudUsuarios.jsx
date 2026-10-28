
import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://192.168.20.41:3000/usuarios";

const authHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const CrudUsuarios = () => {
  const [items, setItems] = useState([]);
  const [newNombre, setNewNombre] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalPages = Math.max(
    1,
    Math.ceil(items.length / itemsPerPage)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const itemsPaginados = items.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Ajustar la página si se eliminan usuarios
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    axios
      .get(BASE_URL, { headers: authHeaders() })
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los items:", error);
      });
  }, []);

  const handleCreate = () => {
    if (newNombre.trim() && newEmail.trim() && newPassword.length >= 8) {
      axios
        .post(`${BASE_URL}/add`, {
          nombre: newNombre,
          email: newEmail,
          password: newPassword,
        }, { headers: authHeaders() })
        .then((response) => {
          setItems((prevItems) => [
            ...prevItems,
            { ...response.data, password_configurada: true },
          ]);
          setCurrentPage(
            Math.ceil((items.length + 1) / itemsPerPage)
          );
          setNewNombre("");
          setNewEmail("");
          setNewPassword("");
        })
        .catch((error) => {
          console.error("Error al crear un item:", error);
        });
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`${BASE_URL}/delete/${id}`, { headers: authHeaders() })
      .then(() => {
        setItems((prevItems) =>
          prevItems.filter((item) => item.id !== id)
        );
      })
      .catch((error) => {
        console.error("Error al eliminar el item:", error);
      });
  };

  const handleUpdate = (id, nombre, email) => {
    const newNombre = prompt("Nuevo nombre:", nombre);
    const newEmail = prompt("Nuevo email:", email);

    if (
      newNombre !== null &&
      newEmail !== null &&
      newNombre.trim() &&
      newEmail.trim() &&
      (newNombre !== nombre || newEmail !== email)
    ) {
      axios
        .put(`${BASE_URL}/update/${id}`, {
          nombre: newNombre,
          email: newEmail,
        }, { headers: authHeaders() })
        .then(() => {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id
                ? { ...item, nombre: newNombre, email: newEmail }
                : item
            )
          );
        })
        .catch((error) => {
          console.error("Error al actualizar el item:", error);
        });
    }
  };

  const estiloEnlace = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "8px 12px",
    textDecoration: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  };

  const estiloImagen = {
    width: "20px",
    height: "20px",
    objectFit: "contain",
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        backgroundColor: "#181A1B",
        color: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          textAlign: "center",
          padding: "25px",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ color: "#ffffff", marginBottom:"25px" }}>Listado de usuarios</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "25px",
          }}
        >
          <input
            type="text"
            value={newNombre}
            onChange={(e) => setNewNombre(e.target.value)}
            placeholder="Nombre"
            style={{ padding: "10px" }}
          />

          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Email"
            style={{ padding: "10px" }}
          />

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Contraseña (mínimo 8 caracteres)"
            autoComplete="new-password"
            minLength={8}
            required
            style={{ padding: "10px" }}
          />

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleCreate();
            }}
            style={{
              ...estiloEnlace,
              backgroundColor: "var(--action-success)",
              color: "#fff",
            }}
          >
            <img
              src="/imagenes/crear.png"
              alt=""
              style={estiloImagen}
            />
            Crear
          </a>
        </div>

        {/* Selector de cantidad de usuarios por página */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="itemsPerPage" className="form-label mb-0">
              Mostrar:
            </label>

            <select
              id="itemsPerPage"
              className="form-select form-select-sm"
              style={{ width: "90px" }}
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>

            <span>usuarios</span>
          </div>

          <small className="text-secondary">
            {items.length === 0
              ? "Mostrando 0 usuarios"
              : `Mostrando ${startIndex + 1}–${Math.min(
                  startIndex + itemsPerPage,
                  items.length
                )} de ${items.length} usuarios`}
          </small>
        </div>

        <ul
          className="list-unstyled"
          style={{ padding: 0, margin: 0 }}
        >
          {itemsPaginados.map((item) => (
            <li
              key={item.id}
              className="user-card border rounded-3 shadow-sm"
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                padding: "15px",
                marginBottom: "10px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <span className="text-secondary">{item.id}</span>
              <span className="fw-semibold">{item.nombre}</span>
              <span className="text-secondary">{item.email}</span>
              <span className="text-secondary">
                password_hash: {item.password_configurada || item.password_hash ? "Configurada" : "No configurada"}
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginLeft: "auto",
                }}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpdate(item.id, item.nombre, item.email);
                  }}
                  style={{
                    ...estiloEnlace,
                    backgroundColor: "#0d6efd",
                    color: "#ffffff",
                  }}
                >
                  <img
                    src="/imagenes/actualizar.png"
                    alt="Actualizar"
                    style={estiloImagen}
                  />
                  
                </a>

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(item.id);
                  }}
                  style={{
                    ...estiloEnlace,
                    backgroundColor: "#8ce6a9",
                    color: "#173b25",
                  }}
                >
                  <img
                    src="/imagenes/eliminar.png"
                    alt="Eliminar"
                    style={estiloImagen}
                  />
                  
                </a>
              </div>
            </li>
          ))}

          {items.length === 0 && (
            <li className="alert user-card border">
              No hay usuarios registrados.
            </li>
          )}
        </ul>

        {/* Paginador Bootstrap */}
        {items.length > 0 && (
          <nav
            aria-label="Paginación de usuarios"
            className="mt-4"
          >
            <ul className="pagination justify-content-center flex-wrap">
              <li
                className={`page-item ${
                  currentPage === 1 ? "disabled" : ""
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  Primera
                </button>
              </li>

              <li
                className={`page-item ${
                  currentPage === 1 ? "disabled" : ""
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => page - 1)
                  }
                >
                  Anterior
                </button>
              </li>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <li
                  key={page}
                  className={`page-item ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    aria-current={
                      currentPage === page ? "page" : undefined
                    }
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => page + 1)
                  }
                >
                  Siguiente
                </button>
              </li>

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  Última
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default CrudUsuarios;
