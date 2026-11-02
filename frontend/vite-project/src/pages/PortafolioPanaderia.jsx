import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PanaderiaLayout from "../layouts/PanaderiaLayout";
import "../styles/PortafolioPanaderia.css";
import { FaEye } from "react-icons/fa";

const API_URL = "http://localhost:3000/productos";
const TAMANIOS_PAGINA = [8, 12, 16, 24];
const TAMANIO_INICIAL = 8;
const VENTANA_PAGINAS = 3;

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

// La base guarda rutas absolutas de Windows (C:\frank\Imagenes\panaderia\Pan.png).
// Para poder servirlas por HTTP las convertimos a la URL estática del backend.
const construirUrlImagen = (ruta) => {
  if (!ruta) return IMAGEN_PREDETERMINADA;

  const coincide = ruta.match(/Imagenes[\\/]panaderia[\\/](.+)$/i);
  if (coincide) {
    return `http://localhost:3000/imagenes/panaderia/${encodeURIComponent(coincide[1])}`;
  }

  return IMAGEN_PREDETERMINADA;
};

const TarjetaProducto = ({ producto }) => {
  const precioConDescuento =
    producto.precio * (1 - (producto.descuento || 0) / 100);
  const valorIva = precioConDescuento * ((producto.iva || 0) / 100);

  return (
    <div className="col-sm-6 col-md-4 col-lg-3">
      <div className="card tarjeta-producto h-100 shadow-sm">
        <img
          src={construirUrlImagen(producto.ruta_imagen)}
          className="card-img-top img-producto"
          alt={producto.nombre}
          onError={(evento) => {
            evento.currentTarget.src = IMAGEN_PREDETERMINADA;
          }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{producto.nombre}</h5>
          {producto.descripcion && (
            <p className="card-text text-muted small flex-grow-1">
              {producto.descripcion}
            </p>
          )}
          <ul className="list-unstyled mb-3 small">
            <li>
              <strong>Precio:</strong> {formatearPrecio(producto.precio)}
            </li>
            <li>
              <strong>Descuento:</strong>{" "}
              <span className="badge bg-success">
                {producto.descuento
                  ? `${producto.descuento}%`
                  : "Sin descuento"}
              </span>
            </li>
            <li>
              <strong>IVA:</strong> {producto.iva}% ({formatearPrecio(valorIva)}
              )
            </li>
            {producto.descuento > 0 && (
              <li>
                <strong>Precio final:</strong>{" "}
                <span className="text-success fw-bold">
                  {formatearPrecio(precioConDescuento + valorIva)}
                </span>
              </li>
            )}
          </ul>
          <Link
            to={`/productos/${producto.id}`}
            className="btn mt-auto boton-ver-detalle"
          >
            <FaEye className="me-2" aria-hidden="true" />
            Ver detalle
          </Link>{" "}
        </div>
      </div>
    </div>
  );
};

const PortafolioPanaderia = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [tamanioPagina, setTamanioPagina] = useState(TAMANIO_INICIAL);

  const totalPaginas = Math.max(1, Math.ceil(productos.length / tamanioPagina));
  const paginaSegura = Math.min(paginaActual, totalPaginas);
  const inicio = (paginaSegura - 1) * tamanioPagina;
  const productosPagina = productos.slice(inicio, inicio + tamanioPagina);
  const primeroMostrado = productos.length === 0 ? 0 : inicio + 1;
  const ultimoMostrado = inicio + productosPagina.length;

  const cambiarPagina = (pagina) => {
    if (pagina < 1 || pagina > totalPaginas || pagina === paginaSegura) return;
    setPaginaActual(pagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cambiarTamanioPagina = (nuevoTamanio) => {
    setTamanioPagina(nuevoTamanio);
    setPaginaActual(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Ventana deslizante de números con puntos suspensivos.
  const numerosPagina = () => {
    if (totalPaginas <= VENTANA_PAGINAS + 2) {
      return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    }

    const inicioVentana = Math.max(
      2,
      Math.min(paginaSegura - 1, totalPaginas - VENTANA_PAGINAS),
    );
    const numeros = [1, "...", inicioVentana];
    for (let i = 1; i < VENTANA_PAGINAS; i += 1)
      numeros.push(inicioVentana + i);
    if (inicioVentana + VENTANA_PAGINAS - 1 < totalPaginas - 1) {
      numeros.push("...");
    }
    numeros.push(totalPaginas);
    return numeros;
  };

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar los productos.");
        }
        const datos = await respuesta.json();
        setProductos(datos);
        setPaginaActual(1);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  return (
    <PanaderiaLayout>
      <section className="container py-5">
        <h1 className="text-center mb-4">Nuestro portafolio de productos</h1>

        {cargando && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error} Verifica que el servidor del backend esté corriendo en el
            puerto 3000.
          </div>
        )}

        {!cargando && !error && (
          <>
            <div className="row g-4">
              {productosPagina.map((producto) => (
                <TarjetaProducto key={producto.id} producto={producto} />
              ))}
            </div>

            <div className="paginador-barra d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 mt-5">
              <p className="text-muted small mb-0">
                Mostrando <strong>{primeroMostrado}</strong>–
                <strong>{ultimoMostrado}</strong> de{" "}
                <strong>{productos.length}</strong> productos
              </p>

              <div className="d-flex align-items-center gap-2">
                <label htmlFor="selector-tamanio" className="small text-muted">
                  Productos por página:
                </label>
                <select
                  id="selector-tamanio"
                  className="form-select form-select-sm selector-tamanio"
                  value={tamanioPagina}
                  onChange={(evento) =>
                    cambiarTamanioPagina(Number(evento.target.value))
                  }
                >
                  {TAMANIOS_PAGINA.map((tamanio) => (
                    <option key={tamanio} value={tamanio}>
                      {tamanio}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {totalPaginas > 1 && (
              <nav aria-label="Paginación de productos" className="mt-4">
                <ul className="pagination justify-content-center paginador-productos">
                  <li
                    className={`page-item ${paginaSegura === 1 ? "disabled" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      aria-label="Página anterior"
                      onClick={() => cambiarPagina(paginaSegura - 1)}
                    >
                      &laquo;
                    </button>
                  </li>

                  {numerosPagina().map((numero, indice) =>
                    numero === "..." ? (
                      <li
                        key={`puntos-${indice}`}
                        className="page-item disabled"
                      >
                        <span className="page-link">&hellip;</span>
                      </li>
                    ) : (
                      <li
                        key={numero}
                        className={`page-item ${numero === paginaSegura ? "active" : ""}`}
                      >
                        <button
                          type="button"
                          className="page-link"
                          onClick={() => cambiarPagina(numero)}
                        >
                          {numero}
                        </button>
                      </li>
                    ),
                  )}

                  <li
                    className={`page-item ${paginaSegura === totalPaginas ? "disabled" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      aria-label="Página siguiente"
                      onClick={() => cambiarPagina(paginaSegura + 1)}
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </section>
    </PanaderiaLayout>
  );
};

export default PortafolioPanaderia;
