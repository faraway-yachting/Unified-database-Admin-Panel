"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthUserQuery } from "@/lib/api/auth";

/**
 * Root page: redirects to /dashboard when authenticated, otherwise to /login.
 */
export default function HomePage() {
  const router = useRouter();
  const { data: user, isLoading } = useAuthUserQuery();
  console.log("user", user);

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  return null;
}
