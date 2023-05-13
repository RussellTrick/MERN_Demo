import React, { useEffect, useRef } from "react";
import "./Dashboard.css";
import { PieChart } from "react-minimal-pie-chart";
import DATA from "./MOCK_DATA.json";
import Basictable from "./Basictable";
import Project from "./Project";
import { useState } from "react";
import Selectiontable from "./Selectiontable";
import Modal from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import useProjects from "../hooks/useProjects";
import { getProjects, createProject } from "../services/ProjectService";
import { useNavigate } from "react-router-dom";
import { getUsers, getUserById } from "../services/UserService";

//Map out data into array
const urgencyData = DATA.map(function (index) {
  return index.urgency;
});
//Counters
const urgencyCount = {};
//Loop array to get count of occurrences
for (const num of urgencyData) {
  urgencyCount[num] = (urgencyCount[num] || 0) + 1;
}
//Create data for the piechart
const low = urgencyCount["low"] ? parseInt(urgencyCount["low"]) : 0;
const critical = urgencyCount["critical"]
  ? parseInt(urgencyCount["critical"])
  : 0;
const normal = urgencyCount["normal"] ? parseInt(urgencyCount["normal"]) : 0;

const PROJECTCOLUMNS = [
  { Header: "TITLE", accessor: "Title" },
  { Header: "DESCRIPTION", accessor: "Description" },
  { Header: "TEAM LEAD", accessor: "TeamLeadName" },
];

const SELECTIONCOLUMNS = [{ Header: "FULLNAME", accessor: "FullName" }];

// TODO Create different pie charts

