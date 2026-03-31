"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import { MdDeleteOutline, MdKeyboardArrowLeft } from "react-icons/md";
import { RiArrowDownSLine } from "react-icons/ri";
import { useTheme } from "@/context/ThemeContext";
import {
  useCreateYachtMutation,
  useUpdateYachtMutation,
} from "@/lib/api/yachts";
import { useRegionsQuery } from "@/lib/api/regions";
import { useCharterCompaniesQuery } from "@/lib/api/charterCompanies";
import { NewYachtsData, RichTextEditorSections } from "@/data/Yachts";
import RichTextEditor from "@/common/TextEditor";
import Tick from "@/icons/Tick";
import {
  yachtsUpdateValidationSchema,
  FormYachtsUpdateValues,
} from "@/lib/Validation/addyachtsValidationSchema";

interface ImageItem {
  type: "url" | "file";
  value: string | File;
  id?: string;
}

type RichTextFieldKey =
  | "Day Charter"
  | "Overnight Charter"
  | "About this Boat"
  | "Specifications"
  | "Boat Layout";

const INITIAL_VALUES: FormYachtsUpdateValues = {
  "Display Order": null,
  "Boat Type": "",
  Title: "",
  Category: "",
  Capacity: "",
  Length: "",
  "Length Range": "",
  Cabins: "",
  Bathrooms: "",
  "Passenger Day Trip": "",
  "Passenger Overnight": "",
  Guests: "",
  "Guests Range": "",
  "Day Trip Price": "",
  "Overnight Price": "",
  "Daytrip Price (Euro)": "",
  "Primary Image": "",
  "Gallery Images": [],
  "Day Charter": "",
  "Overnight Charter": "",
  "About this Boat": "",
  Specifications: "",
  "Boat Layout": "",
  "Video Link": "",
  Badge: "",
  Slug: "",
  Design: "",
  Built: "",
  "Cruising Speed": "",
  "Length Overall": "",
  "Fuel Capacity": "",
  "Water Capacity": "",
  Code: "",
  "Yacht Type": "",
  Tags: [],
};

