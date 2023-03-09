import axios from "axios";
const BASEURL = process.env.REACT_APP_API_URL;

export default axios.create({
  baseURL: BASEURL,
});

export const axiosPrivate = axios.create({
  baseURL: BASEURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
