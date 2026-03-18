import axios, { type InternalAxiosRequestConfig } from "axios";
import { config } from "../../config";

const uploadBaseUrl =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_UPLOAD_API_URL?.trim()) || "";

/**
 * Axios instance with credentials so cookies are sent.
 * Auth uses cookies only (no Bearer from localStorage).
 */
export const apiClient = axios.create({
  baseURL: config.baseApiUrl,
  withCredentials: true,
});

export const uploadClient = axios.create({
  baseURL: uploadBaseUrl || config.baseApiUrl,
  withCredentials: true,
});

/** Mark a request as already retried after refresh to avoid infinite loop */
const RETRIED_KEY = "_authRetried";

function add401Retry(client: typeof apiClient) {
  client.interceptors.response.use(
    (response) => response,
    async (err) => {
      const originalRequest = err.config as InternalAxiosRequestConfig & { [RETRIED_KEY]?: boolean };
      if (err.response?.status !== 401 || originalRequest[RETRIED_KEY]) {
        return Promise.reject(err);
      }
      originalRequest[RETRIED_KEY] = true;
      try {
        await apiClient.post(config.api.auth.refresh, {});
        return client(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }
  );
}

add401Retry(apiClient);
add401Retry(uploadClient);

export function getAuthHeaders(): { Authorization?: string } {
  return {};
}
