import React, { useEffect, useRef, useState } from "react";
import Basictable from "./Basictable";
import "./Bugs.css";
import useProjects from "../hooks/useProjects";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import {
  getTicketById,
  deleteTicket,
  createTicket,
  updateTicket,
} from "../services/TicketService";
import Modal from "./Modal";
import { getProjectById } from "../services/ProjectService";
import { NewtonsCradle } from "@uiball/loaders";

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
  const { projectStateUpdate, setProjectStateUpdate } = useProjects();
  const [bugData, setBugData] = useState([]);
  const navigate = useNavigate();
  const [helpPopup, setHelpPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [errMsg, setErrMsg] = useState();
  const [deleteConfirmationState, setDeleteConfirmationState] = useState("");
  const [newBugPopup, setNewBugPopup] = useState(false);
  const [editBugPopup, setEditBugPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const bugName = useRef();
  const bugDescription = useRef();
  const bugEditName = useRef();
  const bugEditDescription = useRef();

  const [editBug, setEditBug] = useState();
  const [newBug, setNewBug] = useState({
    Status: "Incomplete",
    Urgency: "Normal",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(
    !projectStateUpdate._id
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketIds = projectStateUpdate.Tickets;

        // Map over each ticket ID and create an array of promises
        const ticketPromises = ticketIds.map(async (ticketId) => {
          try {
            // Make API call for each ticket ID
            const ticket = await getTicketById(ticketId);
            return ticket;
          } catch (error) {
            console.error(error);
            throw error;
          }
        });

        // Wait for all the promises to resolve
        const ticketData = await Promise.all(ticketPromises);
        setBugData(ticketData);
      } catch (error) {
        console.error(error);
      }
    };

    const populateUI = async () => {
      await fetchData();
      setLoading(false);
    };

    populateUI();
  }, [projectStateUpdate]);

  const handleChooseProject = () => {
    navigate("/dashboard");
  };

  const deleteConfirmation = (row) => {
    if (row != null) {
      setDeleteConfirmationState(row);
    }
    setDeletePopup(true);
  };

  const deleteRow = (row) => {
    setBugData(bugData.filter((current) => current._id !== row.original._id));
    deleteTicket({ setErrMsg }, projectStateUpdate._id, row.original._id);
    setProjectStateUpdate((prevState) => ({
      ...prevState,
      Tickets: prevState.Tickets.filter(
        (ticketId) => ticketId !== row.original._id
      ),
    }));

    setDeletePopup(false);
  };

  const handleNewBugClick = async (e) => {
    e.preventDefault();
    const formData = { ...newBug };

    formData["Project"] = projectStateUpdate._id;
    formData["Name"] = bugName.current.value;
    formData["Description"] = bugDescription.current.value;
    await createTicket({ setErrMsg }, formData);
    setNewBug({
      Status: "Incomplete",
      Urgency: "Normal",
    });

    await updateProjectState();
    setNewBugPopup(false);
  };

  const updateProjectState = async () => {
    if (projectStateUpdate._id) {
      const updatedState = await getProjectById(
        { setErrMsg },
        projectStateUpdate?._id
      );
      setProjectStateUpdate(updatedState.data.project);
    } else {
      console.log("Id missing");
      console.log(projectStateUpdate);
    }
  };

  const handleEditBugClick = async (e) => {
    e.preventDefault();
    const formData = { ...editBug };

    formData["Name"] = bugEditName?.current.value;
    formData["Description"] = bugEditDescription?.current.value;
    formData["Status"] = editBug?.Status;
    formData["Urgency"] = editBug?.Urgency;

    await updateTicket({ setErrMsg }, formData);
    await updateProjectState();
    setEditBugPopup(false);
  };

  const selectEditBugFromRowId = async (row) => {
    const arr = bugData.filter((item) => item._id === row.original._id);

    setEditBug(arr[0]);
    setEditBugPopup(true);
  };

  const handleBugOnChange = (e, setState, State) => {
    const fieldName = e.target.getAttribute("name");
    const fieldValue = e.target.value;
    const newFormData = { ...State };

    newFormData[fieldName] = fieldValue;
    setState(newFormData);
  };

  return (
    <>
      {loading ? (
        <div className="flex-center">
          <div className="blue-bar"></div>
          <NewtonsCradle size={80} speed={0.5} color="#03E9F4" />
        </div>
      ) : (
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
                    <button
                      className="project-btn"
                      onClick={handleChooseProject}
                    >
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
                    {isButtonDisabled ? (
                      <button className="project-btn red" disabled>
                        No Project Selected
                      </button>
                    ) : (
                      <button
                        className="project-btn btn-width"
                        onClick={() => {
                          setNewBugPopup(true);
                        }}
                      >
                        NEW BUG
                      </button>
                    )}

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
                        ? [{ Name: "No Data" }]
                        : bugData
                    }
                    onClick={selectEditBugFromRowId}
                    onContextMenu={deleteConfirmation}
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
          {/* Bug Delete Modal */}
          <Modal trigger={deletePopup} setTrigger={setDeletePopup}>
            <div className="select-container">
              <div className="grid1">
                <h3>
                  Are you sure you want to delete:{" "}
                  {deleteConfirmationState?.original?.Name
                    ? deleteConfirmationState?.original?.Name
                    : ""}
                  {"?"}
                </h3>
              </div>
              <div className="grid2">
                <button
                  className="project-btn red"
                  onClick={() => {
                    deleteRow(deleteConfirmationState);
                  }}
                >
                  Delete
                </button>
              </div>
              <div className="aiend grid2">
                <button
                  className="project-btn"
                  onClick={() => setDeletePopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
          {/* New Bug Modal */}
          <Modal trigger={newBugPopup} setTrigger={setNewBugPopup}>
            <h2>New Bug</h2>
            <form onSubmit={handleNewBugClick}>
              <div className="select-container">
                <div className="grid1">
                  <label htmlFor="Name">Name</label>
                  <input
                    ref={bugName}
                    required="required"
                    autoFocus
                    name="Name"
                  ></input>
                </div>

                <div className="grid1">
                  <label htmlFor="Description">Description</label>
                  <textarea
                    ref={bugDescription}
                    required="required"
                    name="Description"
                    rows="6"
                  ></textarea>
                </div>

                <div className="grid2">
                  <label htmlFor="Status">Status</label>
                  <select
                    onChange={(e) => handleBugOnChange(e, setNewBug, newBug)}
                    name="Status"
                  >
                    <option value="Incomplete">Incomplete</option>
                    <option value="Complete">Complete</option>
                  </select>
                </div>

                <div className="grid2">
                  <label htmlFor="Urgency">Priority</label>
                  <select
                    onChange={(e) => handleBugOnChange(e, setNewBug, newBug)}
                    name="Urgency"
                    defaultValue="Normal"
                  >
                    <option value="Critical">Critical</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <button className="project-btn">Submit</button>
              </div>
            </form>
          </Modal>
          {/* Edit Bug Modal */}
          <Modal trigger={editBugPopup} setTrigger={setEditBugPopup}>
            <h2>Currently Editing: {editBug?.Name || ""}</h2>
            <form onSubmit={handleEditBugClick}>
              <div className="select-container">
                <div className="grid1">
                  <label htmlFor="Name">Name</label>
                  <input
                    required="required"
                    autoFocus
                    name="Name"
                    ref={bugEditName}
                    defaultValue={editBug?.Name}
                  ></input>
                </div>

                <div className="grid1">
                  <label htmlFor="Description">Description</label>
                  <textarea
                    ref={bugEditDescription}
                    required="required"
                    name="Description"
                    rows="6"
                    defaultValue={editBug?.Description}
                  ></textarea>
                </div>

                <div className="grid2">
                  <label htmlFor="Status">Status</label>
                  <select
                    onChange={(e) => handleBugOnChange(e, setEditBug, editBug)}
                    name="Status"
                    defaultValue={editBug?.Status || "Incomplete"}
                  >
                    <option value="Incomplete">Incomplete</option>
                    <option value="Complete">Complete</option>
                  </select>
                </div>

                <div className="grid2">
                  <label htmlFor="Urgency">Priority</label>
                  <select
                    onChange={(e) => handleBugOnChange(e, setEditBug, editBug)}
                    name="Urgency"
                    defaultValue={editBug?.Urgency || "Normal"}
                  >
                    <option value="Critical">Critical</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <button className="project-btn">Submit</button>
              </div>
            </form>
          </Modal>
        </>
      )}
    </>
  );
};

export default Bugs;
