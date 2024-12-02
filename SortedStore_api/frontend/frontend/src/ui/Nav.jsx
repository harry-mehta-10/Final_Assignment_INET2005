import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#f0f0f0" }}>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/logout">Logout</Link>
    </nav>
  );
};

export default Nav;
