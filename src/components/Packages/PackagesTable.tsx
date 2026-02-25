"use client";

import {
  Edit,
  Copy,
  Trash2,
  User,
  Fuel,
  UtensilsCrossed,
  Car,
  Users as UsersIcon,
  Waves,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface Package {
  id: string;
  name: string;
  yacht: string;
  duration: string;
  region: string;
  services: string[];
  price: number;
  status: "Active" | "Draft" | string;
}

interface PackagesTableProps {
  packages: Package[];
  onEdit: (pkg: Package) => void;
  onClone: (pkg: Package) => void;
  onDelete: (pkg: Package) => void;
  onToggleStatus: (pkg: Package) => void;
}

function getServiceIcon(service: string) {
  switch (service.toLowerCase()) {
    case "skipper":
      return User;
    case "fuel":
      return Fuel;
    case "catering":
      return UtensilsCrossed;
    case "transfer":
      return Car;
    case "crew":
      return UsersIcon;
    case "snorkeling":
      return Waves;
    default:
      return User;
  }
}

export function PackagesTable({
  packages,
  onEdit,
  onClone,
  onDelete,
  onToggleStatus,
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
                className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Services
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
                  colSpan={9}
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
                  <td className="py-4 px-2">
                    <div className="flex gap-1.5">
                      {pkg.services.slice(0, 4).map((service, idx) => {
                        const Icon = getServiceIcon(service);
                        return (
                          <div
                            key={idx}
                            className="p-1.5 rounded-lg"
                            style={{ backgroundColor: `${colors.accent}15` }}
                            title={service}
                          >
                            <Icon className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                          </div>
                        );
                      })}
                      {pkg.services.length > 4 && (
                        <div
                          className="px-2 py-1 rounded-lg text-xs font-medium"
                          style={{
                            backgroundColor: `${colors.textSecondary}15`,
                            color: colors.textSecondary,
                          }}
                        >
                          +{pkg.services.length - 4}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="text-sm font-mono font-bold" style={{ color: colors.textPrimary }}>
                      ${pkg.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(pkg)}
                        className="relative w-12 h-6 rounded-full transition-all"
                        style={{
                          backgroundColor:
                            pkg.status === "Active" ? colors.accent : `${colors.textSecondary}30`,
                        }}
                        aria-label={pkg.status === "Active" ? "Deactivate" : "Activate"}
                      >
                        <div
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all"
                          style={{
                            left: pkg.status === "Active" ? "calc(100% - 20px)" : "4px",
                          }}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-center gap-2">
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
                        onClick={() => onClone(pkg)}
                        className="p-1.5 rounded-lg transition-all"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.textSecondary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${colors.accentGold}15`;
                          e.currentTarget.style.color = colors.accentGold;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.background;
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                        title="Clone"
                      >
                        <Copy className="w-4 h-4" />
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
