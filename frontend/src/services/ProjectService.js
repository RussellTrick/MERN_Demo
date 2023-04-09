import axios from "../api/axios";

export function getProjectsByUserId() {
  axios
    .get("/projects", { withCredentials: true })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((err) => {
      console.error(err);
      // handle the error here
    });
}

export function getProjectById({ setErrMsg }, projectId) {
  axios
    .get(`/projects/${projectId}`, { withCredentials: true })
    .then((res) => {
      console.log(res);
      // handle the response data here
    })
    .catch((err) => {
      console.error(err);
      // handle the error here
    });
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
      // handle the error here
    });
}

export function updateProject({ setErrMsg }, { projectStateUpdate }) {
  const updatedData = {};
  updatedData.Title = projectStateUpdate?.title;
  updatedData.Description = projectStateUpdate?.description;
  updatedData.TeamLead = projectStateUpdate?.teamlead;
  updatedData.Status = projectStateUpdate?.status;
  updatedData.Urgency = projectStateUpdate?.urgency;
  updatedData.Members = projectStateUpdate?.members;
  updatedData.Tickets = projectStateUpdate?.tickets;

  if (!projectStateUpdate.projectId) {
    setErrMsg("Cannot update project: projectId is missing");
    console.log("Cannot update project missing id");
    return;
  }

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