const Dashboard = () => {
  const {
    projects,
    fetchProjectIDs,
    projectState,
    projectStateUpdate,
    setProjectState,
    setProjectStateUpdate,
  } = useProjects();

  const [errMsg, setErrMsg] = useState();
  const [projectPopup, setProjectPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [helpPopup, setHelpPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const inputTitle = useRef(null);
  const inputDescription = useRef(null);
  const [projectTableData, setProjectTableData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, isLoading] = useState(false);
  const navigate = useNavigate();

  //Disable right click, context menu and load intial projects
  useEffect(() => {
    window.addEventListener("contextmenu", (e) => e.preventDefault());

    const fetchData = async () => {
      try {
        await fetchProjectIDs(); // Fetch projects
        isLoading(true); // Set flag to indicate projects is ready
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
      if (loading) {
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
      }
    };
    fetchData();
  }, [loading]);

  const defaultFormData = {
    Project: "",
    Description: "",
    TeamLead: "",
    TeamLeadName: "Not Selected",
    Members: [],
    Status: "incomplete",
    Urgency: "critical",
  };

  const [deleteConfirmationState, setDeleteConfirmationState] =
    useState(defaultFormData);
  const [formData, setFormData] = useState(defaultFormData);

  const handleAddFormChange = (e) => {
    e.preventDefault();

    const fieldName = e.target.getAttribute("name");
    const fieldValue = e.target.value;

    const newFormData = { ...formData };

    newFormData[fieldName] = fieldValue;

    setFormData(newFormData);
  };

  // TODO Submit form to API && Refactor so that formData is sent to the API
  const handleSubmit = (e) => {
    e.preventDefault();
    const newFormData = { ...formData };

    newFormData["description"] = inputDescription.current.value;
    newFormData["project"] = inputTitle.current.value;

    setFormData(newFormData);
    setProjectPopup(false);
  };

  const newProjectAddMember = (childdata) => {
    const newFormData = { ...formData };

    if (
      newFormData.Members.some(
        (item) => item.Email === childdata?.original.Email
      )
    ) {
      return;
    } else {
      newFormData.Members = [
        ...formData.Members,
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

    setFormData(newFormData);
  };

  const newProjectRemoveMember = (childdata) => {
    const newFormData = { ...formData };
    const memberIdToRemove = childdata?.original._id;

    if (!memberIdToRemove) {
      return;
    }

    newFormData.Members = formData.Members.filter(
      (member) => member._id !== memberIdToRemove
    );

    setFormData(newFormData);
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
    const newFormData = { ...formData };

    if (newFormData.TeamLead.includes(childdata?.original._id)) {
      return;
    } else {
      newFormData.TeamLead = childdata?.original?._id;
      newFormData.TeamLeadName = childdata?.original?.FullName;
    }

    var z = document.getElementById("members");
    z.style.color = "#009B83";

    setFormData(newFormData);
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
    console.log(projectStateUpdate);
    const newFormData = { ...projectStateUpdate };
    console.log(newFormData);
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

  //TODO add delete request and link to API
  const deleteRow = (row) => {
    setProjectTableData(
      projectTableData.filter((current) => current._id !== row.original._id)
    );
    setDeletePopup(false);
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
    console.log(updatedProjectState);
    setProjectStateUpdate(updatedProjectState);
    setEditPopup(true);
  };

  const handleBugsButtonClick = () => {
    navigate("/bugs");
  };

  return (
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
        state={formData}
        setState={setFormData}
        defaultFormData={defaultFormData}
      >
        <h3>New project</h3>

        <form onSubmit={handleSubmit}>
          <div className="select-container">
            <div className="grid1">
              <label htmlFor="project">Title</label>
              <input
                ref={inputTitle}
                required="required"
                autoFocus
                name="project"
              ></input>
            </div>

            <div className="grid1">
              <label htmlFor="description">Description</label>
              <textarea
                ref={inputDescription}
                required="required"
                name="description"
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
                Team Lead: {formData?.TeamLeadName}
              </label>
              <div className="new-project-table-container">
                <Selectiontable
                  DATA={formData.Members}
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
              <label htmlFor="status">Status</label>
              <select onChange={handleAddFormChange} name="status">
                <option value="incomplete">Incomplete</option>
                <option value="complete">Complete</option>
              </select>
            </div>

            <div className="grid2">
              <label htmlFor="urgency">Priority</label>
              <select onChange={handleAddFormChange} name="urgency">
                <option value="critical">Critical</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>

            <button className="project-btn">Submit</button>
          </div>
        </form>
      </Project>

      {/* Edit Project Modal */}
      <Project
        trigger={editPopup}
        setTrigger={setEditPopup}
        state={formData}
        setState={setFormData}
      >
        <h3>
          Currently Editing:{" "}
          {projectStateUpdate
            ? projectStateUpdate.Title
            : "Project failed to load"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="select-container">
            <div className="grid1">
              <label htmlFor="projectEdit">Title</label>
              <input
                required="required"
                autoFocus
                name="projectEdit"
                defaultValue={projectStateUpdate?.Title}
              ></input>
            </div>

            <div className="grid1">
              <label htmlFor="descriptionEdit">Description</label>
              <textarea
                required="required"
                name="descriptionEdit"
                rows="6"
                defaultValue={projectStateUpdate?.Description}
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
                    projectStateUpdate.Members ? projectStateUpdate.Members : []
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
              <label htmlFor="editStatus">Status</label>
              <select
                onChange={handleAddFormChange}
                name="editStatus"
                defaultValue={projectStateUpdate.Status}
              >
                <option value="Incomplete">Incomplete</option>
                <option value="Complete">Complete</option>
              </select>
            </div>

            <div className="grid2">
              <label htmlFor="editUrgency">Priority</label>
              <select
                onChange={handleAddFormChange}
                name="editUrgency"
                defaultValue={projectStateUpdate.Urgency}
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
            <p1>- Click NEW PROJECT button to create a new Project.</p1>
            <p1>- Left click on a project in the table to view or edit it.</p1>
            <p1>- Right click on a project in the table to delete it.</p1>
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
                <FontAwesomeIcon icon={faQuestion} style={{ height: "13px" }} />
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
            <h2>Tickets by Priority</h2>
            <div className="pie-container">
              <PieChart
                style={{ height: "150px" }}
                data={[
                  { label: {}, title: "Low", value: low, color: "#009B83" },
                  {
                    label: {},
                    title: "Normal",
                    value: normal,
                    color: "#FFA825",
                  },
                  {
                    label: {},
                    title: "Critical",
                    value: critical,
                    color: "#FF2530",
                  },
                ]}
              />
              <ul>
                <li>Critical: {critical}</li>
                <li>Normal: {normal}</li>
                <li>Low: {low}</li>
              </ul>
            </div>
          </div>

          <div className="pie-wrapper">
            <h2>Tickets by Priority</h2>
            <div className="pie-container">
              <PieChart
                style={{ height: "150px" }}
                data={[
                  { label: {}, title: "Low", value: low, color: "#009B83" },
                  {
                    label: {},
                    title: "Normal",
                    value: normal,
                    color: "#FFA825",
                  },
                  {
                    label: {},
                    title: "Critical",
                    value: critical,
                    color: "#FF2530",
                  },
                ]}
              />
              <ul>
                <li>Critical: {critical}</li>
                <li>Normal: {normal}</li>
                <li>Low: {low}</li>
              </ul>
            </div>
          </div>

          <div className="pie-wrapper">
            <h2>Tickets by Priority</h2>
            <div className="pie-container">
              <PieChart
                style={{ height: "150px" }}
                data={[
                  { label: {}, title: "Low", value: low, color: "#009B83" },
                  {
                    label: {},
                    title: "Normal",
                    value: normal,
                    color: "#FFA825",
                  },
                  {
                    label: {},
                    title: "Critical",
                    value: critical,
                    color: "#FF2530",
                  },
                ]}
              />
              <ul>
                <li>Critical: {critical}</li>
                <li>Normal: {normal}</li>
                <li>Low: {low}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
