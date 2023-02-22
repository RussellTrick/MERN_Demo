import { Outlet } from "react-router-dom";
import AppCSS from "./App.module.css";

const Layout = () => {
  return (
    <main className={AppCSS.app}>
      <Outlet />
    </main>
  );
};

export default Layout;
