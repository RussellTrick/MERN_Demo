import React, { useRef } from "react";
import "./Dashboard.css";
import { PieChart } from "react-minimal-pie-chart";
import DATA from "./MOCK_DATA.json";
import Basictable from "./Basictable";
import Project from "./Project";
import { useState } from "react";
import { format } from "date-fns";
import Selectiontable from "./Selectiontable";

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

// const total = low + critical + normal;

const COLUMNS = [
  { Header: "PROJECT", accessor: "project" },
  { Header: "DESCRIPTION", accessor: "description" },
  { Header: "TEAM LEAD", accessor: "teamlead" },
];

const SELECTIONCOLUMNS = [{ Header: "DEVELOPERS", accessor: "reporter" }];

// TODO create api call
const DATATEST = [
  {
    id: 1,
    project: "Tic Tac Toe Game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
  {
    id: 1,
    project: "Tic Tac Toe Game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
  {
    id: 1,
    project: "Tic Tac Toe Game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
  {
    id: 1,
    project: "Tic Tac Toe Game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
  {
    id: 1,
    project: "Tic Tac Toe Game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
  {
    id: 1,
    project: "Tic Tac Toe Game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
  {
    id: 1,
    project: "Tic Tac Toe Game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
  {
    id: 1,
    project: "Tic Tac Toe Game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
  {
    id: 1,
    project: "Tic Tac Toe Game",
    description: "tictactoe game in java",
    teamlead: "Owain",
  },
];
// ----------------------------------------------------------------

// TODO Create different pie charts

const dateNow = format(new Date(), "dd/MM/yyyy");

const Dashboard = () => {
  const [projectPopup, setProjectPopup] = useState(false);

  const [formData, setFormData] = useState({
    project: "",
    description: "",
    teamlead: "",
    members: "",
    status: "incomplete",
    urgency: "critical",
    date: { dateNow },
  });

  const handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...formData };

    newFormData[fieldName] = fieldValue;

    setFormData(newFormData);
  };

  const inputTitle = useRef();
  const inputDescription = useRef();

  const handleSubmit = () => {
    const newFormData = { ...formData };

    newFormData["description"] = inputDescription;
    newFormData["project"] = inputTitle;
    setFormData(newFormData);
  };

  return (
    <>
      <Project trigger={projectPopup} setTrigger={setProjectPopup}>
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
              <label htmlFor="developers">Developers</label>
              <div className="new-project-table-container">
                <Selectiontable
                  DATA={DATA}
                  COLUMNS={SELECTIONCOLUMNS}
                  HEADLESS
                  FILTER
                  name="developers"
                  PLACEHOLDER="Filter by Developer"
                />
              </div>
            </div>

            <div className="grid2">
              <label htmlFor="teamlead">Team Lead</label>
              <div className="new-project-table-container">
                <Selectiontable
                  DATA={DATA}
                  COLUMNS={SELECTIONCOLUMNS}
                  HEADLESS
                  FILTER
                  name="developers"
                  PLACEHOLDER="Filter by Developer"
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

      <div className="dashboard-container">
        <div className="blue-bar"></div>
        <h4 className="page-title">DASHBOARD</h4>
        <div className="project-container">
          <div className="project-top-container">
            <h3>Projects</h3>
            <button
              className="project-btn"
              onClick={() => setProjectPopup(true)}
            >
              New project
            </button>
          </div>
          <div className="project-table-container">
            <Basictable
              COLUMNS={COLUMNS}
              DATA={DATATEST}
              FILTER
              PLACEHOLDER="Filter by Project, Description or Team Lead"
            />
          </div>
        </div>

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
