import axios from "../api/axios";

export function SignIn({ setErrMsg }, user, pwd) {
  axios
    .post(
      "/users/login",
      { Email: user, Password: pwd },
      { withCredentials: true }
    )
    .then((res) => {
      console.log(res);
      const cookies = res.headers["set-cookie"];
      if (cookies) {
        cookies.forEach((cookie) => {
          document.cookie = cookie;
        });
      }
      console.log(cookies);
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

export async function SignUp({ setErrMsg }, user, pwd) {
  const response = axios({
    method: "post",
    url: "/users/register",
    data: { Email: user, Password: pwd },
    withCredentials: true,
  })
    .then((res) => console.log(res))
    .catch(function (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Invalid Email Address");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorised");
      } else {
        setErrMsg("Registration failed");
      }
    });
  return response;
}

export function SignOut({ setErrMsg }) {
  axios
    .post("/users/logout", null, { withCredentials: true })
    .then(() => {
      // Clear cookies or perform any other necessary cleanup
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log("User signed out successfully");
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
