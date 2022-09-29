import "./App.css";
import Loginbox from "./components/Loginbox";
import { Routes, Route } from "react-router-dom";
import Bugs from "./components/Bugs";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="container">
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bugs" element={<Bugs />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
