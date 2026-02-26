"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "@/context/ThemeContext";
import { useRegionsQuery } from "@/lib/api/regions";
import {
  useFleetTopBarActions,
  defaultFleetFilters,
  type FleetFilters,
  type FleetYachtType,
  type FleetStatusFilter,
} from "@/context/FleetTopBarActionsContext";

const YACHT_TYPES: { value: FleetYachtType; label: string }[] = [
  { value: "sailboat", label: "Sailboat" },
  { value: "motor", label: "Motor" },
  { value: "catamaran", label: "Catamaran" },
  { value: "gulet", label: "Gulet" },
];

const STATUS_OPTIONS: { value: FleetStatusFilter; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "booked", label: "Booked" },
  { value: "maintenance", label: "Maintenance" },
  { value: "retired", label: "Retired" },
];

interface FleetFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FleetFilterModal({ open, onOpenChange }: FleetFilterModalProps) {
  const { colors } = useTheme();
  const { fleetFilters, setFleetFilters } = useFleetTopBarActions();
  const { data: regionsData, isLoading: regionsLoading } = useRegionsQuery();
  const regions = regionsData ?? [];

  const [form, setForm] = useState<FleetFilters>(defaultFleetFilters);

  useEffect(() => {
    if (open) {
      setForm(fleetFilters);
    }
  }, [open, fleetFilters]);

  const update = (patch: Partial<FleetFilters>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleApply = () => {
    setFleetFilters(form);
    onOpenChange(false);
  };

  const handleReset = () => {
    setForm(defaultFleetFilters);
    setFleetFilters(defaultFleetFilters);
  };

  const inputStyle = {
    backgroundColor: colors.cardBg,
    borderColor: colors.cardBorder,
    color: colors.textPrimary,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: colors.textPrimary }}>
            Filter Yachts
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Region */}
          <div className="grid gap-2">
            <Label style={{ color: colors.textPrimary }}>Region</Label>
            <select
              value={form.regionId}
              onChange={(e) => update({ regionId: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
              style={{
                ...inputStyle,
                focusRing: colors.accent,
              }}
              disabled={regionsLoading}
            >
              <option value="">All regions</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name || r.id}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="grid gap-2">
            <Label style={{ color: colors.textPrimary }}>Type</Label>
            <select
              value={form.type}
              onChange={(e) => update({ type: e.target.value as FleetYachtType | "" })}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
              style={inputStyle}
            >
              <option value="">All types</option>
              {YACHT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label style={{ color: colors.textPrimary }}>Status</Label>
            <select
              value={form.status}
              onChange={(e) => update({ status: e.target.value as FleetStatusFilter | "" })}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
              style={inputStyle}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Capacity range */}
          <div className="grid gap-2">
            <Label style={{ color: colors.textPrimary }}>
              Capacity range (min – max)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={form.maxCapacity}
                value={form.minCapacity}
                onChange={(e) =>
                  update({
                    minCapacity: parseInt(e.target.value, 10) || 0,
                  })
                }
                placeholder="Min"
                className="flex-1"
                style={inputStyle}
              />
              <span style={{ color: colors.textSecondary }}>–</span>
              <Input
                type="number"
                min={form.minCapacity}
                max={500}
                value={form.maxCapacity}
                onChange={(e) =>
                  update({
                    maxCapacity: parseInt(e.target.value, 10) || 100,
                  })
                }
                placeholder="Max"
                className="flex-1"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-2">
            <Label style={{ color: colors.textPrimary }}>Options</Label>
            <div className="flex flex-col gap-2">
              <label
                className="flex items-center gap-2 cursor-pointer"
                style={{ color: colors.textSecondary }}
              >
                <Checkbox
                  checked={form.isActive}
                  onCheckedChange={(c) => update({ isActive: !!c })}
                />
                <span className="text-sm">Active only</span>
              </label>
              <label
                className="flex items-center gap-2 cursor-pointer"
                style={{ color: colors.textSecondary }}
              >
                <Checkbox
                  checked={form.includeCompany}
                  onCheckedChange={(c) => update({ includeCompany: !!c })}
                />
                <span className="text-sm">Include company</span>
              </label>
              <label
                className="flex items-center gap-2 cursor-pointer"
                style={{ color: colors.textSecondary }}
              >
                <Checkbox
                  checked={form.includeRegion}
                  onCheckedChange={(c) => update({ includeRegion: !!c })}
                />
                <span className="text-sm">Include region</span>
              </label>
              <label
                className="flex items-center gap-2 cursor-pointer"
                style={{ color: colors.textSecondary }}
              >
                <Checkbox
                  checked={form.includeImages}
                  onCheckedChange={(c) => update({ includeImages: !!c })}
                />
                <span className="text-sm">Include images</span>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-lg border text-sm font-medium"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary,
            }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{
              background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
            }}
          >
            Apply
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FleetFilterModal;
