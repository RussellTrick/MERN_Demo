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

export function SignOut(data) {}

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
