import { useContext } from "react";
import ProjectContext from "../context/ProjectsContext";

const useProjects = () => {
  return useContext(ProjectContext);
};

export default useProjects;
