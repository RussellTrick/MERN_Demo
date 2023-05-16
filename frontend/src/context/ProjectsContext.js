import { createContext, useState } from "react";
import { getProjectsByUserId } from "../services/ProjectService";

const ProjectContext = createContext({});

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [projectStateUpdate, setProjectStateUpdate] = useState([]);
  const defaultProjectState = {
    Title: "Untitled",
    Description: "",
    TeamLead: "",
    TeamLeadName: "Not Selected",
    Created: new Date(),
    Status: "Uncompleted",
    Urgency: "Normal",
    Members: [],
    Tickets: [],
  };
  const [projectState, setProjectState] = useState(defaultProjectState);

  const fetchProjectIDs = async () => {
    try {
      const data = await getProjectsByUserId();
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects,
        projectState,
        setProjectState,
        projectStateUpdate,
        defaultProjectState,
        setProjectStateUpdate,
        fetchProjectIDs,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;
