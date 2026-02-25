"use client";

import { Eye, Edit, XCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface Booking {
  id: string;
  customer: string;
  yacht: string;
  package: string;
  region: string;
  checkIn: string;
  checkOut: string;
  extras: string;
  totalAmount: number;
  status: "confirmed" | "inquiry" | "paid" | "completed" | "cancelled";
}

interface BookingsTableProps {
  bookings: Booking[];
  onView: (booking: Booking) => void;
  onEdit: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
}

export function BookingsTable({
  bookings,
  onView,
  onEdit,
  onCancel,
}: BookingsTableProps) {
  const { colors } = useTheme();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "confirmed":
        return { bgColor: `${colors.accent}15`, textColor: colors.accent };
      case "inquiry":
        return { bgColor: `${colors.accentGold}15`, textColor: colors.accentGold };
      case "paid":
        return { bgColor: `${colors.success}15`, textColor: colors.success };
      case "completed":
        return {
          bgColor: `${colors.textSecondary}15`,
          textColor: colors.textSecondary,
        };
      case "cancelled":
        return { bgColor: `${colors.danger}15`, textColor: colors.danger };
      default:
        return {
          bgColor: `${colors.textSecondary}15`,
          textColor: colors.textSecondary,
        };
    }
  };

  return (
    <div
      className="rounded-xl p-4 md:p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div className="mb-4 md:mb-6">
        <h3
          className="text-base md:text-lg font-bold mb-1"
          style={{ color: colors.textPrimary }}
        >
          All Bookings
        </h3>
        <p
          className="text-xs md:text-sm"
          style={{ color: colors.textSecondary }}
        >
          {bookings.length} total bookings
        </p>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                  <th
                    className="text-left text-xs font-semibold uppercase tracking-wide pb-3 md:pb-4 px-2 whitespace-nowrap"
                    style={{ color: colors.textSecondary }}
                  >
                    Booking ID
                  </th>
                  <th
                    className="text-left text-xs font-semibold uppercase tracking-wide pb-3 md:pb-4 px-2 whitespace-nowrap"
                    style={{ color: colors.textSecondary }}
                  >
                    Customer
                  </th>
                  <th
                    className="text-left text-xs font-semibold uppercase tracking-wide pb-3 md:pb-4 px-2 whitespace-nowrap"
                    style={{ color: colors.textSecondary }}
                  >
                    Yacht
                  </th>
                  <th
                    className="text-left text-xs font-semibold uppercase tracking-wide pb-3 md:pb-4 px-2 whitespace-nowrap"
                    style={{ color: colors.textSecondary }}
                  >
                    Package
                  </th>
                  <th
                    className="text-left text-xs font-semibold uppercase tracking-wide pb-3 md:pb-4 px-2 whitespace-nowrap"
                    style={{ color: colors.textSecondary }}
                  >
                    Region
                  </th>
                  <th
                    className="text-left text-xs font-semibold uppercase tracking-wide pb-3 md:pb-4 px-2 whitespace-nowrap"
                    style={{ color: colors.textSecondary }}
                  >
                    Check-in
                  </th>
                  <th
                    className="text-left text-xs font-semibold uppercase tracking-wide pb-3 md:pb-4 px-2 whitespace-nowrap"
                    style={{ color: colors.textSecondary }}
                  >
                    Check-out
                  </th>
                  <th
                    className="text-left text-xs font-semibold uppercase tracking-wide pb-3 md:pb-4 px-2 whitespace-nowrap"
                    style={{ color: colors.textSecondary }}
                  >
                    Extras
                  </th>
                  <th
                    className="text-right text-xs font-semibold uppercase tracking-wide pb-3 md:pb-4 px-2 whitespace-nowrap"
                    style={{ color: colors.textSecondary }}
                  >
                    Total
                  </th>
                  <th
                    className="text-center text-xs font-semibold uppercase tracking-wide pb-3 md:pb-4 px-2 whitespace-nowrap"
                    style={{ color: colors.textSecondary }}
                  >
                    Status
                  </th>
                  <th
                    className="text-center text-xs font-semibold uppercase tracking-wide pb-3 md:pb-4 px-2 whitespace-nowrap"
                    style={{ color: colors.textSecondary }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const statusConfig = getStatusConfig(booking.status);
                  const isCancelled = booking.status === "cancelled";

                  return (
                    <tr
                      key={booking.id}
                      className="transition-colors"
                      style={{
                        borderBottom: `1px solid ${colors.cardBorder}`,
                        opacity: isCancelled ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.hoverBg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <td className="py-3 md:py-4 px-2">
                        <div
                          className="text-xs md:text-sm font-mono font-medium whitespace-nowrap"
                          style={{
                            color: colors.accent,
                            textDecoration: isCancelled ? "line-through" : "none",
                          }}
                        >
                          {booking.id}
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-2">
                        <div
                          className="text-xs md:text-sm font-medium whitespace-nowrap"
                          style={{
                            color: colors.textPrimary,
                            textDecoration: isCancelled ? "line-through" : "none",
                          }}
                        >
                          {booking.customer}
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-2">
                        <div
                          className="text-xs md:text-sm whitespace-nowrap"
                          style={{
                            color: colors.textSecondary,
                            textDecoration: isCancelled ? "line-through" : "none",
                          }}
                        >
                          {booking.yacht}
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-2">
                        <div
                          className="text-xs md:text-sm whitespace-nowrap"
                          style={{ color: colors.textSecondary }}
                        >
                          {booking.package}
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-2">
                        <div
                          className="text-xs md:text-sm whitespace-nowrap"
                          style={{ color: colors.textSecondary }}
                        >
                          {booking.region}
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-2">
                        <div
                          className="text-xs md:text-sm font-mono whitespace-nowrap"
                          style={{ color: colors.textPrimary }}
                        >
                          {booking.checkIn}
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-2">
                        <div
                          className="text-xs md:text-sm font-mono whitespace-nowrap"
                          style={{ color: colors.textPrimary }}
                        >
                          {booking.checkOut}
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-2">
                        <div
                          className="text-xs md:text-sm whitespace-nowrap"
                          style={{ color: colors.textSecondary }}
                        >
                          {booking.extras}
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-2 text-right">
                        <div
                          className="text-xs md:text-sm font-mono font-bold whitespace-nowrap"
                          style={{
                            color: colors.textPrimary,
                            textDecoration: isCancelled ? "line-through" : "none",
                          }}
                        >
                          ${booking.totalAmount.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-2">
                        <div className="flex justify-center">
                          <div
                            className="px-2 md:px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap"
                            style={{
                              backgroundColor: statusConfig.bgColor,
                              color: statusConfig.textColor,
                            }}
                          >
                            {booking.status}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-2">
                        <div className="flex items-center justify-center gap-1 md:gap-2">
                          <button
                            type="button"
                            onClick={() => onView(booking)}
                            className="p-1 md:p-1.5 rounded-lg transition-all"
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
                            <Eye className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                          {!isCancelled && (
                            <>
                              <button
                                type="button"
                                onClick={() => onEdit(booking)}
                                className="p-1 md:p-1.5 rounded-lg transition-all"
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
                                title="Edit"
                              >
                                <Edit className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onCancel(booking)}
                                className="p-1 md:p-1.5 rounded-lg transition-all"
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
                                title="Cancel"
                              >
                                <XCircle className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingsTable;
