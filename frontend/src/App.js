import "./App.css";
import Loginbox from "./components/Loginbox";
import { Routes, Route } from "react-router-dom";
import Bugs from "./components/Bugs";
import Dashboard from "./components/Dashboard";
import { useState } from "react";
import Layout from "./components/Layout";
import LoginLayout from "./components/LoginLayout";
import RequireAuth from "./components/RequireAuth";
import Register from "./components/Register";

function App() {
  const [projectState, setProjectState] = useState([]);

  return (
    <Routes>
      <Route path="/" element={<LoginLayout />}>
        <Route path="/login" element={<Loginbox />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* <Route element={<RequireAuth />}> */}
      <Route path="/" element={<Layout />}>
        <Route
          path="/dashboard"
          element={<Dashboard setProjectState={setProjectState} />}
        />
        <Route path="/bugs" element={<Bugs projectState={projectState} />} />
      </Route>
      {/* </Route> */}
    </Routes>
  );
}

export default App;
