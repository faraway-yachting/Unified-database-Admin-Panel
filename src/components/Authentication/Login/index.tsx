"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Anchor } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@/context/ThemeContext";
import { useSignInMutation, getAuthErrorMessage } from "@/lib/api/auth";

export default function Login() {
  const { colors } = useTheme();
  const router = useRouter();
  const signInMutation = useSignInMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isSubmitting = signInMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInMutation.mutateAsync({ email, password });
      const message = (result as { message?: string })?.message;
      toast.success(message ?? "Signed in successfully");
      router.push("/dashboard");
    } catch (err) {
      const errorMessage =
        err != null ? getAuthErrorMessage(err) : "Something went wrong.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex"
        style={{ backgroundColor: colors.background }}
      >
        {/* Left Decorative Panel - Desktop Only */}
        <div
          className="hidden lg:flex lg:w-[55%] relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #0B1120 0%, #0a1929 50%, #051222 100%)`,
          }}
        >
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <defs>
                <pattern
                  id="anchor-pattern"
                  x="0"
                  y="0"
                  width="200"
                  height="200"
                  patternUnits="userSpaceOnUse"
                >
                  <g transform="translate(100, 100)">
                    <circle cx="0" cy="-30" r="8" fill="currentColor" />
                    <rect x="-3" y="-25" width="6" height="50" fill="currentColor" />
                    <path
                      d="M -20 20 Q -15 15, -5 20 L -5 30 Q -15 25, -20 30 Z"
                      fill="currentColor"
                    />
                    <path
                      d="M 20 20 Q 15 15, 5 20 L 5 30 Q 15 25, 20 30 Z"
                      fill="currentColor"
                    />
                    <rect
                      x="-25"
                      y="-35"
                      width="50"
                      height="6"
                      rx="3"
                      fill="currentColor"
                    />
                  </g>
                  <path
                    d="M 0 150 Q 50 140, 100 150 T 200 150"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 0 170 Q 50 160, 100 170 T 200 170"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="url(#anchor-pattern)"
                style={{ color: colors.accent }}
              />
            </svg>
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex flex-col items-center justify-between py-12 px-16 w-full">
            {/* Logo and Headline */}
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg">
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-2">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent}, #00B39F)`,
                      boxShadow: `0 20px 40px -10px ${colors.accent}40`,
                    }}
                  >
                    <Anchor className="w-9 h-9 text-white" />
                  </div>
                  <h1 className="text-5xl font-bold text-white tracking-tight">
                    YachtOS
                  </h1>
                </div>
              </div>

              <h2
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                style={{ color: colors.textPrimary }}
              >
                Manage Your Fleet.
                <br />
                <span style={{ color: colors.accent }}>Anywhere.</span>
              </h2>

              <p
                className="text-lg leading-relaxed"
                style={{ color: colors.textSecondary }}
              >
                Enterprise-grade yacht charter management platform built for
                scale. Monitor bookings, optimize pricing, and delight customers
                across all regions.
              </p>
            </div>

            {/* Stats Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { label: "28 Tables", icon: "📊" },
                { label: "8 Modules", icon: "⚡" },
                { label: "Multi-Region", icon: "🌍" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="px-6 py-3 rounded-full backdrop-blur-sm border"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    borderColor: "rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg" aria-hidden>
                      {stat.icon}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-[45%] flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo - Only visible on tablet/mobile */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}, #00B39F)`,
                  boxShadow: `0 10px 25px -5px ${colors.accent}40`,
                }}
              >
                <Anchor className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">YachtOS</h1>
            </div>

            {/* Login Card */}
            <div
              className="rounded-2xl border backdrop-blur-sm p-6 md:p-12"
              style={{
                backgroundColor: "rgba(17, 24, 39, 0.8)",
                borderColor: "rgba(255, 255, 255, 0.06)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Header */}
              <div className="mb-8">
                <div
                  className="text-xs font-mono font-semibold tracking-wider mb-3"
                  style={{ color: colors.accent }}
                >
                  ADMIN PORTAL
                </div>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Welcome Back
                </h2>
                <p
                  className="text-sm md:text-base"
                  style={{ color: colors.textSecondary }}
                >
                  Sign in to your YachtOS dashboard
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                      style={{ color: colors.textSecondary }}
                      aria-hidden
                    />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@yachtos.com"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: "#1e2d40",
                        color: colors.textPrimary,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.accent;
                        e.target.style.boxShadow = `0 0 0 3px ${colors.accent}20`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#1e2d40";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                      style={{ color: colors.textSecondary }}
                      aria-hidden
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      required
                      className="w-full pl-12 pr-12 py-4 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: "#1e2d40",
                        color: colors.textPrimary,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.accent;
                        e.target.style.boxShadow = `0 0 0 3px ${colors.accent}20`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#1e2d40";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 transition-all hover:scale-110 focus:outline-none"
                      style={{ color: colors.textSecondary }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    href="/forgotPassword"
                    className="text-sm font-medium transition-all hover:underline"
                    style={{ color: colors.accent }}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    backgroundColor: colors.accent,
                    color: "#0B1120",
                    height: "52px",
                    boxShadow: `0 10px 25px -5px ${colors.accent}40`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting)
                      e.currentTarget.style.boxShadow = `0 20px 35px -5px ${colors.accent}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 10px 25px -5px ${colors.accent}40`;
                  }}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>

                {/* Divider */}
                <div className="relative py-4">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden
                  >
                    <div
                      className="w-full border-t"
                      style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
                    />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span
                      className="px-4"
                      style={{
                        backgroundColor: "rgba(17, 24, 39, 0.8)",
                        color: colors.textSecondary,
                      }}
                    >
                      or
                    </span>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="text-center">
                  <p
                    className="text-xs md:text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    Don&apos;t have access?{" "}
                    <Link
                      href="/contact"
                      className="font-medium transition-all hover:underline"
                      style={{ color: colors.textPrimary }}
                    >
                      Contact your administrator.
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Mobile Stats - Only visible on tablet/mobile */}
            <div className="lg:hidden flex flex-wrap items-center justify-center gap-3 mt-8">
              {[
                { label: "28 Tables", icon: "📊" },
                { label: "8 Modules", icon: "⚡" },
                { label: "Multi-Region", icon: "🌍" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 rounded-full backdrop-blur-sm border"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    borderColor: "rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base" aria-hidden>
                      {stat.icon}
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
