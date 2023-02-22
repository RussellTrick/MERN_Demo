import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import AppCSS from "./App.module.css";

const Layout = () => {
  return (
    <main className={AppCSS.app}>
      <Navbar />
      <Outlet />
    </main>
  );
};

export default Layout;
