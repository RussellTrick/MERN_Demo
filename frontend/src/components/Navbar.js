import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple, faBug } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { SignOut } from "../services/UserService";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    SignOut(
      {
        setErrMsg: (msg) => console.log(msg),
      },
      () => {
        checkAuth();
        navigate("/login");
      }
    );
  };

  return (
    <nav className="nav">
      <ul>
        <NavLink className="nav_link" to="/dashboard" end>
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

      <button className="end" onClick={handleSignOut}>
        <div className="img-container">
          <FontAwesomeIcon className="FontAwesomeIcon" icon={faGithub} />
        </div>
      </button>

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
    </nav>
  );
}

export default Navbar;
