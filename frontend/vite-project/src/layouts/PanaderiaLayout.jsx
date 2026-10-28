import { useRef, useState } from "react";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import "../styles/PanaderiaLayout.css";

const MIN_MENU_WIDTH = 160;
const INITIAL_MENU_WIDTH = 220;
const MIN_CONTENT_WIDTH = 180;
const DIVIDER_WIDTH = 8;

const PanaderiaLayout = ({ children }) => {
  const [menuWidth, setMenuWidth] = useState(INITIAL_MENU_WIDTH);
  const layoutRef = useRef(null);

  const getMaxMenuWidth = () => {
    const bounds = layoutRef.current?.getBoundingClientRect();

    if (!bounds) return INITIAL_MENU_WIDTH;

    return Math.max(
      MIN_MENU_WIDTH,
      bounds.width - MIN_CONTENT_WIDTH - DIVIDER_WIDTH,
    );
  };

  const resizeMenu = (clientX) => {
    const bounds = layoutRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const maxWidth = getMaxMenuWidth();
    const nextWidth = Math.min(
      Math.max(clientX - bounds.left, MIN_MENU_WIDTH),
      maxWidth,
    );

    setMenuWidth(nextWidth);
  };

  const handleDividerKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();

    const maxWidth = getMaxMenuWidth();
    const change = event.key === "ArrowRight" ? 16 : -16;

    setMenuWidth((width) =>
      Math.min(Math.max(width + change, MIN_MENU_WIDTH), maxWidth),
    );
  };

  return (
    <div ref={layoutRef} className="panaderia-layout">
      <aside
        className="panaderia-layout__sidebar"
        style={{ width: `${menuWidth}px`, flexBasis: `${menuWidth}px` }}
      >
        <Menu />
      </aside>

      <div
        className="panaderia-layout__divider"
        role="separator"
        aria-label="Cambiar el ancho del menú"
        aria-orientation="vertical"
        aria-valuemin={MIN_MENU_WIDTH}
        aria-valuemax={Math.round(getMaxMenuWidth())}
        aria-valuenow={Math.round(menuWidth)}
        aria-valuetext={`${Math.round(menuWidth)} píxeles`}
        tabIndex={0}
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          resizeMenu(event.clientX);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) resizeMenu(event.clientX);
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        }}
        onKeyDown={handleDividerKeyDown}
      >
        <span className="panaderia-layout__divider-handle" aria-hidden="true" />
      </div>

      <div className="panaderia-layout__main">
        <main className="panaderia-layout__content">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default PanaderiaLayout;
