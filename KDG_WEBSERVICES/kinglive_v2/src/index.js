import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ModalProvider } from "@bscsswap/uikit";
import reportWebVitals from "./reportWebVitals";
import store from "./store";
import Providers from './Providers'

ReactDOM.render(
  <React.StrictMode>
      <Providers>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
