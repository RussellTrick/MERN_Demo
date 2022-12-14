import React from "react";
import Basictable from "./Basictable";
import { COLUMNS } from "./Bugcolumns";
import DATA from "./MOCK_DATA.json";
import "./Bugs.css";

const COLUMNS2 = [{ Header: "DESCRIPTION", accessor: "title" }];

const Bugs = () => {
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
            <Basictable COLUMNS={COLUMNS} DATA={DATA} />
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
              <Basictable COLUMNS={COLUMNS2} DATA={DATA} />
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
