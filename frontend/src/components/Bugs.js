import React from "react";
import Basictable from "./Basictable";
import { COLUMNS } from "./Bugcolumns";
import DATA from "./MOCK_DATA.json";

const bugs = () => {
  return <Basictable COLUMNS={COLUMNS} DATA={DATA} />;
};

export default bugs;
