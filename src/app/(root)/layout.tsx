"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar, { HEADER_HEIGHT } from "@/components/TopBar";
import { FleetTopBarActionsProvider } from "@/context/FleetTopBarActionsContext";
import { PackageBuilderProvider } from "@/context/PackageBuilderContext";
import { BookingsProvider } from "@/context/BookingsContext";
import FleetTopBarActions from "@/components/Fleet/FleetTopBarActions";
import PackageTopBarActions from "@/components/Packages/PackageTopBarActions";
import BookingsTopBarActions from "@/components/Bookings/BookingsTopBarActions";
import PricingTopBarActions from "@/components/Pricing/PricingTopBarActions";
import CRMTopBarActions from "@/components/CRM/CRMTopBarActions";
import RegionsTopBarActions from "@/components/Region/RegionsTopBarActions";
import SettingsTopBarActions from "@/components/Settings/SettingsTopBarActions";
import { PricingProvider } from "@/context/PricingContext";
import { CRMProvider } from "@/context/CRMContext";
import { dashboardNavItems } from "@/data/Sidebar/dashboardNav";
import { useTheme } from "@/context/ThemeContext";
import { useAuthUserQuery } from "@/lib/api/auth";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface Props {
  children: ReactNode;
}

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/yachts": "Fleet Management",
  "/settings": "Settings",
  "/packages": "Package Builder",
  "/bookings": "Bookings",
  "/pricing": "Pricing & Revenue",
  "/crm": "CRM",
  "/regions": "Region & Site Management",
};

function getTitle(pathname: string): string {
  if (routeTitles[pathname]) return routeTitles[pathname];
  if (pathname.startsWith("/yachts/")) return "Fleet";
  return "Dashboard";
}

/** e.g. "super_admin" -> "Super Admin" */
function formatRole(role: string): string {
  if (!role) return "User";
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const IndexLayout: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();
  const { data: user, isLoading, isError, error, isSuccess } = useAuthUserQuery();
  const isAuthenticated = !!user;

  // Only redirect when we know the user is unauthenticated: initial load success with no user, or 401.
  // Do not redirect on network/transient errors to avoid kicking the user out.
  const shouldRedirectToLogin =
    !isLoading &&
    !user &&
    (isSuccess || (isError && (error as { response?: { status?: number } })?.response?.status === 401));

  useEffect(() => {
    if (shouldRedirectToLogin) {
      router.replace("/login");
    }
  }, [shouldRedirectToLogin, router]);

  if (isLoading) {
    return <LoadingSpinner variant="fullScreen" size="lg" text="Loading..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const isYachts = pathname === "/yachts";
  const isPackages = pathname === "/packages";
  const isBookings = pathname === "/bookings";
  const isPricing = pathname === "/pricing";
  const isCRM = pathname === "/crm";
  const isRegions = pathname === "/regions";
  const isSettings = pathname === "/settings";

  const renderMain = () => (
    <>
      <TopBar
        title={getTitle(pathname ?? "")}
        actions={
          isYachts ? (
            <FleetTopBarActions />
          ) : isPackages ? (
            <PackageTopBarActions />
          ) : isBookings ? (
            <BookingsTopBarActions />
          ) : isPricing ? (
            <PricingTopBarActions />
          ) : isCRM ? (
            <CRMTopBarActions />
          ) : isRegions ? (
            <RegionsTopBarActions />
          ) : isSettings ? (
            <SettingsTopBarActions />
          ) : pathname === "/dashboard" ? (
            <span className="text-sm" style={{ color: colors.textSecondary }}>
              Last updated: 2 minutes ago
            </span>
          ) : undefined
        }
      />
      <main
        className="flex-1 flex flex-col"
        style={{ paddingTop: HEADER_HEIGHT }}
      >
        {children}
      </main>
    </>
  );

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <Sidebar
        navItems={dashboardNavItems}
        adminName={[user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email ?? ""}
        adminRole={formatRole(user?.role ?? "")}
        adminAvatar={user?.avatarUrl}
      />
      <div className="lg:ml-[240px] flex-1 flex flex-col min-h-screen">
        {isYachts ? (
          <FleetTopBarActionsProvider>{renderMain()}</FleetTopBarActionsProvider>
        ) : isPackages ? (
          <PackageBuilderProvider>{renderMain()}</PackageBuilderProvider>
        ) : isBookings ? (
          <BookingsProvider>{renderMain()}</BookingsProvider>
        ) : isPricing ? (
          <PricingProvider>{renderMain()}</PricingProvider>
        ) : isCRM ? (
          <CRMProvider>{renderMain()}</CRMProvider>
        ) : (
          renderMain()
        )}
      </div>
    </div>
  );
};

export default IndexLayout;
