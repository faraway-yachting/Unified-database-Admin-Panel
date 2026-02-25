"use client";

import Image from "next/image";
import { Eye, Mail, Tag } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  email: string;
  region: string;
  totalBookings: number;
  totalSpent: number;
  segment: "VIP" | "Regular" | "New";
  lastContact: string;
}

interface CustomerTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onMessage: (customer: Customer) => void;
  onTag: (customer: Customer) => void;
}

export function CustomerTable({
  customers,
  onView,
  onMessage,
  onTag,
}: CustomerTableProps) {
  const { colors } = useTheme();

  const getSegmentConfig = (segment: string) => {
    switch (segment) {
      case "VIP":
        return { bgColor: `${colors.accentGold}15`, textColor: colors.accentGold };
      case "Regular":
        return { bgColor: `${colors.accent}15`, textColor: colors.accent };
      case "New":
        return { bgColor: `${colors.success}15`, textColor: colors.success };
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
          Customer Directory
        </h3>
        <p
          className="text-xs md:text-sm"
          style={{ color: colors.textSecondary }}
        >
          {customers.length} total customers
        </p>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
              <th
                className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Customer
              </th>
              <th
                className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Email
              </th>
              <th
                className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Region
              </th>
              <th
                className="text-center text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Bookings
              </th>
              <th
                className="text-right text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Total Spent
              </th>
              <th
                className="text-center text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Segment
              </th>
              <th
                className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Last Contact
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
            {customers.map((customer) => {
              const segmentConfig = getSegmentConfig(customer.segment);

              return (
                <tr
                  key={customer.id}
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
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={customer.avatar}
                          alt={customer.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div
                        className="text-sm font-semibold"
                        style={{ color: colors.textPrimary }}
                      >
                        {customer.name}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {customer.email}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {customer.region}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div
                      className="text-sm font-mono font-bold"
                      style={{ color: colors.textPrimary }}
                    >
                      {customer.totalBookings}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div
                      className="text-sm font-mono font-bold"
                      style={{ color: colors.textPrimary }}
                    >
                      ${customer.totalSpent.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex justify-center">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: segmentConfig.bgColor,
                          color: segmentConfig.textColor,
                        }}
                      >
                        {customer.segment}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div
                      className="text-sm font-mono"
                      style={{ color: colors.textPrimary }}
                    >
                      {customer.lastContact}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onView(customer)}
                        className="p-2 rounded-lg transition-all"
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
                        onClick={() => onMessage(customer)}
                        className="p-2 rounded-lg transition-all"
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
                        title="Message"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onTag(customer)}
                        className="p-2 rounded-lg transition-all"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.textSecondary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${colors.success}15`;
                          e.currentTarget.style.color = colors.success;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.background;
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                        title="Tag"
                      >
                        <Tag className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {customers.map((customer) => {
          const segmentConfig = getSegmentConfig(customer.segment);

          return (
            <div
              key={customer.id}
              className="p-4 rounded-lg border transition-all"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={customer.avatar}
                    alt={customer.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold mb-1"
                    style={{ color: colors.textPrimary }}
                  >
                    {customer.name}
                  </div>
                  <div
                    className="text-xs truncate"
                    style={{ color: colors.textSecondary }}
                  >
                    {customer.email}
                  </div>
                </div>
                <div
                  className="px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
                  style={{
                    backgroundColor: segmentConfig.bgColor,
                    color: segmentConfig.textColor,
                  }}
                >
                  {customer.segment}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div>
                  <div style={{ color: colors.textSecondary }}>Region</div>
                  <div
                    className="font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    {customer.region}
                  </div>
                </div>
                <div>
                  <div style={{ color: colors.textSecondary }}>Last Contact</div>
                  <div
                    className="font-mono"
                    style={{ color: colors.textPrimary }}
                  >
                    {customer.lastContact}
                  </div>
                </div>
                <div>
                  <div style={{ color: colors.textSecondary }}>Bookings</div>
                  <div
                    className="font-mono font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    {customer.totalBookings}
                  </div>
                </div>
                <div>
                  <div style={{ color: colors.textSecondary }}>Total Spent</div>
                  <div
                    className="font-mono font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    ${customer.totalSpent.toLocaleString()}
                  </div>
                </div>
              </div>

              <div
                className="flex gap-2 pt-3 border-t"
                style={{ borderColor: colors.cardBorder }}
              >
                <button
                  type="button"
                  onClick={() => onView(customer)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all text-xs font-medium"
                  style={{
                    backgroundColor: `${colors.accent}15`,
                    color: colors.accent,
                  }}
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  type="button"
                  onClick={() => onMessage(customer)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all text-xs font-medium"
                  style={{
                    backgroundColor: colors.background,
                    color: colors.textSecondary,
                    border: `1px solid ${colors.cardBorder}`,
                  }}
                >
                  <Mail className="w-4 h-4" />
                  <span>Message</span>
                </button>
                <button
                  type="button"
                  onClick={() => onTag(customer)}
                  className="p-2.5 rounded-lg transition-all"
                  style={{
                    backgroundColor: colors.background,
                    color: colors.textSecondary,
                    border: `1px solid ${colors.cardBorder}`,
                  }}
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CustomerTable;
