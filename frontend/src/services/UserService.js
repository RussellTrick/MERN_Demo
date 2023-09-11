import axios, { axiosPrivate } from "../api/axios";

export async function SignIn({ setErrMsg }, user, pwd, callback) {
  axios
    .post(
      "/users/login",
      { Email: user, Password: pwd },
      { withCredentials: true }
    )
    .then((res) => {
      localStorage.setItem("authenticated", "true");
      if (typeof callback === "function") {
        console.log("callback called");
        callback();
      }
    })
    .catch(function (err) {
      console.error(err);
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Email or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorised");
      } else {
        setErrMsg("Login Failed");
      }
    });
}

export async function SignUp(
  { setErrMsg },
  Email,
  Password,
  FirstName,
  LastName
) {
  return axios
    .post(
      "/users/register",
      { Email: Email.toLowerCase(), Password, FirstName, LastName },
      { withCredentials: true }
    )
    .then((res) => console.log(res))
    .catch(function (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Invalid Email Address");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorised");
      } else if (err.response?.status === 409) {
        setErrMsg("Email Address already in use");
      } else {
        setErrMsg("Registration failed");
      }
      throw err;
    });
}

export function SignOut({ setErrMsg }, callback) {
  axios
    .post("/users/logout", null, { withCredentials: true })
    .then(() => {
      // Clear cookies or perform any other necessary cleanup
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log("User signed out successfully");
      localStorage.removeItem("authenticated");

      if (typeof callback === "function") {
        console.log("callback called");
        callback();
      }
    })
    .catch(function (err) {
      console.error(err);
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorised");
      } else {
        setErrMsg("Logout Failed");
      }
    });
}

export async function getUsers() {
  return axiosPrivate.get("/users/getusers").catch(function (err) {
    console.error(err);
    if (!err?.response) {
      console.log("No Server Response", err.response);
    } else if (err.response?.status === 401) {
      console.log("Unauthorised", err.response);
    } else {
      console.log("Uncaught Error", err.response);
    }
  });
}

export async function getUserById(id) {
  return axiosPrivate
    .get(`/users/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

export async function addProjectToUser(projectId, userId = null) {
  if (!projectId) return console.log("Project id is required");
  return axiosPrivate
    .post("/users/", {
      userId: userId,
      projectId: projectId,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

export function deleteProjectFromUser(projectId, userId = null) {
  if (!projectId) return console.log("Project id is required");
  return axiosPrivate
    .delete("/users", {
      data: { userId: userId, projectId: projectId },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}
