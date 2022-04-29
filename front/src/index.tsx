import { createRoot } from "react-dom/client";
import App from "./app";
import React from "react";
import { Chart, LinearScale, LineElement, PointElement } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { BrowserRouter } from "react-router-dom";

window.addEventListener("load", () => {
    Chart.register(LinearScale, PointElement, LineElement, zoomPlugin);

    const domRoot = document.getElementById("reactRoot");
    const root = createRoot(domRoot);
    root.render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
});
