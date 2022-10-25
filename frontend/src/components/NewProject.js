import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import "./NewProject.css";
import NewProjectCSS from "./NewProject.module.css";

function NewProject(props) {
  return props.trigger ? (
    <div className="new-project-container">
      <div className="new-project-inner">
        <button className="close-btn" onClick={() => props.setTrigger(false)}>
          <FontAwesomeIcon
            className={NewProjectCSS.FontAwesomeIcon}
            icon={faX}
          />
        </button>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
}

export default NewProject;
