import axios, { type InternalAxiosRequestConfig } from "axios";
import { config } from "../../config";

export const apiClient = axios.create({
  baseURL: config.baseApiUrl,
  withCredentials: true,
});

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

export function getAuthHeaders(): { Authorization?: string } {
  return {};
}
