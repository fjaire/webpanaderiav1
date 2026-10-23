import { useRef, useState } from "react";
import Menu from "../components/Menu";
import Footer from "../components/Footer";

const MIN_MENU_WIDTH = 160;
const INITIAL_MENU_WIDTH = 220;

const Layout = ({ children }) => {
  const [menuWidth, setMenuWidth] = useState(INITIAL_MENU_WIDTH);
  const layoutRef = useRef(null);

  const resizeMenu = (clientX) => {
    const bounds = layoutRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const maxWidth = Math.max(MIN_MENU_WIDTH, bounds.width - 180);
    const nextWidth = Math.min(
      Math.max(clientX - bounds.left, MIN_MENU_WIDTH),
      maxWidth
    );
    setMenuWidth(nextWidth);
  };

  const handleDividerKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const bounds = layoutRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const maxWidth = Math.max(MIN_MENU_WIDTH, bounds.width - 180);
    const change = event.key === "ArrowRight" ? 16 : -16;
    setMenuWidth((width) =>
      Math.min(Math.max(width + change, MIN_MENU_WIDTH), maxWidth)
    );
  };

  return (
    <div
      ref={layoutRef}
      style={{
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <aside
        style={{
          width: `${menuWidth}px`,
          flex: "0 0 auto",
          backgroundColor: "#000000",
          overflow: "auto",
        }}
      >
        <Menu />
      </aside>

      <div
        role="separator"
        aria-label="Cambiar el ancho del menú"
        aria-orientation="vertical"
        aria-valuemin={MIN_MENU_WIDTH}
        aria-valuemax={Math.max(
          MIN_MENU_WIDTH,
          (layoutRef.current?.getBoundingClientRect().width ?? 400) - 180
        )}
        aria-valuenow={Math.round(menuWidth)}
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
        style={{
          width: "8px",
          flex: "0 0 8px",
          cursor: "col-resize",
          touchAction: "none",
          display: "flex",
          justifyContent: "center",
          outlineOffset: "-2px",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: "3px",
            height: "100%",
            backgroundColor: "#6b6375",
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

