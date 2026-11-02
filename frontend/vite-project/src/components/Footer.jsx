import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [suscrito, setSuscrito] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSuscrito(true);
      setEmail("");
    }
  };

  const contactCards = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2z" />
        </svg>
      ),
      text: "(57) 3113617588",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
      text: "fjaire@hotmail.com",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
        </svg>
      ),
      text: "Calle 83 Sur #94-21, Bosa",
    },
  ];

  const linkColumns = [
    {
      title: "Acerca de",
      links: ["Nuestra historia", "Premios", "Nuestro equipo", "Carreras"],
    },
    {
      title: "Empresa",
      links: ["Nuestros servicios", "Clientes", "Contacto", "Prensa"],
    },
    {
      title: "Recursos",
      links: ["Blog", "Boletín", "Política de privacidad"],
    },
  ];

  const socialIcons = [
    {
      label: "Twitter",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23 4.9c-.8.4-1.7.6-2.6.8a4.5 4.5 0 0 0 2-2.5c-.9.5-1.9.9-2.9 1.1a4.5 4.5 0 0 0-7.7 4.1 12.8 12.8 0 0 1-9.3-4.7 4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.5v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 18.7a12.7 12.7 0 0 0 6.9 2c8.3 0 12.8-6.8 12.8-12.8v-.6c.9-.6 1.6-1.4 2.3-2.4z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 9h3l-.5 3H14v10h-3V12H8V9h3V7a3.5 3.5 0 0 1 3.5-3.5H17v3h-2a1 1 0 0 0-1 1v1.5z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.3a3.8 3.8 0 0 1-.9 1.4c-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.3.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.3-.4a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.2-.4-.4-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1 0-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.3-.6.7-.8 1.2-.2.4-.3 1-.4 2.1C3.9 9.5 3.9 9.9 3.9 13s0 3.5.1 4.7c0 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.3.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1 0 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.3.6-.7.8-1.2.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1.1-.2-1.7-.4-2.1a2.3 2.3 0 0 0-.8-1.2 2.3 2.3 0 0 0-1.2-.8c-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zm5.2-2.1a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      style={{
        backgroundColor: "#181818",
        color: "#bdbdbd",
        padding: "60px 24px 30px",
        marginTop: "auto",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          maxWidth: "1140px",
          margin: "0 auto",
        }}
      >
        {/* Tarjetas de contacto */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginBottom: "60px",
          }}
        >
          {contactCards.map((card, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#212121",
                borderRadius: "8px",
                padding: "32px 24px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "#3b82f6",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                {card.icon}
              </div>
              <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.6 }}>
                {card.text}
              </p>
            </div>
          ))}
        </div>

        {/* Columnas de enlaces y suscripción */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "32px",
            marginBottom: "50px",
          }}
        >
          {linkColumns.map((col, i) => (
            <div key={i}>
              <h4
                style={{
                  color: "#ffffff",
                  fontSize: "18px",
                  fontWeight: 600,
                  margin: "0 0 20px",
                }}
              >
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((link, j) => (
                  <li key={j} style={{ marginBottom: "12px" }}>
                    <a
                      href="#"
                      style={{
                        color: "#9e9e9e",
                        textDecoration: "none",
                        fontSize: "15px",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                      onMouseLeave={(e) => (e.target.style.color = "#9e9e9e")}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4
              style={{
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: 600,
                margin: "0 0 20px",
              }}
            >
              Suscríbete
            </h4>
            <form onSubmit={handleSubscribe} style={{ display: "flex" }}>
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "12px 14px",
                  border: "none",
                  borderRadius: "4px 0 0 4px",
                  backgroundColor: "#ffffff",
                  color: "#333333",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "0 4px 4px 0",
                  backgroundColor: "#3b82f6",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Suscribirse
              </button>
            </form>
            <p
              style={{ margin: "12px 0 0", fontSize: "14px", color: "#9e9e9e" }}
            >
              {suscrito
                ? "¡Gracias por suscribirte! Recibirás novedades en tu correo."
                : "Recibe novedades y promociones en tu correo."}
            </p>
          </div>
        </div>

        {/* Línea inferior: copyright y redes sociales */}
        <div
          style={{
            borderTop: "1px solid #2e2e2e",
            paddingTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ margin: 0, fontSize: "14px" }}>
            &copy; {new Date().getFullYear()} Todos los derechos reservados.
            Panadería Alvarado.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            {socialIcons.map((s, i) => (
              <a
                key={i}
                href="#"
                aria-label={s.label}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#2e2e2e",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
