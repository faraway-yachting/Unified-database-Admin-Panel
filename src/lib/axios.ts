import axios from "axios";
import { config } from "../../config";

/**
 * Axios instance using config base URL and credentials.
 * Auth header is added per-request from localStorage so it works in client components.
 */
export const apiClient = axios.create({
  baseURL: config.baseApiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export function getAuthHeaders(): { Authorization: string } | {} {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
