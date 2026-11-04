import { Link } from "react-router-dom";
import "../styles/Inicio.css";

const productosDestacados = [
  {
    nombre: "Almojábanas",
    descripcion:
      "Esponjosas y recién salidas del horno, con queso cuajada y un toque de bocadillo. El acompañante perfecto para el tinto de la mañana.",
    imagen:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Pandeyuca%2C_Pandebono_y_Almoj%C3%A1bana._Colombia.JPG/960px-Pandeyuca%2C_Pandebono_y_Almoj%C3%A1bana._Colombia.JPG",
  },
  {
    nombre: "Pandebonos",
    descripcion:
      "Crujientes por fuera y suaves por dentro. Hechos con yuca y queso costeño, al estilo de la panadería de barrio de toda la vida.",
    imagen:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80",
  },
  {
    nombre: "Buñuelos",
    descripcion:
      "Doraditos y recién fritos cada mañana. Con ese sabor alicitoso que acompaña el desayuno de las familias colombianas.",
    imagen:
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Bu%C3%B1uelos_Colombianos_%2824221303805%29.jpg/960px-Bu%C3%B1uelos_Colombianos_%2824221303805%29.jpg",
  },
  {
    nombre: "Empanadas",
    descripcion:
      "De masa dorada y rellenas de carne con papa y cebolla larga. Ideales para la merienda de la tarde con ají y limón.",
    imagen:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
  },
  {
    nombre: "Pan fresco del día",
    descripcion:
      "Pan de yuca, roscas, hojaldras y pan dulce horneado cada mañana. Del horno directo al mostrador, sin vueltas.",
    imagen:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  },
  {
    nombre: "Café colombiano",
    descripcion:
      "Tinto o con leche, hecho con café de nuestra tierra. Ese olor a cafecito recién pasado que abre la conversación en el mostrador.",
    imagen:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
  },
];

const ventajas = [
  {
    icono: "🌅",
    titulo: "Horneado cada día",
    texto:
      "Nuestro pan sale del horno todas las madrugadas. Nada se guarda para el otro día: aquí lo fresco no es promesa, es costumbre.",
  },
  {
    icono: "👨‍🍳",
    titulo: "Recetas tradicionales",
    texto:
      "Almojábanas, pandebonos y buñuelos con la receta de siempre. La que aprendimos de familia y conservamos con orgullo.",
  },
  {
    icono: "🤝",
    titulo: "Trato de barrio",
    texto:
      "Te recibimos con saludo y con tinto. En nuestra panadería el cliente no pasa de largo: aquí todos se conocen y todos son bien venidos.",
  },
];

const Inicio = () => (
  <main className="inicio">
    {/* ===== Portada ===== */}
    <section className="inicio-hero" aria-label="Bienvenida">
      <div className="inicio-hero__contenido">
        <p className="inicio-hero__etiqueta">
          Panadería Alvarado · Bosa, Bogotá
        </p>
        <h1 className="inicio-hero__titulo">
          El aroma del pan recién horneado te da la bienvenida
        </h1>
        <p className="inicio-hero__texto">
          Cada mañana encendemos el horno antes que el sol para que tu desayuno
          llegue calientico a la mesa. Ven, pasa y siéntete en casa: aquí el pan
          se comparte, el tinto está recién pasado y la conversación sobra.
        </p>
        <div className="inicio-hero__acciones">
          <Link to="/productos" className="inicio-boton inicio-boton--dorado">
            Ver nuestros productos
          </Link>
          <Link to="/registro" className="inicio-boton inicio-boton--borde">
            Crear tu cuenta
          </Link>
        </div>
      </div>
    </section>

    {/* ===== Presentación de la casa ===== */}
    <section className="inicio-seccion" aria-labelledby="titulo-casa">
      <div className="inicio-seccion__intro">
        <h2 id="titulo-casa">Una panadería de barrio, hecha con paciencia</h2>
        <p>
          Somos parte del barrio desde hace muchos años, y eso nos llena de
          orgullo. Aquí la masa se amasa a mano, el queso se ralla en casa y el
          café se sirve sin apuros, como se hace en las panaderías colombianas
          de toda la vida.
        </p>
      </div>
    </section>

    {/* ===== Productos destacados ===== */}
    <section className="inicio-seccion" aria-labelledby="titulo-productos">
      <h2 id="titulo-productos" className="inicio-seccion__titulo">
        Lo que no puede faltar en tu mesa
      </h2>
      <p className="inicio-seccion__bajada">
        Del horno a tu desayuno: estos son los favoritos de nuestros vecinos.
      </p>

      <div className="inicio-grid">
        {productosDestacados.map((producto) => (
          <article
            key={producto.nombre}
            className="inicio-tarjeta"
            aria-label={producto.nombre}
          >
            <img
              className="inicio-tarjeta__imagen"
              src={producto.imagen}
              alt={producto.nombre}
              loading="lazy"
            />
            <div className="inicio-tarjeta__cuerpo">
              <h3 className="inicio-tarjeta__titulo">{producto.nombre}</h3>
              <p className="inicio-tarjeta__texto">{producto.descripcion}</p>
              <Link to="/productos" className="inicio-tarjeta__enlace">
                Ver más →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>

    {/* ===== Por qué elegirnos ===== */}
    <section className="inicio-seccion" aria-labelledby="titulo-ventajas">
      <h2 id="titulo-ventajas" className="inicio-seccion__titulo">
        ¿Por qué nos prefieren los vecinos?
      </h2>
      <div className="inicio-ventajas">
        {ventajas.map((ventaja) => (
          <article key={ventaja.titulo} className="inicio-ventaja">
            <span className="inicio-ventaja__icono" aria-hidden="true">
              {ventaja.icono}
            </span>
            <h3 className="inicio-ventaja__titulo">{ventaja.titulo}</h3>
            <p className="inicio-ventaja__texto">{ventaja.texto}</p>
          </article>
        ))}
      </div>
    </section>

    {/* ===== Cierre con invitación ===== */}
    <section className="inicio-seccion" aria-labelledby="titulo-visita">
      <article className="inicio-invita">
        <h2 id="titulo-visita" className="inicio-invita__titulo">
          Te esperamos esta mañana
        </h2>
        <p className="inicio-invita__texto">
          Nada como arrancar el día con una almojábana calientica y un tinto
          recién pasado. Pasa por el mostrador, saluda a la gente del barrio y
          llévate el pan del día. También puedes pedir desde aquí y recogerlo
          listo.
        </p>
        <Link to="/productos" className="inicio-boton inicio-boton--dorado">
          Hacer mi pedido ahora
        </Link>
      </article>
    </section>

    {/* ===== Dato curioso ===== */}
    <aside className="inicio-dato" aria-label="Dato de la panadería">
      <p>
        <strong>¿Ya lo sabías?</strong> En Bosa el pan se disfruta a toda hora:
        en el desayuno con tinto, a media mañana con chocolate y en la tarde con
        las empanadas. Nosotros horneamos tres veces al día para que siempre
        encuentres algo calientico.
      </p>
    </aside>
  </main>
);

export default Inicio;
