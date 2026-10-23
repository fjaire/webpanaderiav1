import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://192.168.20.41:3000/usuarios";

const RegistroUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(BASE_URL)
      .then(({ data }) => setUsuarios(data))
      .catch(() => setError("No se pudo cargar la tabla de usuarios."))
      .finally(() => setCargando(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nuevoUsuario = {
      nombre: nombre.trim(),
      email: email.trim(),
      password,
    };

    if (!nuevoUsuario.nombre || !nuevoUsuario.email || password.length < 8) return;

    setGuardando(true);
    setError("");

    try {
      const { data } = await axios.post(`${BASE_URL}/add`, nuevoUsuario);
      setUsuarios((usuariosActuales) => [...usuariosActuales, data]);
      setNombre("");
      setEmail("");
      setPassword("");
    } catch {
      setError("No se pudo registrar el usuario. Intenta nuevamente.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="container py-4 py-lg-5">
      <div className="row justify-content-center">
        <div className="col-12">
          <header className="mb-4">
            <h1 className="h2 mb-1">Registro de usuarios</h1>
            <p className="text-secondary mb-0">
              Completa tus datos para crear una cuenta.
            </p>
          </header>

          <section className="card shadow-sm mb-4" aria-labelledby="titulo-formulario">
            <div className="card-body p-4">
              <h2 id="titulo-formulario" className="h5 card-title mb-3">
                Datos del usuario
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="row g-3 align-items-start">
                  <div className="col-12 col-md-3">
                    <label htmlFor="nombreUsuario" className="form-label">
                      Nombre
                    </label>
                    <input
                      id="nombreUsuario"
                      className="form-control"
                      type="text"
                      value={nombre}
                      onChange={(event) => setNombre(event.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="col-12 col-md-3">
                    <label htmlFor="emailUsuario" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      id="emailUsuario"
                      className="form-control"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="col-12 col-md-3">
                    <label htmlFor="passwordUsuario" className="form-label">
                      Contraseña
                    </label>
                    <div className="input-group">
                      <input
                        id="passwordUsuario"
                        className="form-control"
                        type={mostrarPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setMostrarPassword((visible) => !visible)}
                        aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        aria-pressed={mostrarPassword}
                        title={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {mostrarPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M3 3l18 18" />
                            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                            <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.3 4.5 9 7-.2.8-.8 1.8-1.7 2.8" />
                            <path d="M6.2 6.2C4 7.6 2.5 9.8 2 12c.7 2.5 4 7 10 7 1.2 0 2.3-.2 3.3-.6" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="form-text">Mínimo 8 caracteres.</div>
                  </div>
                  <div className="col-12 col-md-3 d-grid">
                    <label className="form-label d-none d-md-block invisible" aria-hidden="true">
                      Registrar
                    </label>
                    <button className="btn btn-success" type="submit" disabled={guardando}>
                      {guardando ? "Registrando…" : "Registrar"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>

          {error && <div className="alert alert-danger" role="alert">{error}</div>}

        </div>
      </div>
    </main>
  );
};

export default RegistroUsuarios;
