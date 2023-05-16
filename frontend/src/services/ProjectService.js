import axios from "../api/axios";
import { addProjectToUser } from "./UserService";

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

export function createProject(
  { setErrMsg },
  formData,
  formDataDefault,
  userId = null
) {
  const memberIds = formData.Members.map((member) => member._id);

  axios
    .post(
      "/projects",
      {
        Title: formData.Title || formDataDefault.Title,
        Description: formData.Description || formDataDefault.Description,
        TeamLead: formData.TeamLead || formDataDefault.TeamLead,
        Created: formData.Created || formDataDefault.Created,
        Status: formData.Status || formDataDefault.Status,
        Urgency: formData.Urgency || formDataDefault.Urgency,
        Members: memberIds || formDataDefault.Members,
        Tickets: formData.Tickets || formDataDefault.Tickets,
      },
      { withCredentials: true }
    )
    .then((res) => {
      console.log(res);
      const projectId = res.data.project._id;
      addProjectToUser(projectId, userId);
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
  updatedData.Title = projectStateUpdate?.Title;
  updatedData.Description = projectStateUpdate?.Description;
  updatedData.TeamLead = projectStateUpdate?.TeamLead;
  updatedData.Status = projectStateUpdate?.Status;
  updatedData.Urgency = projectStateUpdate?.Urgency;
  updatedData.Members = projectStateUpdate?.Members;
  updatedData.Tickets = projectStateUpdate?.Tickets;

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
