import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PanaderiaLayout from "../layouts/PanaderiaLayout";
import "../styles/PortafolioPanaderia.css";

const API_URL = "http://localhost:3000/productos";

const IMAGEN_PREDETERMINADA =
  "data:image/svg+xml;base64," +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="#f3e5d8"/><text x="150" y="105" text-anchor="middle" font-family="Arial" font-size="14" fill="#a1887f">Sin imagen</text></svg>',
  );

const formatearPrecio = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);

const construirUrlImagen = (ruta) => {
  if (!ruta) return IMAGEN_PREDETERMINADA;

  const coincide = ruta.match(/Imagenes[\\/]panaderia[\\/](.+)$/i);
  if (coincide) {
    return `http://localhost:3000/imagenes/panaderia/${encodeURIComponent(coincide[1])}`;
  }

  return IMAGEN_PREDETERMINADA;
};

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [mensajeCarrito, setMensajeCarrito] = useState(null);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error("No se pudo cargar el producto.");
        const productos = await respuesta.json();
        const encontrado = productos.find((p) => String(p.id) === String(id));

        if (!encontrado) throw new Error("Producto no encontrado.");
        setProducto(encontrado);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarProducto();
  }, [id]);

  if (cargando) {
    return (
      <PanaderiaLayout>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </PanaderiaLayout>
    );
  }

  if (error || !producto) {
    return (
      <PanaderiaLayout>
        <div className="alert alert-danger text-center my-5" role="alert">
          {error || "Producto no encontrado."}
        </div>
        <div className="text-center">
          <Link to="/productos" className="btn btn-primary">
            Volver al portafolio
          </Link>
        </div>
      </PanaderiaLayout>
    );
  }

  const precioConDescuento =
    producto.precio * (1 - (producto.descuento || 0) / 100);
  const valorIva = precioConDescuento * ((producto.iva || 0) / 100);

  // Guarda el producto en el carrito persistente del navegador (localStorage).
  const agregarAlCarrito = () => {
    try {
      const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
      const existente = carrito.find(
        (item) => String(item.id) === String(producto.id),
      );

      if (existente) {
        existente.cantidad += cantidad;
      } else {
        carrito.push({
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          descuento: producto.descuento,
          iva: producto.iva,
          ruta_imagen: producto.ruta_imagen,
          cantidad,
        });
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      setMensajeCarrito(
        `Se agregaron ${cantidad} unidad(es) de "${producto.nombre}" al carrito.`,
      );

      // Redirige a la página del carrito después de agregar.
      window.setTimeout(() => navigate("/carrito"), 900);
    } catch {
      setMensajeCarrito("No se pudo agregar el producto al carrito.");
    }

    window.clearTimeout(agregarAlCarrito._temporizador);
    agregarAlCarrito._temporizador = window.setTimeout(
      () => setMensajeCarrito(null),
      3500,
    );
  };

  return (
    <PanaderiaLayout>
      <section className="container py-5">
        <Link to="/productos" className="btn btn-outline-secondary mb-4">
          ← Volver al portafolio
        </Link>

        <div className="card shadow-sm">
          <div className="row g-0">
            <div className="col-md-6">
              <img
                src={construirUrlImagen(producto.ruta_imagen)}
                className="img-fluid h-100 w-100"
                style={{ objectFit: "cover" }}
                alt={producto.nombre}
                onError={(evento) => {
                  evento.currentTarget.src = IMAGEN_PREDETERMINADA;
                }}
              />
            </div>
            <div className="col-md-6">
              <div className="card-body p-4">
                <h1 className="card-title">{producto.nombre}</h1>
                <p className="card-text text-muted">{producto.descripcion}</p>

                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item">
                    <strong>Precio:</strong> {formatearPrecio(producto.precio)}
                  </li>
                  <li className="list-group-item">
                    <strong>Descuento:</strong>{" "}
                    {producto.descuento
                      ? `${producto.descuento}%`
                      : "Sin descuento"}
                  </li>
                  <li className="list-group-item">
                    <strong>IVA:</strong> {producto.iva}%
                  </li>
                  {producto.descuento > 0 && (
                    <li className="list-group-item text-success fw-bold">
                      Precio con descuento + IVA:{" "}
                      {formatearPrecio(precioConDescuento + valorIva)}
                    </li>
                  )}
                </ul>

                <div className="d-flex align-items-center gap-3 mt-3">
                  <div className="input-group" style={{ maxWidth: "150px" }}>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      aria-label="Reducir cantidad"
                      onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="form-control text-center"
                      min="1"
                      value={cantidad}
                      aria-label="Cantidad"
                      onChange={(evento) =>
                        setCantidad(
                          Math.max(1, Number(evento.target.value) || 1),
                        )
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      aria-label="Aumentar cantidad"
                      onClick={() => setCantidad((c) => c + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn boton-agregar-carrito"
                    onClick={agregarAlCarrito}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Agregar al carrito
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={() => navigate("/carrito")}
                  >
                    <i className="bi bi-cart3 me-2"></i>
                    Ir al carrito
                  </button>
                </div>

                {mensajeCarrito && (
                  <div className="alert alert-success mt-3 mb-0" role="alert">
                    {mensajeCarrito}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PanaderiaLayout>
  );
};

export default DetalleProducto;
