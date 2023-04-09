import React, { useEffect, useRef } from "react";
import "./Dashboard.css";
import { PieChart } from "react-minimal-pie-chart";
import DATA from "./MOCK_DATA.json";
import Basictable from "./Basictable";
import Project from "./Project";
import { useState } from "react";
import { format } from "date-fns";
import Selectiontable from "./Selectiontable";
import Modal from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import useProjects from "../hooks/useProjects";

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

const COLUMNS = [
  { Header: "PROJECT", accessor: "project" },
  { Header: "DESCRIPTION", accessor: "description" },
  { Header: "TEAM LEAD", accessor: "teamlead" },
];

const SELECTIONCOLUMNS = [{ Header: "DEVELOPERS", accessor: "reporter" }];

const TEAMLEADCOLUMNS = [{ Header: "TEAM LEAD", accessor: "member" }];

// TODO: create api call
// sendRequest().then(setProjectState).then(()=>{navigate('/bugs/');});
// OR sendRequest().then(setProjectState).then(()=>{navigate('/bugs/?p=OBJECTID');});

const DATATEST = [
  {
    id: 1,
    project: "Tic Tac Toe Game",
    description: "tictactoe game in java",
    teamlead: "",
  },
  {
    id: 2,
    project: "Dog game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
  {
    id: 3,
    project: "Cat game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
  {
    id: 4,
    project: "Developer portal",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
  {
    id: 5,
    project: "Tic Tac Toe Game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
  {
    id: 6,
    project: "Tic Tac Toe Game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
  {
    id: 7,
    project: "Tic Tac Toe Game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
  {
    id: 8,
    project: "Tic Tac Toe Game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
  {
    id: 9,
    project: "Tic Tac Toe Game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
];
// ----------------------------------------------------------------

// TODO Create different pie charts

const dateNow = format(new Date(), "dd/MM/yyyy");

const Dashboard = () => {
  const { projects } = useProjects();

  const [projectPopup, setProjectPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [helpPopup, setHelpPopup] = useState(false);
  const inputTitle = useRef(null);
  const inputDescription = useRef(null);

  // Disable right click, context menu
  useEffect(() => {
    window.addEventListener("contextmenu", (e) => e.preventDefault());
    console.log(projects);

    return () => {
      window.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, []);

  const defaultFormData = {
    id: 1,
    project: "",
    description: "",
    teamlead: "Not selected",
    members: [],
    status: "incomplete",
    urgency: "critical",
    date: { dateNow },
  };

  const [dataTEST, setDataTEST] = useState(DATATEST);

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

  const childAddMemberFormData = (childdata) => {
    const newFormData = { ...formData };

    if (newFormData.members.some((item) => item.member === childdata)) {
      return;
    } else {
      newFormData.members = [...formData.members, { member: childdata }];
    }

    setFormData(newFormData);
  };

  const childRemoveMemberFormData = (childdata) => {
    const newFormData = { ...formData };

    if (!newFormData.members.some((item) => item.member === childdata)) {
      return;
    } else {
      newFormData.members = formData.members.filter(
        (item) => item.member !== childdata
      );
    }

    setFormData(newFormData);
  };

  const childTeamLeadSelect = (childdata) => {
    const newFormData = { ...formData };

    if (newFormData.teamlead.includes(childdata)) {
      return;
    } else {
      newFormData.teamlead = childdata;
    }

    var z = document.getElementById("members");
    z.style.color = "#009B83";

    setFormData(newFormData);
  };

  const deleteConfirmation = (row) => {
    if (row != null) {
      setDeleteConfirmationState(row);
    }
    setDeletePopup(true);
  };

  //TODO add delete request and link to API
  const deleteRow = (row) => {
    setDataTEST(dataTEST.filter((current) => current.id !== row.original.id));
    setDeletePopup(false);
  };

  return (
    <>
      {/* Project delete confirmation modal */}
      <Modal trigger={deletePopup} setTrigger={setDeletePopup}>
        <div className="select-container">
          <div className="grid1">
            <h3>
              Are you sure you want to delete:{" "}
              {deleteConfirmationState?.original?.project}
              {"?"}
            </h3>
          </div>
          <div className="grid2">
            <button
              style={{ background: "#FF2530" }}
              className="project-btn"
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
                  DATA={DATA}
                  COLUMNS={SELECTIONCOLUMNS}
                  HEADLESS
                  FILTER
                  PLACEHOLDER="Filter by Employee"
                  leftClickCell={childAddMemberFormData}
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
                Team Lead: {formData.teamlead}
              </label>
              <div className="new-project-table-container">
                <Selectiontable
                  DATA={formData.members}
                  COLUMNS={TEAMLEADCOLUMNS}
                  HEADLESS
                  FILTER
                  PLACEHOLDER="Filter by Employee"
                  leftClickCell={childTeamLeadSelect}
                  rightClickCell={childRemoveMemberFormData}
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
              COLUMNS={COLUMNS}
              DATA={projects || dataTEST}
              FILTER
              PLACEHOLDER="Filter by Project, Description or Team Lead"
              deletePopup={deleteConfirmation}
              minRows={0}
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
