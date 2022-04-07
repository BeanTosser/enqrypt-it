import React, { StrictMode } from "react";
//import ReactDOM from "react-dom";
import ReactDOMClient from "react-dom/client";

import App from "./App";

const rootElement: HTMLElement | null = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement as Element);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
