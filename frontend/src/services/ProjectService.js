import axios from "../api/axios";

export function getProjectsByUserId({ setErrMsg }) {
  axios
    .get("/projects", { withCredentials: true })
    .then((res) => {
      console.log(res);
      // handle the response data here
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

export function createProject({ setErrMsg }, title, description) {
  axios
    .post("/projects", { title, description }, { withCredentials: true })
    .then((res) => {
      console.log(res);
      // handle the response data here
    })
    .catch((err) => {
      console.error(err);
      // handle the error here
    });
}

export function updateProject({ setErrMsg }, projectId, title, description) {
  axios
    .put(
      `/projects/${projectId}`,
      { title, description },
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
