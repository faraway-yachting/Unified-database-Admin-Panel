"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
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

interface Props {
  children: ReactNode;
}

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/yachts": "Fleet Management",
  "/tags": "Tags",
  "/blog": "Blog",
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
  if (pathname.startsWith("/tags/")) return "Tags";
  if (pathname.startsWith("/blog/")) return "Blog";
  return "Dashboard";
}

const IndexLayout: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();
  const { data: user, isLoading } = useAuthUserQuery();
  const isAuthenticated = !!user;

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return null;
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
      <main className="flex-1">{children}</main>
    </>
  );

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <Sidebar
        navItems={dashboardNavItems}
        adminName="Sarah Mitchell"
        adminRole="Fleet Manager"
        adminAvatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
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
