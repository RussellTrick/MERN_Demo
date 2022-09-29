import React from "react";
import Basictable from "./Basictable";
import { COLUMNS } from "./Bugcolumns";

const bugs = () => {
  return <Basictable COLUMNS={COLUMNS} />;
};

export default bugs;
