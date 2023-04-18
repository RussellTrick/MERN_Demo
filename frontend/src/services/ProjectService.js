import axios from "../api/axios";

export async function getProjectsByUserId() {
  return axios
    .get("/projects", { withCredentials: true })
    .then((res) => {
      const { data } = res;
      return data;
    })
    .catch((err) => {
      console.error(err);
      // handle the error here
    });
}
export async function getProjectById({ setErrMsg }, projectId) {
  return axios
    .get(`/projects/${projectId}`, { withCredentials: true })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
      // handle the error here
    });
}

export async function getProjects(setErrMsg, projectsObj) {
  try {
    const { projects } = projectsObj;
    if (!Array.isArray(projects)) {
      throw new Error("Projects parameter must be an array");
    }

    const projectData = await Promise.all(
      projects.map(async (projectId) => {
        try {
          const res = await getProjectById({ setErrMsg }, projectId);
          const project = res.data.project; // Access the project object from the response data
          return project;
        } catch (err) {
          // Handle the error for the individual project here
          console.error(err);
          // You can return a default value or handle the error as needed
          return {
            id: "",
            project: "Project not found",
            description: "Project not found",
            teamlead: "",
          };
        }
      })
    );

    return projectData;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export function createProject({ setErrMsg }, { projectState }) {
  axios
    .post(
      "/projects",
      {
        Title: projectState.title || projectState.default.title,
        Description:
          projectState.description || projectState.default.description,
        Teamlead: projectState.teamlead || projectState.default.teamlead,
        Created: projectState.created || projectState.default,
        Status: projectState.status || projectState.default.status,
        Urgency: projectState.urgency || projectState.default.urgency,
        Members: projectState.members || projectState.default.members,
        Tickets: projectState.tickets || projectState.default.tickets,
      },
      { withCredentials: true }
    )
    .then((res) => {
      console.log(res);
      // handle the response data here
    })
    .catch((err) => {
      console.error(err);
      setErrMsg(err);
    });
}

export function updateProject({ setErrMsg }, { projectStateUpdate }) {
  if (!projectStateUpdate.projectId) {
    setErrMsg("Cannot update project: projectId is missing");
    console.log("Cannot update project missing id");
    return;
  }

  const updatedData = {};
  updatedData.Title = projectStateUpdate?.title;
  updatedData.Description = projectStateUpdate?.description;
  updatedData.TeamLead = projectStateUpdate?.teamlead;
  updatedData.Status = projectStateUpdate?.status;
  updatedData.Urgency = projectStateUpdate?.urgency;
  updatedData.Members = projectStateUpdate?.members;
  updatedData.Tickets = projectStateUpdate?.tickets;

  axios
    .put(
      `/projects/${projectStateUpdate.projectId}`,
      { updatedData },
      { withCredentials: true }
    )
    .then((res) => {
      console.log(res);
      // handle the response data here
    })
    .catch((err) => {
      console.error(err);
      // handle the error here
    });
}

export function deleteProject({ setErrMsg }, projectId) {
  axios
    .delete(`/projects/${projectId}`, { withCredentials: true })
    .then((res) => {
      console.log(res);
      // handle the response data here
    })
    .catch((err) => {
      console.error(err);
      // handle the error here
    });
}
