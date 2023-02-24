import React, { useState } from "react";
import Basictable from "./Basictable";
import "./Bugs.css";

const COLUMNS = [
  { Header: "Name", accessor: "Name" },
  { Header: "Description", accessor: "Description" },
  { Header: "Created", accessor: "Created" },
  { Header: "Team Lead", accessor: "TeamLead" },
];
const COLUMNS2 = [{ Header: "DESCRIPTION", accessor: "title" }];

const Bugs = (projectState) => {
  const [projectData, setProjectData] = useState([]);
  const [bugData, setBugData] = useState([]);

  return (
    <div className="container">
      <h4 className="page-title">BUGS</h4>
      <div className="blue-bar" />
      {/* Project section*/}
      <div className="bugs-container">
        <div className="bugs-container-inner">
          <div className="bugs-title max-width">
            <h1>Project title: </h1>
            <div className="btn-wrapper">
              <button className="project-btn">Choose project</button>
              <button className="project-btn">?</button>
            </div>
          </div>
          <div
            className="table-container max-width"
            style={{ marginBottom: "4rem" }}
          >
            <Basictable COLUMNS={COLUMNS} DATA={projectData} />
          </div>
          {/* Bug description section */}
          <div className="gridbox">
            <div className="bugs-title">
              <h4>Bug title: </h4>
              <h4>Urgency: </h4>
              <h4>Status: </h4>
              <h4>Reporter: </h4>
            </div>

            <div className="btn-wrapper">
              <button
                className="project-btn btn-width"
                style={{
                  backgroundColor: "#FFA825",
                }}
              >
                Edit
              </button>
            </div>
            <div className="table-container">
              <Basictable COLUMNS={COLUMNS2} DATA={bugData} />
            </div>
            <div className="btn-wrapper column">
              <button
                className="project-btn btn-width"
                style={{ backgroundColor: "#FF2530" }}
              >
                Delete
              </button>
              <button className="project-btn btn-width">Create</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bugs;
