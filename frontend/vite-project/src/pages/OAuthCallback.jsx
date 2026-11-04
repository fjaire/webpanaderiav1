import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// La API base del backend. En desarrollo: localhost. VITE_API_URL permite
// sobreescribir sin tocar el código.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Lee el fragmento (#) que el backend entrega tras el callback OAuth:
//   /oauth-callback#token=...&usuario=...
const leerFragmento = () => {
  const fragmento = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(fragmento);
  return {
    token: params.get("token"),
    usuario: params.get("usuario"),
    error: params.get("error"),
  };
};

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const { token, usuario, error: errorFragmento } = leerFragmento();

    if (errorFragmento) {
      setError(errorFragmento);
      setTimeout(() => navigate("/login", { replace: true }), 3000);
      return;
    }

    if (!token || !usuario) {
      setError("No se recibieron datos de sesión válidos.");
      setTimeout(() => navigate("/login", { replace: true }), 3000);
      return;
    }

    try {
      const usuarioParseado = JSON.parse(usuario);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("usuario", JSON.stringify(usuarioParseado));
      navigate("/", { replace: true });
    } catch {
      setError("Datos de sesión corruptos.");
      setTimeout(() => navigate("/login", { replace: true }), 3000);
    }
  }, [navigate]);

  return (
    <main className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 text-center">
          {error ? (
            <>
              <h1 className="h3 text-danger">Error de inicio de sesión</h1>
              <p className="text-secondary">{error}</p>
              <p className="text-secondary small">
                Serás redirigido al inicio de sesión…
              </p>
            </>
          ) : (
            <>
              <h1 className="h3">Finalizando inicio de sesión…</h1>
              <div className="spinner-border text-primary mt-3" role="status">
                <span className="visually-hidden">Cargando…</span>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default OAuthCallback;
