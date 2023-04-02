import "./App.css";
import Loginbox from "./components/Loginbox";
import { Routes, Route } from "react-router-dom";
import Bugs from "./components/Bugs";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import LoginLayout from "./components/LoginLayout";
import RequireAuth from "./components/RequireAuth";
import Register from "./components/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginLayout />}>
        <Route path="/login" element={<Loginbox />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bugs" element={<Bugs />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
