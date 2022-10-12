import React from "react";
import "./Dashboard.css";
import { PieChart } from "react-minimal-pie-chart";
import DATA from "./MOCK_DATA.json";

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
const total = low + critical + normal;

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="blue-bar"></div>
      <h4 className="page-title">DASHBOARD</h4>
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
  );
};

export default Dashboard;
