import { createContext, useState, useEffect } from "react";
import projectService from "../services/ProjectService";

const ProjectContext = createContext({});

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    projectService
      .getProjectsByUserId()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects,
        projectState,
        setProjectState,
        projectStateUpdate,
        setProjectStateUpdate,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;
