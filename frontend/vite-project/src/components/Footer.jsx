const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#000000",
        color: "#ffffff",
        textAlign: "center",
        padding: "20px",
        marginTop: "auto",
      }}
    >
      <p style={{ margin: "0 0 8px" }}>
        &copy; {new Date().getFullYear()} Mi sitio web
      </p>

      <p style={{ margin: 0, fontSize: "14px" }}>
        Desarrollado con React y Vite
      </p>
    </footer>
  );
};

export default Footer;

