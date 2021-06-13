import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { startReportingRuntimeErrors } from "react-error-overlay";
import { Provider } from 'react-redux'
import store from './app/store'
import { current } from 'immer'

window.current = current
console.tap = (v, ...rest) => {
	console.log(v, ...rest)
	return v;
}

startReportingRuntimeErrors({
  onError: (...args) => {
    console.log(...args);
  },
});

ReactDOM.render(
  <React.StrictMode>
	  <Provider store={store}>
		  <App />
	  </Provider>,
  </React.StrictMode>,
  document.getElementById("root")
);
