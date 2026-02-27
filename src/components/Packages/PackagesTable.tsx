"use client";

import {
  Edit,
  Eye,
  Trash2,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface Package {
  id: string;
  name: string;
  yacht: string;
  duration: string;
  region: string;
  price: number;
  currency: string;
  status: "Active" | "Draft" | "Archived" | string;
}

interface PackagesTableProps {
  packages: Package[];
  onView: (pkg: Package) => void;
  onEdit: (pkg: Package) => void;
  onDelete: (pkg: Package) => void;
}

export function PackagesTable({
  packages,
  onView,
  onEdit,
  onDelete,
}: PackagesTableProps) {
  const { colors } = useTheme();

  return (
    <div
      className="rounded-xl p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
          All Packages
        </h3>
        <p className="text-xs md:text-sm" style={{ color: colors.textSecondary }}>
          {packages.length} total packages
        </p>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
              <th
                className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Package Name
              </th>
              <th
                className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Yacht
              </th>
              <th
                className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Duration
              </th>
              <th
                className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Region
              </th>
              <th
                className="text-right text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Price
              </th>
              <th
                className="text-center text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Status
              </th>
              <th
                className="text-center text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {packages.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  No packages match your filters.
                </td>
              </tr>
            ) : (
              packages.map((pkg) => (
                <tr
                  key={pkg.id}
                  className="transition-colors"
                  style={{ borderBottom: `1px solid ${colors.cardBorder}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td className="py-4 px-2">
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      {pkg.name}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      {pkg.yacht}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-sm font-mono" style={{ color: colors.textPrimary }}>
                      {pkg.duration}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      {pkg.region}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="text-sm font-mono font-bold" style={{ color: colors.textPrimary }}>
                      {pkg.currency} {pkg.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex justify-center">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
                        style={{
                          backgroundColor:
                            pkg.status === "Active"
                              ? `${colors.success}20`
                              : pkg.status === "Draft"
                                ? `${colors.warning}20`
                                : `${colors.textSecondary}20`,
                          color:
                            pkg.status === "Active"
                              ? colors.success
                              : pkg.status === "Draft"
                                ? colors.warning
                                : colors.textSecondary,
                        }}
                      >
                        {pkg.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onView(pkg)}
                        className="p-1.5 rounded-lg transition-all"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.textSecondary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${colors.accent}15`;
                          e.currentTarget.style.color = colors.accent;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.background;
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(pkg)}
                        className="p-1.5 rounded-lg transition-all"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.textSecondary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${colors.accent}15`;
                          e.currentTarget.style.color = colors.accent;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.background;
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(pkg)}
                        className="p-1.5 rounded-lg transition-all"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.textSecondary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${colors.danger}15`;
                          e.currentTarget.style.color = colors.danger;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.background;
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PackagesTable;
