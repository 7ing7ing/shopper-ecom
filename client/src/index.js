import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../src/styles/index.css";
import { firebase } from "./lib/firebase";
import { FirebaseContext } from "./context/firebase";
import { initialState } from "./reducer/reducer";
import { StateProvider } from "./reducer/StateProvider";
import reducer from "./reducer/reducer";

ReactDOM.render(
  <FirebaseContext.Provider value={{ firebase }}>
    <StateProvider reducer={reducer} initialState={initialState}>
      <App />
    </StateProvider>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);
