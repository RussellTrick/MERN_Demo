import React, { useEffect, useState } from "react";
import Basictable from "./Basictable";
import "./Bugs.css";
import useProjects from "../hooks/useProjects";
import { useNavigate } from "react-router-dom";

const PROJECTCOLUMNS = [
  { Header: "TITLE", accessor: "Title" },
  { Header: "DESCRIPTION", accessor: "Description" },
  { Header: "CREATED", accessor: "Created" },
  { Header: "TEAM LEAD", accessor: "TeamLead" },
];
const BUGCOLUMNS = [
  { Header: "NAME", accessor: "Name" },
  { Header: "DESCRIPTION", accessor: "Description" },
  { Header: "STATUS", accessor: "Status" },
  { Header: "URGENCY", accessor: "Urgency" },
];

const Bugs = () => {
  const { projectStateUpdate } = useProjects();
  const [projectData, setProjectData] = useState([]);
  const [bugData, setBugData] = useState([]);
  const navigate = useNavigate();

  const handleChooseProject = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container">
      <h4 className="page-title">BUGS</h4>
      <div className="blue-bar" />
      {/* Project section*/}
      <div className="bugs-container">
        <div className="bugs-container-inner">
          <div className="bugs-title max-width">
            <h2>Project title: {projectStateUpdate[0]?.Title}</h2>
            <div className="btn-wrapper">
              <button className="project-btn" onClick={handleChooseProject}>
                Choose project
              </button>
              <button className="project-btn">?</button>
            </div>
          </div>
          <div
            className="table-container max-width"
            style={{ marginBottom: "4rem" }}
          >
            <Basictable COLUMNS={PROJECTCOLUMNS} DATA={projectStateUpdate} />
          </div>
          {/* Bug description section */}
          <div className="bugs-title max-width">
            <h2>Bugs: </h2>
            <div className="btn-wrapper">
              <button className="project-btn btn-width">Create</button>
              <button className="project-btn">?</button>
            </div>
          </div>
          <div className="table-container max-width">
            <Basictable COLUMNS={BUGCOLUMNS} DATA={bugData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bugs;
