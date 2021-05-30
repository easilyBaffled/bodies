import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { startReportingRuntimeErrors } from "react-error-overlay";

startReportingRuntimeErrors({
  onError: (...args) => {
    console.log(...args);
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
