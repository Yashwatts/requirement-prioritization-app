import axios from "axios";
import { getLocale } from "@/localize";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const locale = getLocale();
    if (locale) {
      config.headers["Accept-Language"] = locale;
    }
  }
  return config;
});
