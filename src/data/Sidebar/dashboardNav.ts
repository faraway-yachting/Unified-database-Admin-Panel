import {
  LayoutDashboard,
  Ship,
  Package,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Settings,
  LogOut,
  BookOpen,
} from "lucide-react";
import type { NavItem } from "@/components/Sidebar";

export const dashboardNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Ship, label: "Fleet", href: "/yachts" },
  { icon: BookOpen, label: "Blog", href: "/blog" },
  { icon: MapPin, label: "Regions", href: "/regions" },
  { icon: Package, label: "Packages", href: "/packages" },
  { icon: Calendar, label: "Bookings", href: "/bookings" },
  { icon: DollarSign, label: "Pricing", href: "/pricing" },
  { icon: Users, label: "CRM", href: "/crm" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: LogOut, label: "Logout", href: "/login", isLogout: true },
];
