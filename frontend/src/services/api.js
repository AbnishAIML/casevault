import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// Request interceptor: attach valid Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sdms_token");
  if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// Response interceptor: automatically handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("sdms_token");
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register" && currentPath !== "/") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
