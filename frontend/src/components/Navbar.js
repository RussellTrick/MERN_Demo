import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import "boxicons";

function Navbar() {
  return (
    <div className="nav">
      <ul>
        <NavLink className="nav_link" to="/" end>
          <div className="img-container">
            <box-icon name="dashboard" type="solid" color="white"></box-icon>
          </div>
          Dashboard
        </NavLink>
        <NavLink className="nav_link" to="/bugs" end>
          <div className="img-container">
            <box-icon name="bug" color="white"></box-icon>
          </div>
          Bugs
        </NavLink>
      </ul>
      <a
        className="end"
        href="https://github.com/RussellTrick"
        target="_blank"
        rel="noreferrer"
      >
        <div className="img-container">
          <box-icon type="logo" color="#ffffff" name="github"></box-icon>
        </div>
      </a>
    </div>
  );
}

export default Navbar;
