import { useState } from "react";
import axios from "axios";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const RESET_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/reset-password`;

const CambiarContrasena = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // El token puede llegar desde la página de recuperación (state),
  // desde el enlace del correo (?token=...) o pegarse manualmente.
  const [token, setToken] = useState(
    searchParams.get("token") || location.state?.token || "",
  );
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    try {
      await axios.post(RESET_URL, { token: token.trim(), password });
      setExito(true);
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "No se pudo actualizar la contraseña. Intenta nuevamente.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="container-fluid py-4 py-lg-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <section className="card shadow-sm" aria-labelledby="titulo-cambiar">
            <div className="card-body p-4 p-md-5">
              <h1 id="titulo-cambiar" className="h3 card-title mb-2">
                Cambiar contraseña
              </h1>
              <p className="text-secondary mb-4">
                {location.state?.email
                  ? `Restablece la contraseña de ${location.state.email}.`
                  : "Ingresa el token de recuperación y tu nueva contraseña."}
              </p>
              {!token && (
                <div className="alert alert-info" role="alert">
                  No se detectó un token en el enlace. Pégalo manualmente en el
                  campo <strong>Token de recuperación</strong> (es el código que
                  recibiste al solicitar el restablecimiento).
                </div>
              )}

              {exito ? (
                <div className="alert alert-success" role="alert">
                  Contraseña actualizada correctamente. Redirigiendo al inicio
                  de sesión…
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="resetToken" className="form-label">
                      Token de recuperación
                    </label>
                    <input
                      id="resetToken"
                      className="form-control"
                      type="text"
                      value={token}
                      onChange={(event) => setToken(event.target.value)}
                      required
                    />
                    <div className="form-text">
                      Es el código que recibiste al solicitar la recuperación
                      (por correo o como token de respaldo en pantalla).
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="nuevaPassword" className="form-label">
                      Nueva contraseña
                    </label>
                    <div className="input-group">
                      <input
                        id="nuevaPassword"
                        className="form-control"
                        type={mostrarPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        minLength={8}
                        required
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setMostrarPassword((v) => !v)}
                        aria-label={
                          mostrarPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                        title={
                          mostrarPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {mostrarPassword ? "🙈" : "👁"}
                      </button>
                    </div>
                    <div className="form-text">Mínimo 8 caracteres.</div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmarPassword" className="form-label">
                      Confirmar contraseña
                    </label>
                    <input
                      id="confirmarPassword"
                      className="form-control"
                      type={mostrarPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmar}
                      onChange={(event) => setConfirmar(event.target.value)}
                      minLength={8}
                      required
                    />
                  </div>

                  <button
                    className="btn btn-primary w-100"
                    type="submit"
                    disabled={cargando}
                  >
                    {cargando ? "Guardando…" : "Cambiar contraseña"}
                  </button>
                </form>
              )}

              <p className="text-center mt-4 mb-0">
                <Link to="/login">Volver a iniciar sesión</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default CambiarContrasena;
