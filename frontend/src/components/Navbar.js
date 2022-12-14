import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faBug } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

function Navbar() {
  return (
    <div className="nav">
      <ul>
        <NavLink className="nav_link" to="/" end>
          <div className="img-container">
            <FontAwesomeIcon className="FontAwesomeIcon" icon={faChartSimple} />
            Dashboard
          </div>
        </NavLink>
        <NavLink className="nav_link" to="/bugs" end>
          <div className="img-container">
            <FontAwesomeIcon className="FontAwesomeIcon" icon={faBug} />
            Bugs
          </div>
        </NavLink>
      </ul>
      <a
        className="end"
        href="https://github.com/RussellTrick"
        target="_blank"
        rel="noreferrer"
      >
        <div className="img-container">
          <FontAwesomeIcon className="FontAwesomeIcon" icon={faGithub} />
        </div>
      </a>
    </div>
  );
}

export default Navbar;
