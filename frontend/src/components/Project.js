import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import "./Project.css";
import ProjectCSS from "./Project.module.css";

function Project(props) {
  return props.trigger ? (
    <div className="new-project-container">
      <div className="new-project-inner">
        <button
          className="close-btn"
          onClick={() => {
            console.log(props.defaultFormData);
            props.setTrigger(false);
            props.setState(props.defaultFormData);
          }}
        >
          <FontAwesomeIcon className={ProjectCSS.FontAwesomeIcon} icon={faX} />
        </button>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
}

export default Project;
