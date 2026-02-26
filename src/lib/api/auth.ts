import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { config } from "../../../config";
import { apiClient } from "@/lib/axios";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export interface SignInCredentials {
  email: string;
  password: string;
}

/** User object returned from auth/me (and sign-in). */
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  regionAccess?: unknown[];
  avatarUrl?: string;
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
  const { data } = await apiClient.post(config.api.auth.login, credentials);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  // Tokens are stored in httpOnly cookies by the backend; no localStorage.
  return data;
}

async function forgotPasswordApi(body: ForgotPasswordData) {
  const { data } = await apiClient.post(config.api.auth.forgotPassword, body);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

async function verifyOtpApi(body: OtpData) {
  const { data } = await apiClient.post(config.api.auth.verifyOtp, body);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

async function resendOtpApi(body: { email: string }) {
  const { data } = await apiClient.post(config.api.auth.resendOtp, body);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

async function resetPasswordApi(body: ResetPasswordData) {
  const { data } = await apiClient.post(config.api.auth.resetPassword, body);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

/** Fetch current user from auth/me (uses auth cookie via apiClient). */
async function fetchMeApi(): Promise<AuthUser> {
  const { data } = await apiClient.get(config.api.auth.me);
  if (data?.error) {
    throw new Error(data?.error?.message || "Unauthorized");
  }
  const raw = data?.data ?? data;
  return raw as AuthUser;
}

/** Call backend logout to clear auth cookie. */
async function logoutApi(): Promise<void> {
  await apiClient.post(config.api.auth.logout, {});
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
      const user = (data as { user?: AuthUser })?.user ?? (data as AuthUser);
      if (user) queryClient.setQueryData(authKeys.user(), user);
    },
  });
}

export function useAuthUserQuery() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: fetchMeApi,
    retry: false,
    staleTime: 8 * 60 * 60 * 1000, // 8 hours to match backend token expiry
    refetchOnWindowFocus: false, // avoid redirect on transient refetch failures
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...authKeys.all, "logout"],
    mutationFn: async () => {
      await logoutApi();
      // Backend clears auth cookie; no localStorage to clear.
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
