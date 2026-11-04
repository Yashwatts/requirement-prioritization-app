import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});
