import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:4000/api", // matches your backend's port
});

// Automatically attach the JWT to every outgoing request, if one exists
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
