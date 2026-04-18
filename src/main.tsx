import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

const root = createRoot(document.getElementById("root")!);
root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// Signal to the pre-renderer (build-time) that the app is ready
if (typeof document !== "undefined") {
  // Wait a tick so React has committed
  requestAnimationFrame(() => {
    document.dispatchEvent(new Event("render-event"));
  });
}
