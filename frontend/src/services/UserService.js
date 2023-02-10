import axios from "../api/axios";

export function SignIn(data) {
  axios({
    method: "post",
    url: axios.baseURL + "/users/signin",
    data: data,
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err.response));
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
