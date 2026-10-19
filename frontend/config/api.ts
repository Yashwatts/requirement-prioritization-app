import axios from "axios";
import { authenticationService } from "@/auth/authentication-service";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
});

// Request interceptor to automatically attach Firebase ID token to outgoing requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await authenticationService.getIdToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // If token retrieval fails or user is not logged in, proceed without Authorization header
  }
  return config;
});