const AddNewYachts: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [regionError, setRegionError] = useState("");

  const createYachtMutation = useCreateYachtMutation();
  const updateYachtMutation = useUpdateYachtMutation();
  const { data: regions } = useRegionsQuery();
  const { data: companies } = useCharterCompaniesQuery();
  const allTags = [{ _id: "super-yacht", Name: "super yacht" }, { _id: "overnight", Name: "overnight" }];

  const regionOptions = useMemo(() => regions ?? [], [regions]);
  const companyOptions = useMemo(() => companies ?? [], [companies]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isTagsOpen && !target.closest(".tags-dropdown")) {
        setIsTagsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTagsOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) {
        formik.setFieldError("Primary Image", "File must be 10MB or smaller");
        e.target.value = "";
        return;
      }
      formik.setFieldValue("Primary Image", file);
      formik.setFieldError("Primary Image", undefined);
    }
  };

  const handleDelete = () => formik.setFieldValue("Primary Image", null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const existing = Array.isArray(formik.values["Gallery Images"]) ? formik.values["Gallery Images"] : [];
    const newFiles = Array.from(files).map((file) => ({ type: "file" as const, value: file }));
    if (existing.length + newFiles.length > 30) {
      formik.setFieldError("Gallery Images", "Maximum 30 images allowed");
      e.target.value = "";
      return;
    }
    formik.setFieldValue("Gallery Images", [...existing, ...newFiles]);
    formik.setFieldError("Gallery Images", undefined);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    const existing = Array.isArray(formik.values["Gallery Images"]) ? formik.values["Gallery Images"] : [];
    const newFiles = Array.from(files).map((file) => ({ type: "file" as const, value: file }));
    if (existing.length + newFiles.length > 30) {
      formik.setFieldError("Gallery Images", "Maximum 30 images allowed");
      return;
    }
    formik.setFieldValue("Gallery Images", [...existing, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    const images = Array.isArray(formik.values["Gallery Images"]) ? [...formik.values["Gallery Images"]] : [];
    images.splice(index, 1);
    formik.setFieldValue("Gallery Images", images);
  };

  const formik = useFormik<FormYachtsUpdateValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: yachtsUpdateValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      let hasError = false;
      if (!companyId) { setCompanyError("Company is required"); hasError = true; }
      if (!regionId) { setRegionError("Region is required"); hasError = true; }
      if (hasError) { setSubmitting(false); return; }

      try {
        const validTypes = ["bareboat", "crewed"];
        const yachtTypeVal = values["Yacht Type"] ?? "";
        const yachtType = validTypes.includes(yachtTypeVal) ? yachtTypeVal : "crewed";
        const created = await createYachtMutation.mutateAsync({
          companyId,
          regionId,
          name: values.Title?.trim() || values["Boat Type"]?.trim() || "New Yacht",
          type: yachtType,
          capacityGuests: Math.max(1, parseInt(String(values.Guests || "1"), 10) || 1),
          status: "available",
          isActive: true,
        });

        const newId: string = created?.id ?? created?.yacht?.id ?? created?._id;
        if (!newId) throw new Error("Failed to get created yacht ID");

        const galleryImages = Array.isArray(values["Gallery Images"])
          ? values["Gallery Images"].map((item: ImageItem) => item.value)
          : [];

        await updateYachtMutation.mutateAsync({
          payload: {
            boatType: values["Boat Type"] ?? "",
            price: values["Category"] ?? "",
            capacity: values["Capacity"] ?? "",
            length: values["Length"] ?? "",
            lengthRange: values["Length Range"] ?? "",
            title: values["Title"] ?? "",
            cabins: values["Cabins"] ?? "",
            bathrooms: values["Bathrooms"] ?? "",
            passengerDayTrip: values["Passenger Day Trip"] ?? "",
            passengerOvernight: values["Passenger Overnight"] ?? "",
            guests: values["Guests"] ?? "",
            guestsRange: values["Guests Range"] ?? "",
            dayTripPrice: values["Day Trip Price"] ?? "",
            overnightPrice: values["Overnight Price"] ?? "",
            daytripPriceEuro: values["Daytrip Price (Euro)"] ?? "",
            primaryImage: values["Primary Image"] as File,
            galleryImages,
            dayCharter: values["Day Charter"] ?? "",
            overnightCharter: values["Overnight Charter"] ?? "",
            aboutThisBoat: values["About this Boat"] ?? "",
            specifications: values["Specifications"] ?? "",
            boatLayout: values["Boat Layout"] ?? "",
            videoLink: values["Video Link"] ?? "",
            badge: values["Badge"] ?? "",
            slug: values["Slug"] ?? "",
            design: values["Design"] ?? "",
            built: values["Built"] ?? "",
            cruisingSpeed: values["Cruising Speed"] ?? "",
            lengthOverall: values["Length Overall"] ?? "",
            fuelCapacity: values["Fuel Capacity"] ?? "",
            waterCapacity: values["Water Capacity"] ?? "",
            code: values["Code"] ?? "",
            type: yachtType,
            tags: (values["Tags"] ?? []).filter((t: string | undefined): t is string => typeof t === "string"),
            displayOrder: values["Display Order"] ?? null,
          },
          yachtsId: newId,
        });

        toast.success("Yacht created successfully", {
          onClose: () => router.push(`/yachts/${newId}`),
        });
        formik.resetForm();
      } catch (error) {
        const err = error as { message?: string };
        toast.error(err?.message || "Failed to create yacht");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getFieldError = (fieldName: keyof FormYachtsUpdateValues) =>
    formik.touched[fieldName] && formik.errors[fieldName];

  const isLoading = createYachtMutation.isPending || updateYachtMutation.isPending;

  const inputStyle = {
    backgroundColor: colors.hoverBg,
    color: colors.textPrimary,
    border: "none",
  };

  const inputClass = "outline-none w-full rounded-lg px-3 py-2";
  const labelStyle = { color: colors.textPrimary };
  const sectionHeadingStyle = { color: colors.textPrimary, borderColor: colors.cardBorder };
  const errClass = "text-sm mt-1" ;

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="mt-4">
        <div className="mb-4">
          <h2 className="font-bold text-[24px] pb-2 mb-2 border-b" style={sectionHeadingStyle}>
            Company & Region
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-2" style={labelStyle}>Charter Company *</label>
              <div className="rounded-lg px-3 py-2 w-full" style={{ backgroundColor: colors.hoverBg, border: companyError ? `1px solid ${colors.danger}` : "none" }}>
                <select value={companyId} onChange={(e) => { setCompanyId(e.target.value); setCompanyError(""); }} className="w-full outline-0 cursor-pointer" style={{ backgroundColor: colors.hoverBg, color: companyId ? colors.textPrimary : colors.textSecondary }}>
                  <option value="" disabled hidden>Select company</option>
                  {companyOptions.map((c) => <option key={c.id} value={c.id} style={{ backgroundColor: colors.cardBg, color: colors.textPrimary }}>{c.name}</option>)}
                </select>
              </div>
              {companyError && <p className={errClass} style={{ color: colors.danger }}>{companyError}</p>}
            </div>
            <div>
              <label className="block font-bold mb-2" style={labelStyle}>Region *</label>
              <div className="rounded-lg px-3 py-2 w-full" style={{ backgroundColor: colors.hoverBg, border: regionError ? `1px solid ${colors.danger}` : "none" }}>
                <select value={regionId} onChange={(e) => { setRegionId(e.target.value); setRegionError(""); }} className="w-full outline-0 cursor-pointer" style={{ backgroundColor: colors.hoverBg, color: regionId ? colors.textPrimary : colors.textSecondary }}>
                  <option value="" disabled hidden>Select region</option>
                  {regionOptions.map((r) => <option key={r.id} value={r.id} style={{ backgroundColor: colors.cardBg, color: colors.textPrimary }}>{r.name}</option>)}
                </select>
              </div>
              {regionError && <p className={errClass} style={{ color: colors.danger }}>{regionError}</p>}
            </div>
          </div>
        </div>

        {NewYachtsData.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.section && (
              <h2
                className={`font-bold mb-2 ${sectionIndex === 0 ? "" : "mt-4"} ${sectionIndex !== 1 ? "text-[24px] pb-2 border-b" : ""}`}
                style={sectionIndex !== 1 ? sectionHeadingStyle : { color: colors.textSecondary }}
              >
                {section.section}
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {section.fields.map((field, index) => {
                const value = formik.values[field.label as keyof typeof formik.values] ?? "";
                const isDropdown = field.type === "dropdown";
                const isNumber = ["Display Order","Length","Cabins","Bathrooms","Passenger Day Trip","Passenger Overnight","Guests","Day Trip Price","Overnight Price","Daytrip Price (Euro)","Built","Cruising Speed","Length Overall","Fuel Capacity","Water Capacity"].includes(field.label);
                const isPrimaryUpload = field.label === "Primary Image";
                const isFileUpload = field.label === "Gallery Images";
                const isCheckbox = field.type === "checkbox";
                const isTag = field.label === "Tags";
                const fieldName = field.label as keyof FormYachtsUpdateValues;
                const fieldError = getFieldError(fieldName);
                const borderStyle = fieldError ? `1px solid ${colors.danger}` : "none";

                if (isCheckbox) {
                  return (
                    <div key={index} className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                      <label className="flex items-center gap-2 w-fit">
                        <input type="radio" name="Length Range" value={field.label} checked={formik.values["Length Range"] === field.label}
                          onChange={(e) => { formik.setFieldValue("Length Range", e.target.value); formik.setFieldTouched("Length Range", true, false); }}
                          onBlur={formik.handleBlur} className="peer hidden"
                        />
                        <div className="w-4 h-4 cursor-pointer rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: formik.values["Length Range"] === field.label ? colors.accent : colors.textSecondary, backgroundColor: formik.values["Length Range"] === field.label ? colors.accent : "transparent" }}>
                          {formik.values["Length Range"] === field.label && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="font-semibold cursor-pointer" style={{ color: colors.textPrimary }}>{field.label}</span>
                      </label>
                    </div>
                  );
                }

                return (
                  <div key={index} className={isFileUpload ? "col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4" : ""}>
                    <div className="flex items-center gap-1 mb-2">
                      <label className="block font-bold" style={labelStyle}>{field.label}</label>
                      {field.required && <span style={{ color: colors.danger }}>*</span>}
                    </div>

                    {isTag ? (
                      <>
                        <div className="rounded-lg px-3 py-2 w-full" style={{ backgroundColor: colors.hoverBg, border: borderStyle }}>
                          <div className="relative tags-dropdown">
                            <button type="button" onClick={() => setIsTagsOpen(!isTagsOpen)} className="w-full rounded-md cursor-pointer flex items-center justify-between">
                              <span style={{ color: Array.isArray(formik.values[fieldName]) && (formik.values[fieldName] as string[]).length > 0 ? colors.textPrimary : colors.textSecondary }}>
                                {Array.isArray(formik.values[fieldName]) && (formik.values[fieldName] as string[]).length > 0 ? `${(formik.values[fieldName] as string[]).length} tags selected` : "Select tags"}
                              </span>
                              <RiArrowDownSLine className={`transition-transform ${isTagsOpen ? "rotate-180" : ""}`} style={{ color: colors.textSecondary }} />
                            </button>
                            {isTagsOpen && (
                              <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-[200px] overflow-y-auto rounded-md shadow-lg" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
                                {allTags && allTags.length > 0 ? allTags.map((tag) => (
                                  <label key={tag._id} onClick={() => {
                                    const cur = Array.isArray(formik.values[fieldName]) ? (formik.values[fieldName] as string[]) : [];
                                    const sel = cur.includes(tag.Name);
                                    formik.setFieldValue(fieldName, sel ? cur.filter((v) => v !== tag.Name) : [...cur, tag.Name]);
                                    formik.setFieldTouched(fieldName, true, false);
                                  }}
                                  className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#1967D2] hover:text-white"
                                  style={{ backgroundColor: Array.isArray(formik.values[fieldName]) && (formik.values[fieldName] as string[]).includes(tag.Name) ? colors.hoverBg : "transparent" }}>
                                    <span className="text-sm" style={{ color: colors.textPrimary }}>{tag.Name}</span>
                                    {Array.isArray(formik.values[fieldName]) && (formik.values[fieldName] as string[]).includes(tag.Name) && <span style={{ color: colors.accent }}><Tick /></span>}
                                  </label>
                                )) : <div className="px-3 py-2 text-sm" style={{ color: colors.textSecondary }}>No Tags Available</div>}
                              </div>
                            )}
                          </div>
                        </div>
                        {fieldError && <p className={errClass} style={{ color: colors.danger }}>{typeof formik.errors[fieldName] === "string" && formik.errors[fieldName]}</p>}
                      </>
                    ) : isDropdown ? (
                      <>
                        <div className="rounded-lg px-3 py-2 w-full" style={{ backgroundColor: colors.hoverBg, border: borderStyle }}>
                          <select name={fieldName} value={formik.values[fieldName] as string}
                            onChange={(e) => { formik.handleChange(e); formik.setFieldTouched(fieldName, true, false); }}
                            onBlur={formik.handleBlur}
                            className="w-full outline-0 cursor-pointer"
                            style={{ backgroundColor: colors.hoverBg, color: value ? colors.textPrimary : colors.textSecondary }}>
                            <option value="" disabled hidden>{field.placeholder}</option>
                            {field.options?.map((option) => <option key={option} value={option} style={{ backgroundColor: colors.cardBg, color: colors.textPrimary }}>{option}</option>)}
                          </select>
                        </div>
                        {fieldError && <p className={errClass} style={{ color: colors.danger }}>{typeof formik.errors[fieldName] === "string" && formik.errors[fieldName]}</p>}
                      </>
                    ) : isPrimaryUpload ? (
                      <>
                        <div className="w-full rounded-lg px-3 py-2" style={{ backgroundColor: colors.hoverBg, border: borderStyle }}>
                          {!formik.values["Primary Image"] ? (
                            <input type="file" name="Primary Image" accept="image/*" onChange={handleImageChange} className="cursor-pointer" style={{ color: colors.textPrimary }} />
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              {typeof formik.values["Primary Image"] === "string" && (
                                <img src={formik.values["Primary Image"]} alt="primary" className="w-10 h-10 object-cover rounded flex-shrink-0" />
                              )}
                              {formik.values["Primary Image"] instanceof File && (
                                <img src={URL.createObjectURL(formik.values["Primary Image"])} alt="primary" className="w-10 h-10 object-cover rounded flex-shrink-0" />
                              )}
                              <p className="font-medium flex-1 truncate text-sm" style={{ color: colors.textPrimary }}>
                                {formik.values["Primary Image"] instanceof File
                                  ? formik.values["Primary Image"].name.slice(0, 20)
                                  : typeof formik.values["Primary Image"] === "string"
                                    ? (() => {
                                        const clean = (formik.values["Primary Image"] as string).split("?")[0];
                                        const filename = clean.split("/").pop() ?? "";
                                        const ext = filename.match(/\.[^/.]+$/)?.[0] ?? "";
                                        const base = filename.replace(/\.[^/.]+$/, "");
                                        return base.length > 12 ? `${base.slice(0, 12)}${ext}` : filename;
                                      })()
                                  : "Selected"}
                              </p>
                              <label className="cursor-pointer text-xs px-2 py-1 rounded flex-shrink-0" style={{ backgroundColor: colors.accent, color: "#fff" }}>
                                Replace
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                              </label>
                              <MdDeleteOutline className="cursor-pointer flex-shrink-0" style={{ color: colors.danger }} onClick={handleDelete} />
                            </div>
                          )}
                        </div>
                        {fieldError && <p className={errClass} style={{ color: colors.danger }}>{typeof formik.errors[fieldName] === "string" && formik.errors[fieldName]}</p>}
                      </>
                    ) : isFileUpload ? (
                      <>
                        <div className="border border-dashed rounded-md py-12 px-4 text-center w-full" style={{ borderColor: fieldError ? colors.danger : colors.cardBorder, backgroundColor: colors.cardBg }}>
                          <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="text-sm flex flex-col items-center cursor-pointer" style={{ color: colors.textSecondary }}>
                            <input type="file" name="Gallery Images" accept="image/png, image/jpeg" multiple onChange={handleFileUpload} className="hidden" id="add-gallery-upload" />
                            <label htmlFor="add-gallery-upload" className="cursor-pointer block">
                              <div className="flex items-center gap-1">
                                <Image src="/images/Inventory/file_upload.svg" alt="upload" width={20} height={20} />
                                <p>Drop file to attach or <span style={{ color: colors.accent }} className="underline">browser</span></p>
                              </div>
                              <p>JPEG, PNG (Max size 10MB)</p>
                            </label>
                            {Array.isArray(formik.values["Gallery Images"]) && (formik.values["Gallery Images"] as ImageItem[]).length > 0 && (
                              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                {(formik.values["Gallery Images"] as ImageItem[]).map((item, idx) => (
                                  <div key={idx} className="relative w-full aspect-square max-w-[100px]">
                                    <Image src={item.type === "url" ? (item.value as string) : URL.createObjectURL(item.value as File)} alt={`gallery-${idx}`} width={100} height={100} className="w-[100px] h-[100px] object-cover rounded-lg" />
                                    <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 rounded-md p-1 shadow-lg cursor-pointer" style={{ border: `1px solid ${colors.cardBorder}`, backgroundColor: colors.cardBg }}>
                                      <MdDeleteOutline style={{ color: colors.danger }} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {fieldError && <p className={errClass} style={{ color: colors.danger }}>{typeof formik.errors[fieldName] === "string" && formik.errors[fieldName]}</p>}
                      </>
                    ) : isNumber ? (
                      <>
                        <input type="number" name={fieldName} placeholder={field.placeholder}
                          value={typeof formik.values[fieldName] === "string" || typeof formik.values[fieldName] === "number" ? formik.values[fieldName] as string : ""}
                          onChange={(e) => { formik.handleChange(e); formik.setFieldTouched(fieldName, true, false); }}
                          onBlur={formik.handleBlur}
                          className={inputClass}
                          style={{ ...inputStyle, border: borderStyle }}
                          onWheel={(e) => e.currentTarget.blur()}
                          onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault(); }}
                        />
                        {fieldError && <p className={errClass} style={{ color: colors.danger }}>{typeof formik.errors[fieldName] === "string" && formik.errors[fieldName]}</p>}
                      </>
                    ) : (
                      <>
                        <input type="text" name={fieldName} placeholder={field.placeholder}
                          value={formik.values[fieldName] as string}
                          onChange={(e) => { formik.handleChange(e); formik.setFieldTouched(fieldName, true, false); }}
                          onBlur={formik.handleBlur}
                          className={inputClass}
                          style={{ ...inputStyle, border: borderStyle }}
                        />
                        {fieldError && <p className={errClass} style={{ color: colors.danger }}>{typeof formik.errors[fieldName] === "string" && formik.errors[fieldName]}</p>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {RichTextEditorSections.map((section) => (
          <div key={section.id} className="mt-4">
            <p className="font-bold mb-2" style={{ color: colors.textPrimary }}>{section.label}</p>
            <RichTextEditor
              value={formik.values[section.label as RichTextFieldKey] ?? ""}
              onChange={(html) => formik.setFieldValue(section.label, html)}
            />
          </div>
        ))}

        <div className="mt-3 flex justify-between">
          <button type="button" onClick={() => router.push("/yachts")}
            className="rounded-full px-[16px] py-[7px] flex items-center gap-1 cursor-pointer font-medium"
            style={{ border: `1px solid ${colors.cardBorder}`, color: colors.textPrimary, backgroundColor: colors.hoverBg }}>
            <MdKeyboardArrowLeft /> Back
          </button>
          <button type="submit" disabled={isLoading}
            className={`rounded-full px-[16px] py-[8px] flex items-center justify-center gap-2 font-medium ${isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
            style={{ backgroundColor: colors.accent, color: "#000" }}>
            {isLoading ? "Saving..." : <><Tick /> Save</>}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AddNewYachts;
