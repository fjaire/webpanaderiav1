import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PanaderiaLayout from "../layouts/PanaderiaLayout";
import "../styles/PortafolioPanaderia.css";

const CARRITO_KEY = "carrito";

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
    return `http://localhost:3000/imagenes/panaderia/${encodeURIComponent(
      coincide[1],
    )}`;
  }

  return IMAGEN_PREDETERMINADA;
};

const leerCarrito = () => {
  try {
    const carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || "[]");
    return Array.isArray(carrito) ? carrito : [];
  } catch {
    return [];
  }
};

const FilaCarrito = ({ item, onCambiarCantidad, onEliminar }) => {
  const precioConDescuento = item.precio * (1 - (item.descuento || 0) / 100);
  const subtotal = precioConDescuento * (1 + (item.iva || 0) / 100) * item.cantidad;

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center gap-3">
          <img
            src={construirUrlImagen(item.ruta_imagen)}
            alt={item.nombre}
            className="img-carrito"
            onError={(evento) => {
              evento.currentTarget.src = IMAGEN_PREDETERMINADA;
            }}
          />
          <Link
            to={`/productos/${item.id}`}
            className="text-decoration-none fw-semibold enlace-producto-carrito"
          >
            {item.nombre}
          </Link>
        </div>
      </td>
      <td>{formatearPrecio(item.precio)}</td>
      <td>
        <div className="input-group input-group-sm" style={{ maxWidth: "130px" }}>
          <button
            type="button"
            className="btn btn-outline-secondary"
            aria-label="Reducir cantidad"
            onClick={() => onCambiarCantidad(item.id, item.cantidad - 1)}
          >
            −
          </button>
          <span className="form-control text-center">{item.cantidad}</span>
          <button
            type="button"
            className="btn btn-outline-secondary"
            aria-label="Aumentar cantidad"
            onClick={() => onCambiarCantidad(item.id, item.cantidad + 1)}
          >
            +
          </button>
        </div>
      </td>
      <td>{item.descuento ? `${item.descuento}%` : "—"}</td>
      <td>{item.iva}%</td>
      <td className="fw-semibold">{formatearPrecio(subtotal)}</td>
      <td>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          aria-label={`Eliminar ${item.nombre}`}
          onClick={() => onEliminar(item.id)}
        >
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
};

const CarritoCompras = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(leerCarrito());
  }, []);

  const guardarCarrito = (nuevoCarrito) => {
    setItems(nuevoCarrito);
    localStorage.setItem(CARRITO_KEY, JSON.stringify(nuevoCarrito));
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarItem(id);
      return;
    }

    guardarCarrito(
      items.map((item) =>
        String(item.id) === String(id) ? { ...item, cantidad: nuevaCantidad } : item,
      ),
    );
  };

  const eliminarItem = (id) => {
    guardarCarrito(items.filter((item) => String(item.id) !== String(id)));
  };

  const vaciarCarrito = () => {
    guardarCarrito([]);
  };

  const calcularSubtotalPorItem = (item) =>
    item.precio * (1 - (item.descuento || 0) / 100) * item.cantidad;

  const subtotal = items.reduce((total, item) => total + calcularSubtotalPorItem(item), 0);
  const totalIva = items.reduce(
    (total, item) => total + calcularSubtotalPorItem(item) * ((item.iva || 0) / 100),
    0,
  );
  const total = subtotal + totalIva;
  const totalArticulos = items.reduce((total, item) => total + item.cantidad, 0);

  return (
    <PanaderiaLayout>
      <section className="container py-5">
        <h1 className="mb-4">
          <i className="bi bi-cart3 me-2"></i>
          Carrito de compras
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-cart-x display-1 text-muted"></i>
            <p className="lead mt-3">Tu carrito está vacío.</p>
            <Link to="/productos" className="btn boton-ver-detalle">
              Ir al portafolio de productos
            </Link>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle tabla-carrito">
                <thead>
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Descuento</th>
                    <th scope="col">IVA</th>
                    <th scope="col">Subtotal</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <FilaCarrito
                      key={item.id}
                      item={item}
                      onCambiarCantidad={cambiarCantidad}
                      onEliminar={eliminarItem}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="row justify-content-end">
              <div className="col-md-5">
                <ul className="list-group mb-3 resumen-carrito">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Artículos:</span>
                    <strong>{totalArticulos}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Subtotal:</span>
                    <strong>{formatearPrecio(subtotal)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>IVA:</span>
                    <strong>{formatearPrecio(totalIva)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold fs-5 total-carrito">
                    <span>Total:</span>
                    <span>{formatearPrecio(total)}</span>
                  </li>
                </ul>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={vaciarCarrito}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Vaciar carrito
                  </button>
                  <Link to="/productos" className="btn btn-outline-secondary">
                    Seguir comprando
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </PanaderiaLayout>
  );
};

export default CarritoCompras;
