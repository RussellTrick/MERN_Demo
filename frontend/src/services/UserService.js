import axios from "../api/axios";

export function SignIn({ setErrmsg }, user, pwd) {
  axios({
    method: "post",
    url: axios.baseURL + "/users/signin",
    Email: user,
    Password: pwd,
    withCredentials: true,
  })
    .then((res) => console.log(res))
    .catch(function (err) {
      if (!err?.response) {
        setErrmsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrmsg("Missing Email or Password");
      } else if (err.response?.status === 401) {
        setErrmsg("Unauthorised");
      } else {
        setErrmsg("Login Failed");
      }
    });
}

export function SignOut(data) {}

export async function SignUp(email, password) {
  const response = await axios.post(
    axios.baseURL + "/users/signup",
    JSON.stringify({ user: email, password: password }),
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

  return response;
}
