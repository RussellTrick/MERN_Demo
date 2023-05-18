import React, { useEffect, useState } from "react";
import Basictable from "./Basictable";
import "./Bugs.css";
import useProjects from "../hooks/useProjects";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { getTicketsByProjectId } from "../services/TicketService";
import Modal from "./Modal";

const PROJECTCOLUMNS = [
  { Header: "TITLE", accessor: "Title" },
  { Header: "DESCRIPTION", accessor: "Description" },
  { Header: "CREATED", accessor: "CreatedFormatted" },
  { Header: "TEAM LEAD", accessor: "TeamLeadName" },
];
const BUGCOLUMNS = [
  { Header: "NAME", accessor: "Name" },
  { Header: "DESCRIPTION", accessor: "Description" },
  { Header: "STATUS", accessor: "Status" },
  { Header: "URGENCY", accessor: "Urgency" },
];

const Bugs = () => {
  const { projectStateUpdate } = useProjects();
  const [bugData, setBugData] = useState([]);
  const navigate = useNavigate();
  const [helpPopup, setHelpPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bugs = await getTicketsByProjectId(projectStateUpdate._id);
        setBugData(bugs.ticket);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleChooseProject = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <div className="container">
        <h4 className="page-title">BUGS</h4>
        <div className="blue-bar" />
        {/* Project description section */}
        <div className="bugs-container">
          <div className="bugs-container-inner">
            <div className="bugs-title max-width">
              <h2>Project title: {projectStateUpdate?.Title}</h2>
              <div className="btn-wrapper">
                <button className="project-btn" onClick={handleChooseProject}>
                  Choose project
                </button>
              </div>
            </div>
            <div className="max-width" style={{ marginBottom: "4rem" }}>
              <Basictable
                COLUMNS={PROJECTCOLUMNS}
                DATA={
                  Object.keys(projectStateUpdate).length === 0
                    ? [{ Title: "Project not loaded" }]
                    : [projectStateUpdate]
                }
              />
            </div>
            {/* Bug section */}
            <div className="bugs-title max-width">
              <h2>Bugs: </h2>
              <div className="btn-wrapper">
                <button className="project-btn btn-width">NEW BUG</button>
                <button
                  className="project-btn"
                  onClick={() => {
                    setHelpPopup(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faQuestion}
                    style={{ height: "13px" }}
                  />
                </button>
              </div>
            </div>
            <div className="table-container max-width">
              <Basictable
                COLUMNS={BUGCOLUMNS}
                DATA={
                  Object.keys(bugData).length === 0
                    ? [{ Name: "Project not loaded" }]
                    : [bugData]
                }
              />
            </div>
          </div>
        </div>
      </div>
      {/* Bug help Modal */}
      <Modal trigger={helpPopup} setTrigger={setHelpPopup}>
        <div className="grid2">
          <h2 className="marginless" style={{ marginBottom: "7px" }}>
            HELP
          </h2>
          <div
            className="grid2"
            style={{
              border: "solid #9A9B9C 1px",
              padding: "10px",
            }}
          >
            <p>
              - Click NEW BUG button to create a new Bug for the selected
              project.
            </p>
            <p>- Left click on a Bug in the table to view or edit it.</p>
            <p>- Right click on a Bug in the table to delete it.</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Bugs;
