// Utils.js
/*import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true; // important

export default axios;*/
import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export default api;
