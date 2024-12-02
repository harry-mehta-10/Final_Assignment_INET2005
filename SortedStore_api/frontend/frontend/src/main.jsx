import React from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route } from "react-router-dom"; 
import App from "./App";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>
);
