"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuditLogsQuery } from "@/lib/api/auditLogs";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const PAGE_SIZE = 20;

const actionColors: Record<string, string> = {
  created: "#10B981",
  Created: "#10B981",
  updated: "#F4A924",
  Updated: "#F4A924",
  deleted: "#EF4444",
  Deleted: "#EF4444",
  login: "#6B7280",
  Login: "#6B7280",
  logout: "#6B7280",
  Logout: "#6B7280",
};

const ACTION_OPTIONS = [
  { value: "", label: "All actions" },
  { value: "created", label: "Created" },
  { value: "updated", label: "Updated" },
  { value: "deleted", label: "Deleted" },
  { value: "login", label: "Login" },
  { value: "logout", label: "Logout" },
];

const MODULE_OPTIONS = [
  { value: "", label: "All modules" },
  { value: "auth", label: "Auth" },
  { value: "bookings", label: "Bookings" },
  { value: "yachts", label: "Yachts" },
  { value: "packages", label: "Packages" },
  { value: "regions", label: "Regions" },
  { value: "settings", label: "Settings" },
  { value: "crm", label: "CRM" },
  { value: "charter-companies", label: "Charter Companies" },
];

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatAction(action: string): string {
  return action.charAt(0).toUpperCase() + action.slice(1);
}

function getActionColor(action: string): string {
  return actionColors[action] ?? actionColors[action.toLowerCase()] ?? "#6B7280";
}

export function AuditLog() {
  const { colors } = useTheme();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");

  const filters = useMemo(() => {
    const f: { action?: string; module?: string } = {};
    if (actionFilter) f.action = actionFilter;
    if (moduleFilter) f.module = moduleFilter;
    return f;
  }, [actionFilter, moduleFilter]);

  const { data, isLoading, isError, error } = useAuditLogsQuery(
    page,
    PAGE_SIZE,
    Object.keys(filters).length ? filters : undefined
  );

  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const filteredLogs = useMemo(() => {
    const auditLogs = data?.auditLogs ?? [];
    if (!search.trim()) return auditLogs;
    const term = search.trim().toLowerCase();
    return auditLogs.filter((log) => {
      const userStr = log.adminUser
        ? `${log.adminUser.firstName} ${log.adminUser.lastName} ${log.adminUser.email}`.toLowerCase()
        : "";
      const desc = (log.description ?? "").toLowerCase();
      return userStr.includes(term) || desc.includes(term);
    });
  }, [data?.auditLogs, search]);

  const handleFilterChange = () => {
    setPage(1);
  };

  const startItem = (page - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(page * PAGE_SIZE, total);

  if (isLoading && !data) {
    return (
      <div
        className="rounded-lg border p-4 md:p-6 min-h-[300px] flex items-center justify-center"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
        }}
      >
        <LoadingSpinner size="lg" text="Loading audit logs..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="rounded-lg border p-4 md:p-6"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
        }}
      >
        <div
          className="text-center py-8"
          style={{ color: colors.danger }}
        >
          {error instanceof Error ? error.message : "Failed to load audit logs"}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border p-4 md:p-6"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2
          className="text-xl md:text-2xl font-bold"
          style={{ color: colors.textPrimary }}
        >
          Audit Log
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: colors.textSecondary }}
            />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border text-sm w-full sm:w-64 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary,
              }}
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              handleFilterChange();
            }}
            className="px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary,
            }}
          >
            {ACTION_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value);
              handleFilterChange();
            }}
            className="px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary,
            }}
          >
            {MODULE_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className="border-b text-left"
              style={{ borderColor: colors.cardBorder }}
            >
              <th
                className="pb-3 text-xs font-semibold"
                style={{ color: colors.textSecondary }}
              >
                Timestamp
              </th>
              <th
                className="pb-3 text-xs font-semibold"
                style={{ color: colors.textSecondary }}
              >
                User
              </th>
              <th
                className="pb-3 text-xs font-semibold"
                style={{ color: colors.textSecondary }}
              >
                Action
              </th>
              <th
                className="pb-3 text-xs font-semibold"
                style={{ color: colors.textSecondary }}
              >
                Module
              </th>
              <th
                className="pb-3 text-xs font-semibold"
                style={{ color: colors.textSecondary }}
              >
                Description
              </th>
              <th
                className="pb-3 text-xs font-semibold"
                style={{ color: colors.textSecondary }}
              >
                IP Address
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  No audit logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const user = log.adminUser
                  ? `${log.adminUser.firstName} ${log.adminUser.lastName}`.trim() || log.adminUser.email
                  : "—";
                const actionLabel = formatAction(log.action);
                const actionColor = getActionColor(log.action);

                return (
                  <tr
                    key={log.id}
                    className="border-b"
                    style={{ borderColor: colors.cardBorder }}
                  >
                    <td
                      className="py-3 text-sm font-mono"
                      style={{ color: colors.textSecondary }}
                    >
                      {formatTimestamp(log.createdAt)}
                    </td>
                    <td
                      className="py-3 text-sm font-medium"
                      style={{ color: colors.textPrimary }}
                    >
                      {user}
                    </td>
                    <td className="py-3">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: `${actionColor}20`,
                          color: actionColor,
                        }}
                      >
                        {actionLabel}
                      </span>
                    </td>
                    <td
                      className="py-3 text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {log.module}
                    </td>
                    <td
                      className="py-3 text-sm"
                      style={{ color: colors.textPrimary }}
                    >
                      {log.description ?? "—"}
                    </td>
                    <td
                      className="py-3 text-sm font-mono"
                      style={{ color: colors.textSecondary }}
                    >
                      {log.ipAddress ?? "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-3">
        {filteredLogs.length === 0 ? (
          <div
            className="py-8 text-center text-sm"
            style={{ color: colors.textSecondary }}
          >
            No audit logs found
          </div>
        ) : (
          filteredLogs.map((log) => {
            const user = log.adminUser
              ? `${log.adminUser.firstName} ${log.adminUser.lastName}`.trim() || log.adminUser.email
              : "—";
            const actionLabel = formatAction(log.action);
            const actionColor = getActionColor(log.action);

            return (
              <div
                key={log.id}
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.cardBorder,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: `${actionColor}20`,
                      color: actionColor,
                    }}
                  >
                    {actionLabel}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    {log.module}
                  </span>
                </div>

                <div
                  className="text-sm mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  {log.description ?? "—"}
                </div>

                <div
                  className="flex flex-wrap gap-x-4 gap-y-1 text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  <div>
                    <span className="font-medium">User:</span> {user}
                  </div>
                  <div>
                    <span className="font-medium">IP:</span>{" "}
                    <span className="font-mono">{log.ipAddress ?? "—"}</span>
                  </div>
                  <div className="w-full">
                    <span className="font-mono">
                      {formatTimestamp(log.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div
        className="flex items-center justify-between mt-6 pt-6 border-t"
        style={{ borderColor: colors.cardBorder }}
      >
        <div
          className="text-sm"
          style={{ color: colors.textSecondary }}
        >
          {total === 0
            ? "No entries"
            : `Showing ${startItem}-${endItem} of ${total} entries`}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-lg border text-sm transition-all hover:scale-105 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              borderColor: colors.cardBorder,
              color: colors.textPrimary,
              backgroundColor: colors.background,
            }}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= totalPages || totalPages === 0}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-lg text-sm text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              backgroundColor: colors.accent,
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuditLog;
