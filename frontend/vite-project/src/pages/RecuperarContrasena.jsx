import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth`;

const RecuperarContrasena = () => {
  const [email, setEmail] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [tokenRecibido, setTokenRecibido] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCargando(true);

    try {
      const { data } = await axios.post(`${BASE_URL}/forgot-password`, {
        email: email.trim(),
      });

      // Si el SMTP no está configurado o el envío falla, el backend
      // devuelve el token como respaldo para poder continuar el flujo.
      setTokenRecibido(data.resetToken || "");
      setMensaje(data.message || "");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "No se pudo procesar la solicitud. Intenta nuevamente.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="container-fluid py-4 py-lg-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <section
            className="card shadow-sm"
            aria-labelledby="titulo-recuperar"
          >
            <div className="card-body p-4 p-md-5">
              <h1 id="titulo-recuperar" className="h3 card-title mb-2">
                Recuperar contraseña
              </h1>
              <p className="text-secondary mb-4">
                Ingresa tu correo electrónico. Te enviaremos un enlace para
                cambiar la contraseña y el token de recuperación por si
                necesitas ingresarlo manualmente.
              </p>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor="recuperarEmail" className="form-label">
                    Correo electrónico
                  </label>
                  <input
                    id="recuperarEmail"
                    className="form-control"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={cargando}
                >
                  {cargando ? "Enviando…" : "Enviar instrucciones"}
                </button>
              </form>

              {mensaje && !tokenRecibido && (
                <div className="alert alert-success mt-3 mb-0" role="alert">
                  <p className="mb-2">
                    {mensaje} Revisa tu bandeja de entrada y la carpeta de
                    spam.
                  </p>
                  <Link
                    to="/cambiar-contrasena"
                    state={{ email: email.trim() }}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Ir al formulario para cambiar la contraseña
                  </Link>
                </div>
              )}
              {tokenRecibido && (
                <div className="alert alert-warning mt-3 mb-0" role="alert">
                  <p className="mb-1">{mensaje}</p>
                  <p className="mb-1">
                    <strong>Token de respaldo:</strong> cópialo y pégalo en la
                    página de cambio de contraseña:
                  </p>
                  <code className="d-block text-break">{tokenRecibido}</code>
                  <Link
                    to="/cambiar-contrasena"
                    state={{ email: email.trim(), token: tokenRecibido }}
                    className="btn btn-sm btn-outline-primary mt-2"
                  >
                    Cambiar contraseña ahora
                  </Link>
                </div>
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

export default RecuperarContrasena;
