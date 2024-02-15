import ReactDOM from "react-dom/client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { App } from "./app";

const backend = window.innerWidth <= 768 ? TouchBackend : HTML5Backend;

ReactDOM.createRoot(document.getElementById("root")).render(
  <DndProvider backend={backend}>
    <App />
  </DndProvider>
);
