import axios, { axiosPrivate } from "../api/axios";
import { addProjectToUser, deleteProjectFromUser } from "./UserService";

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
      setErrMsg(err);
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

export async function createProject(
  { setErrMsg },
  formData,
  formDataDefault,
  userId = null
) {
  const memberIds = formData.Members.map((member) => member._id);

  try {
    const res = await axios.post(
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
    );

    console.log(res);
    const projectId = res.data.project._id;
    await addProjectToUser(projectId, userId);
  } catch (err) {
    console.error(err);
    setErrMsg(err);
  }
}

export function updateProject({ setErrMsg }, projectStateUpdate) {
  if (!projectStateUpdate._id) {
    setErrMsg("Cannot update project: project ID is missing");
    console.log("Cannot update project missing ID`");
    return;
  }

  const projectId = projectStateUpdate._id;

  axiosPrivate
    .put(
      `/projects/${projectId}`,
      {
        Title: projectStateUpdate?.Title,
        Description: projectStateUpdate?.Description,
        TeamLead: projectStateUpdate?.TeamLead,
        Created: projectStateUpdate?.Created,
        Status: projectStateUpdate?.Status,
        Urgency: projectStateUpdate?.Urgency,
        Members: projectStateUpdate?.Members,
        Tickets: projectStateUpdate?.Tickets,
      },
      { withCredentials: true }
    )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
      setErrMsg(err);
    });
}

export async function deleteProject({ setErrMsg }, projectId) {
  try {
    const response = await axios.delete(`/projects/${projectId}`, {
      withCredentials: true,
    });

    if (response.status === 200) {
      await deleteProjectFromUser(projectId);
    }
  } catch (error) {
    console.error(error);
    setErrMsg(error);
  }
}

export function deleteTicketFromProject(projectId, ticketId) {
  if (!projectId) return console.log("Project id is required");
  if (!ticketId) return console.log("Ticket id is required");
  return axiosPrivate
    .delete("/projects", {
      data: { ticketId: ticketId, projectId: projectId },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

export function addTicketToProject(projectId, ticketId) {
  if (!projectId) return console.log("Project id is required");
  if (!ticketId) return console.log("Ticket id is required");
  return axiosPrivate
    .post("/projects/add", {
      projectId: projectId,
      ticketId: ticketId,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

export function countProjectUrgency({ setErrMsg }) {
  return axiosPrivate
    .get(`/projects/count-urgency`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      setErrMsg(err);
    });
}
