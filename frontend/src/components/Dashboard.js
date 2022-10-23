import React from "react";
import "./Dashboard.css";
import { PieChart } from "react-minimal-pie-chart";
import DATA from "./MOCK_DATA.json";
import Basictable from "./Basictable";

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
const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="blue-bar"></div>
      <h4 className="page-title">DASHBOARD</h4>

      <div className="project-container">
        <div className="project-top-container">
          <h3>Projects</h3>
          <button className="project-btn">New project</button>
        </div>
        <div className="project-table-container">
          <Basictable COLUMNS={COLUMNS} DATA={DATATEST} FILTER />
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
                { label: {}, title: "Normal", value: normal, color: "#FFA825" },
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
                { label: {}, title: "Normal", value: normal, color: "#FFA825" },
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
                { label: {}, title: "Normal", value: normal, color: "#FFA825" },
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
  );
};

export default Dashboard;
