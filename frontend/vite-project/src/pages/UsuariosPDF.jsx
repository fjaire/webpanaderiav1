import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingHorizontal: 32,
    paddingBottom: 35,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1f2937",
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#172554",
    padding: 18,
    borderRadius: 6,
    marginBottom: 16,
  },
  title: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: "#dbeafe",
    fontSize: 9,
  },
  cards: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  card: {
    flexGrow: 1,
    flexBasis: 0,
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardLabel: {
    color: "#64748b",
    fontSize: 8,
    marginBottom: 7,
  },
  cardValue: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#0f172a",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0f172a",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    paddingVertical: 8,
    paddingHorizontal: 7,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 7,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  id: { width: "10%" },
  name: { width: "29%" },
  email: { width: "43%" },
  status: { width: "18%" },
  statusConfigured: { color: "#15803d" },
  statusMissing: { color: "#b91c1c" },
  empty: {
    padding: 14,
    color: "#64748b",
    textAlign: "center",
    backgroundColor: "#ffffff",
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 32,
    right: 32,
    color: "#64748b",
    fontSize: 8,
    textAlign: "center",
  },
});

const tienePasswordConfigurada = (usuario) =>
  Boolean(usuario.password_configurada || usuario.password_hash);

const UsuariosPDF = ({ usuarios = [] }) => {
  const totalUsuarios = usuarios.length;
  const contrasenasConfiguradas = usuarios.filter(
    tienePasswordConfigurada,
  ).length;
  const contrasenasPendientes = totalUsuarios - contrasenasConfiguradas;
  const fechaGeneracion = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document title="Reporte de usuarios" author="Aplicación de usuarios">
      <Page size="A4" orientation="landscape" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard de usuarios</Text>
          <Text style={styles.subtitle}>
            Reporte general de usuarios registrados · Generado el{" "}
            {fechaGeneracion}
          </Text>
        </View>

        <View style={styles.cards}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>TOTAL DE USUARIOS</Text>
            <Text style={styles.cardValue}>{totalUsuarios}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>CONTRASEÑA CONFIGURADA</Text>
            <Text style={styles.cardValue}>{contrasenasConfiguradas}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>PENDIENTES DE CONFIGURAR</Text>
            <Text style={styles.cardValue}>{contrasenasPendientes}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Listado de usuarios</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader} fixed>
            <Text style={styles.id}>ID</Text>
            <Text style={styles.name}>Nombre</Text>
            <Text style={styles.email}>Correo electrónico</Text>
            <Text style={styles.status}>Estado</Text>
          </View>

          {usuarios.length > 0 ? (
            usuarios.map((usuario) => {
              const configurada = tienePasswordConfigurada(usuario);
              return (
                <View
                  style={styles.tableRow}
                  key={String(usuario.id)}
                  wrap={false}
                >
                  <Text style={styles.id}>{usuario.id ?? "—"}</Text>
                  <Text style={styles.name}>{usuario.nombre || "—"}</Text>
                  <Text style={styles.email}>{usuario.email || "—"}</Text>
                  <Text
                    style={[
                      styles.status,
                      configurada
                        ? styles.statusConfigured
                        : styles.statusMissing,
                    ]}
                  >
                    {configurada ? "Configurada" : "No configurada"}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.empty}>No hay usuarios registrados.</Text>
          )}
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Reporte de usuarios · Página ${pageNumber} de ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default UsuariosPDF;
