import React, { useEffect, useRef } from "react";
import "./Dashboard.css";
import { PieChart } from "react-minimal-pie-chart";
import Basictable from "./Basictable";
import Project from "./Project";
import { useState } from "react";
import Selectiontable from "./Selectiontable";
import Modal from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import useProjects from "../hooks/useProjects";
import {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
  countProjectUrgency,
} from "../services/ProjectService";
import { useNavigate } from "react-router-dom";
import { getUsers, getUserById } from "../services/UserService";
import {
  countTicketUrgency,
  countTicketStatus,
} from "../services/TicketService";
import { NewtonsCradle } from "@uiball/loaders";

const PROJECTCOLUMNS = [
  { Header: "TITLE", accessor: "Title" },
  { Header: "DESCRIPTION", accessor: "Description" },
  { Header: "TEAM LEAD", accessor: "TeamLeadName" },
];

const SELECTIONCOLUMNS = [{ Header: "FULLNAME", accessor: "FullName" }];

const Dashboard = () => {
  const {
    projects,
    fetchProjectIDs,
    projectState,
    projectStateUpdate,
    setProjectState,
    setProjectStateUpdate,
    defaultProjectState,
  } = useProjects();

  const [errMsg, setErrMsg] = useState();
  const [projectPopup, setProjectPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [helpPopup, setHelpPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const inputTitle = useRef(null);
  const inputDescription = useRef(null);
  const editTitle = useRef(null);
  const editDescription = useRef(null);
  const [projectTableData, setProjectTableData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [projectUrgency, setProjectUrgency] = useState({});
  const [ticketUrgency, setTicketUrgency] = useState({});
  const [ticketStatus, setTicketStatus] = useState({});

  //Disable right click, context menu and load intial projects
  useEffect(() => {
    window.addEventListener("contextmenu", (e) => e.preventDefault());

    const fetchData = async () => {
      try {
        await fetchProjectIDs(); // Fetch projects
      } catch (error) {
        // Handle any errors that occur during fetchProjectIDs()
        console.error(error);
      }
    };
    fetchData();

    const getUsersData = async () => {
      try {
        const response = await getUsers(); // Call getUsers() and await response

        // Merge first and last name for each user
        const mergedUsers = response.data.map((user) => {
          return {
            ...user,
            FullName: `${user.FirstName} ${user.LastName}`,
          };
        });

        setAllUsers(mergedUsers); // Set all users with merged data
      } catch (error) {
        console.error(error);
      }
    };
    getUsersData(); // Call getUsersData()

    return () => {
      window.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, []);

  //Ensure project is loaded before setting projectTableData
  useEffect(() => {
    const fetchData = async () => {
      const projectsData = await getProjects({ setErrMsg }, projects);

      // Map over the array of projects and update each one to include the team lead's name
      const projectsWithTeamLeadNames = await Promise.all(
        projectsData.map(async (project) => {
          // Call getUserById to get the team lead's name
          const response = project?.TeamLead
            ? await getUserById(project?.TeamLead)
            : { FirstName: "" };
          // Return the updated project object with the team lead's name added
          return {
            ...project,
            TeamLeadName: `${response?.user?.FirstName} ${response?.user?.LastName}`,
          };
        })
      );

      setProjectTableData(projectsWithTeamLeadNames);
    };

    const updatePies = async () => {
      const ticketstatus = await countTicketStatus({ setErrMsg });
      setTicketStatus(ticketstatus);
      const ticketurgency = await countTicketUrgency({ setErrMsg });
      setTicketUrgency(ticketurgency);
      const projecturgency = await countProjectUrgency({ setErrMsg });
      setProjectUrgency(projecturgency);
    };

    const populateUI = async () => {
      await fetchData();
      await updatePies();
      setLoading(false);
    };

    populateUI();
  }, [projects]);

  const [deleteConfirmationState, setDeleteConfirmationState] =
    useState(defaultProjectState);

  const handleNewProjectChange = (e) => {
    const fieldName = e.target.getAttribute("name");
    const fieldValue = e.target.value;

    const newFormData = { ...projectState };

    newFormData[fieldName] = fieldValue;

    setProjectState(newFormData);
  };

  const handleEditProjectChange = (e) => {
    const fieldName = e.target.getAttribute("name");
    const fieldValue = e.target.value;

    const newFormData = { ...projectStateUpdate };

    newFormData[fieldName] = fieldValue;

    setProjectStateUpdate(newFormData);
  };

  const handleNewProjectSubmit = async (e) => {
    e.preventDefault();
    const newFormData = { ...projectState };

    newFormData["Description"] = inputDescription.current.value;
    newFormData["Title"] = inputTitle.current.value;

    try {
      await createProject({ setErrMsg }, newFormData, defaultProjectState);
      await fetchProjectIDs();
      setProjectPopup(false);
      setProjectState(defaultProjectState);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditProjectSubmit = async (e) => {
    e.preventDefault();
    const newFormData = { ...projectStateUpdate };

    newFormData["Description"] = editDescription.current.value;
    newFormData["Title"] = editTitle.current.value;
    try {
      updateProject({ setErrMsg }, newFormData);
      await fetchProjectIDs();
      setEditPopup(false);
      setProjectStateUpdate(defaultProjectState);
    } catch (error) {
      console.log(error);
    }
  };

  const newProjectAddMember = (childdata) => {
    const newFormData = { ...projectState };

    if (
      newFormData.Members.some(
        (item) => item.Email === childdata?.original.Email
      )
    ) {
      return;
    } else {
      newFormData.Members = [
        ...projectState.Members,
        {
          _id: childdata?.original._id,
          FirstName: childdata?.original.FirstName,
          LastName: childdata?.original.LastName,
          Email: childdata?.original.Email,
          FullName:
            childdata?.original.FirstName + " " + childdata?.original.LastName,
        },
      ];
    }

    setProjectState(newFormData);
  };

  const newProjectRemoveMember = (childdata) => {
    const newFormData = { ...projectState };
    const memberIdToRemove = childdata?.original._id;

    if (!memberIdToRemove) {
      return;
    }

    newFormData.Members = projectState.Members.filter(
      (member) => member._id !== memberIdToRemove
    );

    setProjectState(newFormData);
  };

  const editProjectRemoveMember = (childdata) => {
    const newProjectStateUpdate = { ...projectStateUpdate };
    const memberIdToRemove = childdata?.original._id;

    if (!memberIdToRemove) {
      return;
    }

    newProjectStateUpdate.Members = projectStateUpdate.Members.filter(
      (member) => member._id !== memberIdToRemove
    );

    setProjectStateUpdate(newProjectStateUpdate);
  };

  const newProjectTeamLeadSelect = (childdata) => {
    const newFormData = { ...projectState };
    if (
      newFormData.TeamLead &&
      newFormData.TeamLead.includes(childdata?.original._id)
    ) {
      return;
    } else {
      newFormData.TeamLead = childdata?.original?._id;
      newFormData.TeamLeadName = childdata?.original?.FullName;
    }

    var z = document.getElementById("members");
    z.style.color = "#009B83";

    setProjectState(newFormData);
  };

  const editProjectTeamLeadSelect = (childdata) => {
    const newFormData = { ...projectStateUpdate };

    if (newFormData.TeamLead.includes(childdata?.original._id)) {
      return;
    } else {
      newFormData.TeamLead = childdata?.original?._id;
      newFormData.TeamLeadName = childdata?.original?.FullName;
    }

    var z = document.getElementById("editProjectTeamLead");
    z.style.color = "#009B83";

    setProjectStateUpdate(newFormData);
  };

  const editProjectMemberAdd = (childdata) => {
    const newFormData = { ...projectStateUpdate };
    if (
      newFormData.Members.some(
        (item) => item.Email === childdata?.original.Email
      )
    ) {
      return;
    } else {
      newFormData.Members = [
        ...projectStateUpdate?.Members,
        {
          _id: childdata?.original._id,
          FirstName: childdata?.original.FirstName,
          LastName: childdata?.original.LastName,
          Email: childdata?.original.Email,
          FullName:
            childdata?.original.FirstName + " " + childdata?.original.LastName,
        },
      ];
    }

    setProjectStateUpdate(newFormData);
    console.log(projectStateUpdate);
  };

  const deleteConfirmation = (row) => {
    if (row != null) {
      setDeleteConfirmationState(row);
    }
    setDeletePopup(true);
  };

  const deleteRow = async (row) => {
    setProjectTableData(
      projectTableData.filter((current) => current._id !== row.original._id)
    );
    try {
      await deleteProject({ setErrMsg }, row.original._id);
      await fetchProjectIDs();
      setProjectStateUpdate(defaultProjectState);
      setDeletePopup(false);
    } catch (error) {
      setErrMsg(error);
      console.error(error);
    }
  };

  const selectEditProjectFromRowId = async (row) => {
    const arr = projectTableData.filter(
      (item) => item._id === row.original._id
    );
    const date = new Date(arr[0]?.Created);
    arr[0].CreatedFormatted = date.toLocaleDateString();

    const updatedMembers = await Promise.all(
      arr[0].Members.map(async (member) => {
        if (typeof member === "string") {
          const response = await getUserById(member);
          const { _id, FirstName, LastName, Email } = response.user;
          const FullName = `${FirstName} ${LastName}`;
          return { _id, FirstName, LastName, Email, FullName };
        } else {
          return member;
        }
      })
    );

    const updatedProjectState = { ...arr[0], Members: updatedMembers };
    setProjectStateUpdate(updatedProjectState);
    setEditPopup(true);
  };

  const handleBugsButtonClick = () => {
    navigate("/bugs");
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
          {/* Project delete confirmation modal */}
          <Modal trigger={deletePopup} setTrigger={setDeletePopup}>
            <div className="select-container">
              <div className="grid1">
                <h3>
                  Are you sure you want to delete:{" "}
                  {deleteConfirmationState?.original?.Title}
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
          {/* New project Modal */}
          <Project
            trigger={projectPopup}
            setTrigger={setProjectPopup}
            state={projectState}
            setState={setProjectState}
            defaultState={defaultProjectState}
          >
            <h3>New project</h3>

            <form onSubmit={handleNewProjectSubmit}>
              <div className="select-container">
                <div className="grid1">
                  <label htmlFor="Title">Title</label>
                  <input
                    ref={inputTitle}
                    required="required"
                    autoFocus
                    name="Title"
                  ></input>
                </div>

                <div className="grid1">
                  <label htmlFor="Description">Description</label>
                  <textarea
                    ref={inputDescription}
                    required="required"
                    name="Description"
                    rows="6"
                  ></textarea>
                </div>

                <div className="grid2">
                  <label title="Click to add member">Choose Members</label>
                  <div className="new-project-table-container">
                    <Selectiontable
                      DATA={allUsers}
                      COLUMNS={SELECTIONCOLUMNS}
                      HEADLESS
                      FILTER
                      PLACEHOLDER="Filter by Employee"
                      onClick={newProjectAddMember}
                      minRows={0}
                    />
                  </div>
                </div>

                <div className="grid2">
                  <label
                    title="Left click to assign Team Lead | Right click to remove Members"
                    id="members"
                    style={{ color: "#FF2530" }}
                  >
                    Team Lead: {projectState?.TeamLeadName}
                  </label>
                  <div className="new-project-table-container">
                    <Selectiontable
                      DATA={projectState.Members ? projectState.Members : []}
                      COLUMNS={SELECTIONCOLUMNS}
                      HEADLESS
                      FILTER
                      PLACEHOLDER="Filter by Employee"
                      onClick={newProjectTeamLeadSelect}
                      onContextMenu={newProjectRemoveMember}
                      minRows={0}
                    />
                  </div>
                </div>

                <div className="grid2">
                  <label htmlFor="Status">Status</label>
                  <select onChange={handleNewProjectChange} name="Status">
                    <option value="Incomplete">Incomplete</option>
                    <option value="Complete">Complete</option>
                  </select>
                </div>

                <div className="grid2">
                  <label htmlFor="Urgency">Priority</label>
                  <select
                    onChange={handleNewProjectChange}
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
          </Project>
          {/* Edit Project Modal */}
          <Project trigger={editPopup} setTrigger={setEditPopup}>
            <h3>
              Currently Editing:{" "}
              {projectStateUpdate
                ? projectStateUpdate.Title
                : "Project failed to load"}
            </h3>

            <form onSubmit={handleEditProjectSubmit}>
              <div className="select-container">
                <div className="grid1">
                  <label htmlFor="projectEdit">Title</label>
                  <input
                    required="required"
                    autoFocus
                    name="projectEdit"
                    defaultValue={projectStateUpdate?.Title}
                    ref={editTitle}
                  ></input>
                </div>

                <div className="grid1">
                  <label htmlFor="Description">Description</label>
                  <textarea
                    required="required"
                    name="descriptionEdit"
                    rows="6"
                    defaultValue={projectStateUpdate?.Description}
                    ref={editDescription}
                  ></textarea>
                </div>

                <div className="grid2">
                  <label title="Click to add member">Choose Members</label>
                  <div className="new-project-table-container">
                    <Selectiontable
                      DATA={allUsers}
                      COLUMNS={SELECTIONCOLUMNS}
                      HEADLESS
                      FILTER
                      PLACEHOLDER="Filter by Employee"
                      onClick={editProjectMemberAdd}
                      minRows={0}
                    />
                  </div>
                </div>

                <div className="grid2">
                  <label
                    title="Left click to assign Team Lead | Right click to remove Members"
                    id="editProjectTeamLead"
                  >
                    Team Lead: {projectStateUpdate?.TeamLeadName}
                  </label>
                  <div className="new-project-table-container">
                    <Selectiontable
                      DATA={
                        projectStateUpdate.Members
                          ? projectStateUpdate.Members
                          : []
                      }
                      COLUMNS={SELECTIONCOLUMNS}
                      HEADLESS
                      FILTER
                      PLACEHOLDER="Filter by Employee"
                      onClick={editProjectTeamLeadSelect}
                      onContextMenu={editProjectRemoveMember}
                      minRows={0}
                    />
                  </div>
                </div>

                <div className="grid2">
                  <label htmlFor="Status">Status</label>
                  <select
                    onChange={handleEditProjectChange}
                    name="Status"
                    value={projectStateUpdate.Status || "Incomplete"}
                  >
                    <option value="Incomplete">Incomplete</option>
                    <option value="Complete">Complete</option>
                  </select>
                </div>

                <div className="grid2">
                  <label htmlFor="Urgency">Priority</label>
                  <select
                    onChange={handleEditProjectChange}
                    name="Urgency"
                    value={projectStateUpdate.Urgency || "Critical"}
                  >
                    <option value="Critical">Critical</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div className="btn-container">
                <button className="project-btn">Submit</button>
                <button
                  className="project-btn yellow"
                  onClick={handleBugsButtonClick}
                >
                  Bugs {">>"}
                </button>
              </div>
            </form>
          </Project>
          {/* Main help modal */}
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
                <p>- Click NEW PROJECT button to create a new Project.</p>
                <p>
                  - Left click on a project in the table to view or edit it.
                </p>
                <p>- Right click on a project in the table to delete it.</p>
              </div>
            </div>
          </Modal>
          {/* Main */}
          <div className="dashboard-container">
            <div className="blue-bar"></div>
            <h4 className="page-title">DASHBOARD</h4>
            <div className="project-container">
              <div className="project-top-container">
                <h3>Projects</h3>
                <div style={{ display: "flex" }}>
                  <button
                    className="project-btn"
                    onClick={() => setProjectPopup(true)}
                  >
                    New project
                  </button>
                  <button
                    className="project-btn"
                    onClick={() => setHelpPopup(true)}
                  >
                    <FontAwesomeIcon
                      icon={faQuestion}
                      style={{ height: "13px" }}
                    />
                  </button>
                </div>
              </div>
              <div className="project-table-container">
                <Basictable
                  COLUMNS={PROJECTCOLUMNS}
                  DATA={projectTableData}
                  FILTER
                  PLACEHOLDER="Filter by Project, Description or Team Lead"
                  minRows={0}
                  onContextMenu={deleteConfirmation}
                  onClick={selectEditProjectFromRowId}
                />
              </div>
            </div>

            {/* Pie charts */}
            <div className="chart-container">
              <div className="pie-wrapper">
                <h2>Tickets by Urgnecy</h2>
                <div className="pie-container">
                  <PieChart
                    style={{ height: "150px" }}
                    data={[
                      {
                        label: {},
                        title: "Low",
                        value: ticketUrgency.Low || 0,
                        color: "#009B83",
                      },
                      {
                        label: {},
                        title: "Normal",
                        value: ticketUrgency.Normal || 0,
                        color: "#FFA825",
                      },
                      {
                        label: {},
                        title: "Critical",
                        value: ticketUrgency.Critical || 0,
                        color: "#FF2530",
                      },
                    ]}
                  />
                  <ul>
                    <li>Critical: {ticketUrgency.Critical || 0}</li>
                    <li>Normal: {ticketUrgency.Normal || 0}</li>
                    <li>Low: {ticketUrgency.Low || 0}</li>
                  </ul>
                </div>
              </div>

              <div className="pie-wrapper">
                <h2>Tickets by Status</h2>
                <div className="pie-container pie-status">
                  <PieChart
                    style={{ height: "150px" }}
                    data={[
                      {
                        label: {},
                        title: "Complete",
                        value: ticketStatus.Complete || 0,
                        color: "#009B83",
                      },
                      {
                        label: {},
                        title: "Incomplete",
                        value: ticketStatus.Incomplete || 0,
                        color: "#FF2530",
                      },
                    ]}
                  />
                  <ul>
                    <li>Complete: {ticketStatus.Complete || 0}</li>
                    <li>Incomplete: {ticketStatus.Incomplete || 0}</li>
                  </ul>
                </div>
              </div>

              <div className="pie-wrapper">
                <h2>Projects by Urgency</h2>
                <div className="pie-container">
                  <PieChart
                    style={{ height: "150px" }}
                    data={[
                      {
                        label: {},
                        title: "Low",
                        value: projectUrgency.Low || 0,
                        color: "#009B83",
                      },
                      {
                        label: {},
                        title: "Normal",
                        value: projectUrgency.Normal || 0,
                        color: "#FFA825",
                      },
                      {
                        label: {},
                        title: "Critical",
                        value: projectUrgency.Critical || 0,
                        color: "#FF2530",
                      },
                    ]}
                  />
                  <ul>
                    <li>Critical: {projectUrgency.Critical || 0}</li>
                    <li>Normal: {projectUrgency.Normal || 0}</li>
                    <li>Low: {projectUrgency.Low || 0}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
