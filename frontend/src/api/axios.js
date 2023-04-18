import axios from "axios";
const BASEURL = process.env.REACT_APP_API_URL;

//For standard requests
export default axios.create({
  baseURL: BASEURL,
});

//For requests that require the http-only cookie
export const axiosPrivate = axios.create({
  baseURL: BASEURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
