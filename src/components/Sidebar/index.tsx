"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useLogoutMutation } from "@/lib/api/auth";
import { Anchor, Menu, X } from "lucide-react";

export interface NavItem {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  active?: boolean;
  href: string;
  isLogout?: boolean;
}

interface SidebarNavItemProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  active: boolean;
  href: string;
  onClick?: () => void;
}

function SidebarNavItem({
  icon: Icon,
  label,
  active,
  href,
  onClick,
}: SidebarNavItemProps) {
  const { colors } = useTheme();

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all group"
      style={{
        backgroundColor: active ? `${colors.accent}15` : "transparent",
        color: active ? colors.accent : colors.textSecondary,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = colors.hoverBg;
          e.currentTarget.style.color = colors.textPrimary;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = colors.textSecondary;
        }
      }}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

interface SidebarProps {
  navItems: NavItem[];
  adminName: string;
  adminRole: string;
  adminAvatar?: string | null;
}

export function Sidebar({
  navItems,
  adminName,
  adminRole,
  adminAvatar,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { colors } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logoutMutation = useLogoutMutation();

  const safeAdminName = (adminName ?? "").trim() || "User";
  const safeAdminRole = adminRole ?? "User";

  const initials = safeAdminName
    .split(/\s+/)
    .filter(Boolean)
    .map((s) => s.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        router.push("/login");
        setIsMobileMenuOpen(false);
      },
    });
  };

  const regularItems = navItems.filter((item) => !item.isLogout);
  const logoutItem = navItems.find((item) => item.isLogout);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg"
        style={{
          backgroundColor: colors.cardBg,
          color: colors.textPrimary,
          border: `1px solid ${colors.cardBorder}`,
        }}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          aria-hidden
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-[240px] border-r flex flex-col z-40 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
        }}
      >
        {/* Logo */}
        <div
          className="h-[72px] flex items-center px-6 border-b shrink-0"
          style={{ borderColor: colors.cardBorder }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: `linear-gradient(to bottom right, ${colors.accent}, #00B39F)`,
              }}
            >
              <Anchor className="w-5 h-5 text-white" />
            </div>
            <div>
              <div
                className="font-bold text-sm"
                style={{ color: colors.textPrimary }}
              >
                YachtOS
              </div>
              <div
                className="text-xs font-mono"
                style={{ color: colors.accent }}
              >
                ADMIN
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {regularItems.map((item) => {
            const isActive =
              item.href === "/login"
                ? pathname === "/login"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <SidebarNavItem
                key={item.href + item.label}
                icon={item.icon}
                label={item.label}
                active={isActive}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            );
          })}
        </nav>

        {/* Logout */}
        {logoutItem && (
          <div
            className="px-3 pb-2 border-t"
            style={{ borderColor: colors.cardBorder }}
          >
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-all"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.hoverBg;
                e.currentTarget.style.color = colors.textPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              {(() => {
                const Icon = logoutItem.icon;
                return <Icon className="w-5 h-5 shrink-0" />;
              })()}
              <span className="text-sm font-medium">{logoutItem.label}</span>
            </button>
          </div>
        )}

        {/* Admin Profile */}
        <div
          className="p-4 border-t"
          style={{ borderColor: colors.cardBorder }}
        >
          <div
            className="flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer"
            style={{ backgroundColor: colors.cardBorder }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.hoverBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.cardBorder;
            }}
          >
            {adminAvatar ? (
              <Image
                src={adminAvatar}
                alt={safeAdminName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 shrink-0 object-cover"
                style={{ borderColor: colors.accent }}
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full border-2 shrink-0 flex items-center justify-center text-sm font-semibold"
                style={{
                  borderColor: colors.accent,
                  backgroundColor: `${colors.accent}20`,
                  color: colors.accent,
                }}
              >
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div
                className="text-sm font-medium truncate"
                style={{ color: colors.textPrimary }}
              >
                {safeAdminName}
              </div>
              <div
                className="text-xs"
                style={{ color: colors.textSecondary }}
              >
                {safeAdminRole}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
