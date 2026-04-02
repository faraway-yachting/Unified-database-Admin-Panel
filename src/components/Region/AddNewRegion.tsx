"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@/context/ThemeContext";
import { useCreateRegionMutation } from "@/lib/api/regions";
import Tick from "@/icons/Tick";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "th", label: "Thai" },
  { code: "zh", label: "Chinese" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "it", label: "Italian" },
  { code: "ja", label: "Japanese" },
  { code: "ar", label: "Arabic" },
];

interface FormState {
  name: string;
  siteUrl: string;
  country: string;
  languageCode: string;
  contactEmail: string;
  contactPhone: string;
  metaTitle: string;
  metaDescription: string;
  status: "live" | "draft";
}

const INITIAL: FormState = {
  name: "",
  siteUrl: "",
  country: "",
  languageCode: "en",
  contactEmail: "",
  contactPhone: "",
  metaTitle: "",
  metaDescription: "",
  status: "draft",
};

export default function AddNewRegion() {
  const router = useRouter();
  const { colors } = useTheme();
  const createRegion = useCreateRegionMutation();
  const [form, setForm] = useState<FormState>(INITIAL);

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const set = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.country.trim()) errs.country = "Country is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await createRegion.mutateAsync({
        name: form.name.trim(),
        siteUrl: form.siteUrl.trim() || undefined,
        country: form.country.trim(),
        languageCode: form.languageCode,
        contactEmail: form.contactEmail.trim() || undefined,
        contactPhone: form.contactPhone.trim() || undefined,
        metaTitle: form.metaTitle.trim() || undefined,
        metaDescription: form.metaDescription.trim() || undefined,
        status: form.status,
      });
      toast.success("Region created successfully", {
        onClose: () => router.push("/regions"),
      });
    } catch (err) {
      const e = err as { message?: string };
      toast.error(e?.message || "Failed to create region");
    }
  };

  const inputClass = "outline-none w-full rounded-lg px-3 py-2";
  const inputStyle = { backgroundColor: colors.hoverBg, color: colors.textPrimary, border: "none" };
  const labelStyle = { color: colors.textPrimary };
  const errStyle = { color: colors.danger };
  const sectionStyle = { color: colors.textPrimary, borderColor: colors.cardBorder };

  const field = (
    label: string,
    key: keyof FormState,
    placeholder: string,
    required = false
  ) => (
    <div>
      <div className="flex items-center gap-1 mb-2">
        <label className="block font-bold" style={labelStyle}>{label}</label>
        {required && <span style={{ color: colors.danger }}>*</span>}
      </div>
      <input
        type="text"
        value={form[key] as string}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className={inputClass}
        style={{ ...inputStyle, border: errors[key] ? `1px solid ${colors.danger}` : "none" }}
      />
      {errors[key] && <p className="text-sm mt-1" style={errStyle}>{errors[key]}</p>}
    </div>
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-4">

        <div className="mb-6">
          <h2 className="font-bold text-[24px] pb-2 mb-4 border-b" style={sectionStyle}>
            Basic Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Region / Website Name", "name", "e.g. Faraway, Phuket Sailing", true)}
            {field("Country", "country", "e.g. Thailand", true)}
            {field("Site URL", "siteUrl", "e.g. https://faraway.com")}

            <div>
              <label className="block font-bold mb-2" style={labelStyle}>Language</label>
              <div className="rounded-lg px-3 py-2 w-full" style={{ backgroundColor: colors.hoverBg }}>
                <select
                  value={form.languageCode}
                  onChange={(e) => set("languageCode", e.target.value)}
                  className="w-full outline-0 cursor-pointer"
                  style={{ backgroundColor: colors.hoverBg, color: colors.textPrimary }}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} style={{ backgroundColor: colors.cardBg, color: colors.textPrimary }}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2" style={labelStyle}>Status</label>
              <div className="flex gap-4 mt-1">
                {(["draft", "live"] as const).map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: form.status === s ? colors.accent : colors.textSecondary,
                        backgroundColor: form.status === s ? colors.accent : "transparent",
                      }}
                      onClick={() => set("status", s)}
                    >
                      {form.status === s && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="font-medium capitalize" style={{ color: colors.textPrimary }}>{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-bold text-[24px] pb-2 mb-4 border-b" style={sectionStyle}>
            Contact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Contact Email", "contactEmail", "info@example.com")}
            {field("Contact Phone", "contactPhone", "+66 12 345 6789")}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-bold text-[24px] pb-2 mb-4 border-b" style={sectionStyle}>
            SEO
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {field("Meta Title", "metaTitle", "Page title for search engines")}
            <div>
              <label className="block font-bold mb-2" style={labelStyle}>Meta Description</label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                placeholder="Brief description for search engines"
                rows={3}
                className="outline-none w-full rounded-lg px-3 py-2 resize-none"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-between">
          <button
            type="button"
            onClick={() => router.push("/regions")}
            className="rounded-full px-[16px] py-[7px] flex items-center gap-1 cursor-pointer font-medium"
            style={{ border: `1px solid ${colors.cardBorder}`, color: colors.textPrimary, backgroundColor: colors.hoverBg }}
          >
            <MdKeyboardArrowLeft /> Back
          </button>
          <button
            type="submit"
            disabled={createRegion.isPending}
            className={`rounded-full px-[16px] py-[8px] flex items-center justify-center gap-2 font-medium ${createRegion.isPending ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
            style={{ backgroundColor: colors.accent, color: "#000" }}
          >
            {createRegion.isPending ? "Saving..." : <><Tick /> Save</>}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
