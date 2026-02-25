import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { config } from "../../../config";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface OtpData {
  otp: string;
  email: string;
}

export interface ResetPasswordData {
  email: string;
  newPassword: string;
}

async function signInApi(credentials: SignInCredentials) {
  const { data } = await axios.post(
    config.api.auth.login,
    credentials,
    { withCredentials: true }
  );
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  const token = data?.data?.token;
  if (token && typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
  return data;
}

async function forgotPasswordApi(body: ForgotPasswordData) {
  const { data } = await axios.post(
    config.api.auth.forgotPassword,
    body,
    { withCredentials: true }
  );
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

async function verifyOtpApi(body: OtpData) {
  const { data } = await axios.post(
    config.api.auth.verifyOtp,
    body,
    { withCredentials: true }
  );
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

async function resendOtpApi(body: { email: string }) {
  const { data } = await axios.post(
    config.api.auth.resendOtp,
    body,
    { withCredentials: true }
  );
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

async function resetPasswordApi(body: ResetPasswordData) {
  const { data } = await axios.post(
    config.api.auth.resetPassword,
    body,
    { withCredentials: true }
  );
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

/** Fetch current user from auth/me (uses cookie). */
async function fetchMeApi(): Promise<unknown> {
  const { data } = await axios.get(config.api.auth.me, {
    withCredentials: true,
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Unauthorized");
  }
  return data?.data ?? data;
}

/** Call backend logout to clear cookie. */
async function logoutApi(): Promise<void> {
  await axios.post(config.api.auth.logout, {}, { withCredentials: true });
}

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string }>;
  return (
    axiosError.response?.data?.message ||
    axiosError.message ||
    "Something went wrong"
  );
}

export function useSignInMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...authKeys.all, "signin"],
    mutationFn: signInApi,
    onSuccess: (data) => {
      const user = (data as { data?: unknown })?.data ?? data;
      queryClient.setQueryData(authKeys.user(), user);
    },
  });
}

export function useAuthUserQuery() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: fetchMeApi,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...authKeys.all, "logout"],
    mutationFn: async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      await logoutApi();
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationKey: [...authKeys.all, "forgotPassword"],
    mutationFn: forgotPasswordApi,
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationKey: [...authKeys.all, "verifyOtp"],
    mutationFn: verifyOtpApi,
  });
}

export function useResendOtpMutation() {
  return useMutation({
    mutationKey: [...authKeys.all, "resendOtp"],
    mutationFn: resendOtpApi,
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationKey: [...authKeys.all, "resetPassword"],
    mutationFn: resetPasswordApi,
  });
}

export { getErrorMessage as getAuthErrorMessage };
