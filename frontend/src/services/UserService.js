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
