import axios from "axios";
const BASEURL = "http://localhost:3001/api/v1";

export default axios.create({
  baseURL: BASEURL,
});
