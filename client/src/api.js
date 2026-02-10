import axios from "axios";

const api = axios.create({
  baseURL: "https://to-do-list-nut2.onrender.com",
  withCredentials: true,
});

export default api;
