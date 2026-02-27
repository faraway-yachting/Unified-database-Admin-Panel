"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@/context/ThemeContext";
import { useCreateYachtMutation } from "@/lib/api/yachts";
import { useRegionsQuery } from "@/lib/api/regions";
import { useCharterCompaniesQuery } from "@/lib/api/charterCompanies";
import LoadingSpinner from "@/components/common/LoadingSpinner";

type FormErrors = Partial<Record<keyof CreateFormState, string>>;

type CreateFormState = {
  companyId: string;
  regionId: string;
  name: string;
  type: string;
  capacityGuests: string;
  capacityCrew: string;
  lengthM: string;
  beamM: string;
  yearBuilt: string;
  engineType: string;
  engineHp: string;
  cruiseSpeedKnots: string;
  fuelCapacityL: string;
  homePort: string;
  status: string;
  isActive: boolean;
};

const TYPE_OPTIONS = [
  { label: "Sailboat", value: "sailboat" },
  { label: "Motor Yacht", value: "motor" },
  { label: "Catamaran", value: "catamaran" },
  { label: "Gulet", value: "gulet" },
];

const STATUS_OPTIONS = [
  { label: "Available", value: "available" },
  { label: "Booked", value: "booked" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Retired", value: "retired" },
];

const AddNewYachts: React.FC = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const createYachtMutation = useCreateYachtMutation();
  const { data: regions, isLoading: regionsLoading } = useRegionsQuery();
  const { data: companies, isLoading: companiesLoading } = useCharterCompaniesQuery();

  const [form, setForm] = useState<CreateFormState>({
    companyId: "",
    regionId: "",
    name: "",
    type: "",
    capacityGuests: "",
    capacityCrew: "",
    lengthM: "",
    beamM: "",
    yearBuilt: "",
    engineType: "",
    engineHp: "",
    cruiseSpeedKnots: "",
    fuelCapacityL: "",
    homePort: "",
    status: "available",
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const loading = createYachtMutation.isPending;

  const regionOptions = useMemo(() => regions ?? [], [regions]);
  const companyOptions = useMemo(() => companies ?? [], [companies]);

  const updateField = (field: keyof CreateFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const parseIntOrUndefined = (value: string) => {
    if (!value) return undefined;
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? n : undefined;
  };

  const parseFloatOrUndefined = (value: string) => {
    if (!value) return undefined;
    const n = Number.parseFloat(value);
    return Number.isFinite(n) ? n : undefined;
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!form.companyId) nextErrors.companyId = "Company is required";
    if (!form.regionId) nextErrors.regionId = "Region is required";
    if (!form.name.trim()) nextErrors.name = "Yacht name is required";
    if (!form.type) nextErrors.type = "Yacht type is required";
    const capacity = parseIntOrUndefined(form.capacityGuests);
    if (!capacity || capacity <= 0) nextErrors.capacityGuests = "Guest capacity is required";
    return nextErrors;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      await createYachtMutation.mutateAsync({
        companyId: form.companyId,
        regionId: form.regionId,
        name: form.name.trim(),
        type: form.type,
        capacityGuests: parseIntOrUndefined(form.capacityGuests) ?? 0,
        capacityCrew: parseIntOrUndefined(form.capacityCrew),
        lengthM: parseFloatOrUndefined(form.lengthM),
        beamM: parseFloatOrUndefined(form.beamM),
        yearBuilt: parseIntOrUndefined(form.yearBuilt),
        engineType: form.engineType.trim() || undefined,
        engineHp: parseIntOrUndefined(form.engineHp),
        cruiseSpeedKnots: parseFloatOrUndefined(form.cruiseSpeedKnots),
        fuelCapacityL: parseIntOrUndefined(form.fuelCapacityL),
        homePort: form.homePort.trim() || undefined,
        status: form.status,
        isActive: form.isActive,
      });
      toast.success("Yacht created successfully", {
        onClose: () => router.push("/yachts"),
      });
      setForm({
        companyId: "",
        regionId: "",
        name: "",
        type: "",
        capacityGuests: "",
        capacityCrew: "",
        lengthM: "",
        beamM: "",
        yearBuilt: "",
        engineType: "",
        engineHp: "",
        cruiseSpeedKnots: "",
        fuelCapacityL: "",
        homePort: "",
        status: "available",
        isActive: true,
      });
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to create yacht");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2";

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="pt-[72px] p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: colors.textPrimary }}>
              Add Yacht
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              Capture core yacht details to match the new backend model.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/yachts")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary,
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Fleet
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div
            className="rounded-xl border p-6"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Basic Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Yacht Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: errors.name ? colors.danger : colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
                {errors.name && (
                  <p className="text-xs mt-2" style={{ color: colors.danger }}>
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Yacht Type *
                </label>
                <select
                  value={form.type}
                  onChange={(e) => updateField("type", e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: errors.type ? colors.danger : colors.cardBorder,
                    color: form.type ? colors.textPrimary : colors.textSecondary,
                  }}
                >
                  <option value="" disabled>
                    Select yacht type
                  </option>
                  {TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-xs mt-2" style={{ color: colors.danger }}>
                    {errors.type}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Charter Company *
                </label>
                <select
                  value={form.companyId}
                  onChange={(e) => updateField("companyId", e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: errors.companyId ? colors.danger : colors.cardBorder,
                    color: form.companyId ? colors.textPrimary : colors.textSecondary,
                  }}
                  disabled={companiesLoading}
                >
                  <option value="" disabled>
                    {companiesLoading ? "Loading companies..." : "Select charter company"}
                  </option>
                  {companyOptions.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {errors.companyId && (
                  <p className="text-xs mt-2" style={{ color: colors.danger }}>
                    {errors.companyId}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Region *
                </label>
                <select
                  value={form.regionId}
                  onChange={(e) => updateField("regionId", e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: errors.regionId ? colors.danger : colors.cardBorder,
                    color: form.regionId ? colors.textPrimary : colors.textSecondary,
                  }}
                  disabled={regionsLoading}
                >
                  <option value="" disabled>
                    {regionsLoading ? "Loading regions..." : "Select region"}
                  </option>
                  {regionOptions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {errors.regionId && (
                  <p className="text-xs mt-2" style={{ color: colors.danger }}>
                    {errors.regionId}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Guest Capacity *
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.capacityGuests}
                  onChange={(e) => updateField("capacityGuests", e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: errors.capacityGuests ? colors.danger : colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
                {errors.capacityGuests && (
                  <p className="text-xs mt-2" style={{ color: colors.danger }}>
                    {errors.capacityGuests}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Crew Capacity
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.capacityCrew}
                  onChange={(e) => updateField("capacityCrew", e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <label className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  Active
                </label>
                <button
                  type="button"
                  onClick={() => updateField("isActive", !form.isActive)}
                  className="relative w-12 h-6 rounded-full transition-all"
                  style={{
                    backgroundColor: form.isActive ? colors.accent : colors.cardBorder,
                  }}
                  aria-pressed={form.isActive}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
                    style={{
                      backgroundColor: colors.background,
                      left: form.isActive ? "1.375rem" : "0.25rem",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl border p-6"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Dimensions & Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Length (m)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.lengthM}
                  onChange={(e) => updateField("lengthM", e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Beam (m)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.beamM}
                  onChange={(e) => updateField("beamM", e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Year Built
                </label>
                <input
                  type="number"
                  min={1900}
                  value={form.yearBuilt}
                  onChange={(e) => updateField("yearBuilt", e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Engine Type
                </label>
                <input
                  type="text"
                  value={form.engineType}
                  onChange={(e) => updateField("engineType", e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Engine HP
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.engineHp}
                  onChange={(e) => updateField("engineHp", e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Cruise Speed (knots)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.cruiseSpeedKnots}
                  onChange={(e) => updateField("cruiseSpeedKnots", e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Fuel Capacity (L)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.fuelCapacityL}
                  onChange={(e) => updateField("fuelCapacityL", e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Home Port
                </label>
                <input
                  type="text"
                  value={form.homePort}
                  onChange={(e) => updateField("homePort", e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
              </div>
            </div>
          </div>

          {(regionsLoading || companiesLoading) && (
            <div className="flex justify-center py-2">
              <LoadingSpinner size="sm" text="Loading reference data..." />
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/yachts")}
              className="px-4 py-2 rounded-lg border text-sm font-medium transition-all"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
              style={{
                background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Plus className="w-4 h-4" />
              {loading ? "Saving..." : "Create Yacht"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddNewYachts;
