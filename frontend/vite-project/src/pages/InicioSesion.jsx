import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LOGIN_URL = "http://192.168.20.41:3000/auth/login";

const InicioSesion = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCargando(true);

    try {
      const { data } = await axios.post(LOGIN_URL, {
        email: email.trim(),
        password,
      });

      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "No se pudo iniciar sesión. Revisa la conexión con el servidor."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="container-fluid py-4 py-lg-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <section className="card shadow-sm" aria-labelledby="titulo-login">
            <div className="card-body p-4 p-md-5">
              <h1 id="titulo-login" className="h3 card-title mb-2">
                Iniciar sesión
              </h1>
              <p className="text-secondary mb-4">
                Ingresa tus datos para acceder a tu cuenta.
              </p>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">
                    Correo electrónico
                  </label>
                  <input
                    id="loginEmail"
                    className="form-control"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="loginPassword" className="form-label">
                    Contraseña
                  </label>
                  <div className="input-group">
                    <input
                      id="loginPassword"
                      className="form-control"
                      type={mostrarPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                          <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.3 4.5 9 7-.2.8-.8 1.8-1.7 2.8" />
                          <path d="M6.2 6.2C4 7.6 2.5 9.8 2 12c.7 2.5 4 7 10 7 1.2 0 2.3-.2 3.3-.6" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button className="btn btn-primary w-100" type="submit" disabled={cargando}>
                  {cargando ? "Ingresando…" : "Ingresar"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default InicioSesion;
