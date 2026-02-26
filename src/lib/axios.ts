import axios, { type InternalAxiosRequestConfig } from "axios";
import { config } from "../../config";

/**
 * Axios instance with credentials so cookies are sent.
 * Auth uses cookies only (no Bearer from localStorage).
 */
export const apiClient = axios.create({
  baseURL: config.baseApiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/** Mark a request as already retried after refresh to avoid infinite loop */
const RETRIED_KEY = "_authRetried";

apiClient.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config as InternalAxiosRequestConfig & { [RETRIED_KEY]?: boolean };

    if (err.response?.status !== 401 || originalRequest[RETRIED_KEY]) {
      return Promise.reject(err);
    }

    originalRequest[RETRIED_KEY] = true;

    try {
      await apiClient.post(config.api.auth.refresh, {});
      return apiClient(originalRequest);
    } catch (refreshErr) {
      return Promise.reject(refreshErr);
    }
  }
);

export function getAuthHeaders(): { Authorization: string } | {} {
  return {};
}
