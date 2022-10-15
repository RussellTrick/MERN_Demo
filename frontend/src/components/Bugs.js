import React from "react";
import Basictable from "./Basictable";
import { COLUMNS } from "./Bugcolumns";
import DATA from "./MOCK_DATA.json";
import "./Bugs.css";

const bugs = () => {
  return (
    <div className="container">
      <Basictable COLUMNS={COLUMNS} DATA={DATA} />
    </div>
  );
};

export default bugs;
