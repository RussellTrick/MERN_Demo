import { createContext, useState, useEffect } from "react";
import { getProjectsByUserId } from "../services/ProjectService";

const ProjectContext = createContext({});

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [projectStateUpdate, setProjectStateUpdate] = useState();
  const [projectState, setProjectState] = useState({
    Title: { value: "", default: "Untitled" },
    Description: { value: "", default: "" },
    Teamlead: { value: "", default: "" },
    Created: { value: "", default: new Date() },
    Status: { value: "", default: "Uncompleted" },
    Urgency: { value: "", default: "Low" },
    Members: { value: [], default: [] },
    Tickets: { value: [], default: [] },
  });

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
        setProjectStateUpdate,
        fetchProjectIDs,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;
