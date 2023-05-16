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
            if (props.defaultState && props.setState) {
              props.setState(props.defaultState);
            }
            props.setTrigger(false);
          }}
        >
          <FontAwesomeIcon className={ProjectCSS.FontAwesomeIcon} icon={faX} />
        </button>
        {props.children}
      </div>
    </div>
  ) : null;
}

export default Project;
