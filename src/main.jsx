// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "../style.css"; // adjust path if needed

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);