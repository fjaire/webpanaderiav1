import PanaderiaLayout from "../layouts/PanaderiaLayout";
import "../styles/PortafolioPanaderia.css";

function PortafolioPanaderia() {
  return (
    <PanaderiaLayout>
      <section className="container py-5">
        <h1 className="text-center mb-4">Nuestro portafolio de productos</h1>

        {/* Aquí va el catálogo de productos,
            los filtros y el carrito de compras. */}
      </section>
    </PanaderiaLayout>
  );
}

export default PortafolioPanaderia;
