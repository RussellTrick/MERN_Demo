import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import dash from "../img/dashboard.svg";
import bug from "../img/bug.svg";

function Navbar() {
  return (
    <div className="nav">
      <ul>
        <NavLink className="nav_link" to="/" end>
          <div className="img-container">
            <img src={dash} alt="dashboard img" />
          </div>
          Dashboard
        </NavLink>
        <NavLink className="nav_link" to="/bugs" end>
          <div className="img-container">
            <img src={bug} alt="bug img" />
          </div>
          Bugs
        </NavLink>
      </ul>
    </div>
  );
}

export default Navbar;
