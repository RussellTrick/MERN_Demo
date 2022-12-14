import "./App.css";
import Loginbox from "./components/Loginbox";
import { Routes, Route } from "react-router-dom";
import Bugs from "./components/Bugs";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import { useState } from "react";

function App() {
  const [projectState, setProjectState] = useState([]);

  return (
    <div className="container">
      <Navbar />
      <div>
        <Routes>
          <Route
            path="/"
            element={<Dashboard setProjectState={setProjectState} />}
          />
          <Route path="/bugs" element={<Bugs projectState={projectState} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
