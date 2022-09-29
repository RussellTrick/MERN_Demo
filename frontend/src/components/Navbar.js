import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import dash from "../img/dashboard.svg";
import bug from "../img/bug.svg";

function Navbar() {
  return (
    <div className="nav">
      <ul>
        <Link to="/">
          <div className="img-container">
            <img src={dash} alt="dashboard img" />
          </div>
          Dashboard
        </Link>
        <CustomLink to="/bugs">
          <div className="img-container">
            <img src={bug} alt="bug img" />
          </div>
          Bugs
        </CustomLink>
      </ul>
    </div>
  );
}

function CustomLink({ to, children, ...props }) {
  const path = window.location.pathname;

  return (
    <li className={path === to ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Navbar;
