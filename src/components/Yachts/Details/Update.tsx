"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NewYachtsData, RichTextEditorSections } from "@/data/Yachts";
import Image from "next/image";
import {
  useYachtByIdQuery,
  useUpdateYachtMutation,
} from "@/lib/api/yachts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import {
  yachtsUpdateValidationSchema,
  FormYachtsUpdateValues,
} from "@/lib/Validation/addyachtsValidationSchema";
import { MdDeleteOutline } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import RichTextEditor from "@/common/TextEditor";
import Tick from "@/icons/Tick";
import { RiArrowDownSLine } from "react-icons/ri";
import { useTheme } from "@/context/ThemeContext";

interface CustomerProps {
  goToPrevTab: () => void;
  id: string | number;
}

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

const YachtsUpdate: React.FC<CustomerProps> = ({ goToPrevTab, id }) => {
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const { colors } = useTheme();

  const router = useRouter();
  const { data: yachtData, isLoading: loading } = useYachtByIdQuery(id as string);
  const yachts = yachtData?.yachts ?? null;
  const allTags = [{ _id: "super-yacht", Name: "super yacht" }, { _id: "overnight", Name: "overnight" }];
  const updateYachtMutation = useUpdateYachtMutation();

  // Close tags dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isTagsOpen && !target.closest('.tags-dropdown')) {
        setIsTagsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTagsOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) {
        formik.setFieldTouched("Primary Image", true, false);
        formik.setFieldError("Primary Image", "File must be 10MB or smaller");
        e.target.value = "";
        return;
      }
      formik.setFieldValue("Primary Image", file);
      formik.setFieldError("Primary Image", undefined);
    }
  };

  const handleDelete = () => {
    formik.setFieldValue("Primary Image", null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const existingImages = Array.isArray(formik.values["Gallery Images"])
        ? formik.values["Gallery Images"]
        : [];
      const newFiles = Array.from(files).map((file) => ({
        type: "file" as const,
        value: file,
      }));
      const totalImages = existingImages.length + newFiles.length;

      if (totalImages > 30) {
        formik.setFieldTouched("Gallery Images", true, false);
        formik.setFieldError("Gallery Images", "Maximum 30 images allowed");
        e.target.value = "";
        return;
      } else {
        formik.setFieldValue("Gallery Images", [
          ...existingImages,
          ...newFiles,
        ]);
        formik.setFieldError("Gallery Images", undefined);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const existingImages = Array.isArray(formik.values["Gallery Images"])
        ? formik.values["Gallery Images"]
        : [];
      const newFiles = Array.from(files).map((file) => ({
        type: "file" as const,
        value: file,
      }));
      const totalImages = existingImages.length + newFiles.length;
      if (totalImages > 30) {
        formik.setFieldTouched("Gallery Images", true, false);
        formik.setFieldError("Gallery Images", "Maximum 30 images allowed");
        return;
      }
      for (const file of files) {
        if (file.size > 1 * 1024 * 1024) {
          formik.setFieldTouched("Gallery Images", true, false);
          formik.setFieldError("Gallery Images", "File must be 1MB or smaller");
          return;
        }
      }
      formik.setFieldValue("Gallery Images", [...existingImages, ...newFiles]);
      formik.setFieldError("Gallery Images", undefined);
    }
  };

  const handleRemoveImage = (index: number) => {
    const images = Array.isArray(formik.values["Gallery Images"])
      ? [...formik.values["Gallery Images"]]
      : [];
    images.splice(index, 1);
    formik.setFieldValue("Gallery Images", images);
  };

  const convertExistingImages = (images: string[] | undefined): ImageItem[] => {
    if (!Array.isArray(images)) return [];
    return images.map((url, index) => ({
      type: "url",
      value: url,
      id: `existing-${index}`,
    }));
  };

  const tr = yachts?.translations?.find(t => t.locale === 'en') ?? yachts?.translations?.[0];
  const formik = useFormik<FormYachtsUpdateValues>({
    enableReinitialize: true,
    initialValues: {
      "Display Order": yachts?.displayOrder ?? null,
      "Boat Type": yachts?.boatType ?? "",
      Title: tr?.title ?? yachts?.name ?? "",
      Category: yachts?.charterType ?? "",
      Capacity: yachts?.capacity ?? "",
      Length: yachts?.length ?? "",
      "Length Range": yachts?.lengthRange ?? "",
      Cabins: yachts?.cabins ?? "",
      Bathrooms: yachts?.bathrooms ?? "",
      "Passenger Day Trip": yachts?.passengerDayTrip ?? "",
      "Passenger Overnight": yachts?.passengerOvernight ?? "",
      Guests: yachts?.guests ?? "",
      "Guests Range": yachts?.guestsRange ?? "",
      "Day Trip Price": yachts?.dayTripPrice ?? "",
      "Overnight Price": yachts?.overnightPrice ?? "",
      "Daytrip Price (Euro)": yachts?.daytripPriceEuro ?? "",
      "Primary Image": yachts?.primaryImage ?? yachts?.images?.[0]?.imageUrl ?? "",
      "Gallery Images": convertExistingImages(
        yachts?.images?.map(img => img.imageUrl) ?? [],
      ),
      "Day Charter": tr?.dayCharter ?? "",
      "Overnight Charter": tr?.overnightCharter ?? "",
      "About this Boat": tr?.aboutThisBoat ?? "",
      Specifications: tr?.specifications ?? "",
      "Boat Layout": tr?.boatLayout ?? "",
      "Video Link": yachts?.videoLink ?? "",
      Badge: yachts?.badge ?? "",
      Slug: tr?.slug ?? "",
      Design: yachts?.design ?? "",
      Built: yachts?.built ?? "",
      "Cruising Speed": yachts?.cruisingSpeed ?? "",
      "Length Overall": yachts?.lengthOverall ?? "",
      "Fuel Capacity": yachts?.fuelCapacity ?? "",
      "Water Capacity": yachts?.waterCapacity ?? "",
      Code: yachts?.code ?? "",
      "Yacht Type": yachts?.type ?? "",
      "Tags": yachts?.tags?.map(t => t.tag) ?? [],
    },
    validationSchema: yachtsUpdateValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const errors = await formik.validateForm();
        if (Object.keys(errors).length > 0) {
          formik.setTouched({
            "Display Order": true,
            "Boat Type": true,
            Category: true,
            Capacity: true,
            Length: true,
            "Length Range": true,
            Title: true,
            Cabins: true,
            Bathrooms: true,
            "Passenger Day Trip": true,
            "Passenger Overnight": true,
            Guests: true,
            "Guests Range": true,
            "Day Trip Price": true,
            "Overnight Price": true,
            "Daytrip Price (Euro)": true,
            "Primary Image": true,
            "Gallery Images": true,
            "Day Charter": true,
            "Overnight Charter": true,
            "About this Boat": true,
            Specifications: true,
            "Boat Layout": true,
            "Video Link": true,
            Badge: true,
            Design: true,
            Slug: true,
            Built: true,
            "Cruising Speed": true,
            "Length Overall": true,
            "Fuel Capacity": true,
            "Water Capacity": true,
            Tags: true,
            Code: true,
            "Yacht Type": true,
          });
          setSubmitting(false);
          return;
        }
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
            galleryImages: galleryImages,
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
            type: values["Yacht Type"] ?? "",
            tags: (values["Tags"] ?? []).filter((t: string | undefined): t is string => typeof t === "string"),
            displayOrder: values["Display Order"] ?? null,
          },
          yachtsId: id.toString(),
        });
        toast.success("Yachts Update successfully", {
          onClose: () => router.push("/yachts"),
        });
        formik.resetForm();
      } catch (error) {
        const err = error as { message?: string };
        toast.error(err?.message || "An unexpected error occurred");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getFieldError = (fieldName: keyof FormYachtsUpdateValues) => {
    return formik.touched[fieldName] && formik.errors[fieldName];
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="mt-4">
        {NewYachtsData.map((section, sectionIndex) => {
          return (
            <div key={sectionIndex}>
              {section.section && (
                <h2
                  className={`font-bold mb-2 ${
                    sectionIndex === 0 ? "" : "mt-4"
                  } ${
                    sectionIndex !== 1
                      ? "text-[24px] pb-2 border-b"
                      : ""
                  }`}
                  style={{ color: colors.textPrimary, borderColor: colors.cardBorder }}
                >
                  {section.section}
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {section.fields.map((field, index) => {
                  const value =
                    formik.values[field.label as keyof typeof formik.values] ??
                    "";
                  const isDropdown = field.type === "dropdown";
                  const isNumber = [
                    "Display Order",
                    "Length",
                    "Cabins",
                    "Bathrooms",
                    "Passenger Day Trip",
                    "Passenger Overnight",
                    "Guests",
                    "Day Trip Price",
                    "Overnight Price",
                    "Daytrip Price (Euro)",
                    "Built",
                    "Cruising Speed",
                    "Length Overall",
                    "Fuel Capacity",
                    "Water Capacity",
                  ].includes(field.label);
                  const isPrimaryUpload = field.label === "Primary Image";
                  const isFileUpload = field.label === "Gallery Images";
                  const isCheckbox = field.type === "checkbox";
                  const isTag = field.label === "Tags";
                  const fieldName = field.label as keyof FormYachtsUpdateValues;
                  const fieldError = getFieldError(fieldName);
                  if (isCheckbox) {
                    return (
                      <div
                        key={index}
                        className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4"
                      >
                        <label className="flex items-center gap-2 w-fit">
                          <input
                            type="radio"
                            name="Length Range"
                            value={field.label}
                            checked={
                              formik.values["Length Range"] === field.label
                            }
                            onChange={(e) => {
                              formik.setFieldValue(
                                "Length Range",
                                e.target.value
                              );
                              formik.setFieldTouched(
                                "Length Range",
                                true,
                                false
                              );
                            }}
                            onBlur={formik.handleBlur}
                            className="peer hidden"
                          />
                          <div
                            className="w-4 h-4 cursor-pointer rounded-full border flex items-center justify-center"
                            style={{
                              borderColor: formik.values["Length Range"] === field.label ? colors.accent : colors.textSecondary,
                              backgroundColor: formik.values["Length Range"] === field.label ? colors.accent : "transparent",
                            }}
                          >
                            {formik.values["Length Range"] === field.label && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <label className="block font-semibold cursor-pointer" style={{ color: colors.textPrimary }}>
                            {field.label}
                          </label>
                        </label>
                        {index ===
                          section.fields.filter((f) => f.type === "checkbox")
                            .length -
                            1 &&
                          getFieldError(
                            "Length Range" as keyof FormYachtsUpdateValues
                          ) && (
                            <p className="text-red-500 text-sm mt-1">
                              {typeof formik.errors["Length Range"] ===
                                "string" && formik.errors["Length Range"]}
                            </p>
                          )}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={index}
                      className={`${
                        isFileUpload
                          ? "col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-2">
                        <label className="block font-bold" style={{ color: colors.textPrimary }}>
                          {field.label}
                        </label>
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </div>

                      {isTag ? (
                        <>
                        <div
                          className={`rounded-lg px-3 py-2 w-full ${fieldError ? "border border-red-500" : ""}`}
                          style={{ backgroundColor: colors.hoverBg }}
                        >
                          <div className="relative tags-dropdown">
                            <button
                              type="button"
                              onClick={() => setIsTagsOpen(!isTagsOpen)}
                              className="w-full rounded-md cursor-pointer flex items-center justify-between"
                            >
                              <span style={{ color: Array.isArray(formik.values[fieldName]) && formik.values[fieldName].length > 0 ? colors.textPrimary : colors.textSecondary }}>
                                {Array.isArray(formik.values[fieldName]) && formik.values[fieldName].length > 0 
                                  ? `${formik.values[fieldName].length} tags selected`
                                  : "Select tags"
                                }
                              </span>
                              <RiArrowDownSLine className={`transition-transform ${isTagsOpen ? 'rotate-180' : ''}`} style={{ color: colors.textSecondary }} />
                            </button>
                            {isTagsOpen && (
                              <div className="absolute top-full left-0 scrollbar-thick right-0 z-10 mt-1 max-h-[200px] overflow-y-auto border rounded-md shadow-lg" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                                {allTags && allTags.length > 0 ? (
                                  allTags.map((tag) => (
                                    <label
                                      key={tag._id}
                                      onClick={() => {
                                        const currentValues = Array.isArray(formik.values[fieldName]) ? formik.values[fieldName] : [];
                                        const isSelected = currentValues.includes(tag.Name);
                                        let newValues;
                                        if (isSelected) {
                                          newValues = currentValues.filter(value => value !== tag.Name);
                                        } else {
                                          newValues = [...currentValues, tag.Name];
                                        }
                                        formik.setFieldValue(fieldName, newValues);
                                        formik.setFieldTouched(fieldName, true, false);
                                      }}
                                      className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:text-white hover:bg-[#1967D2] ${
                                        Array.isArray(formik.values[fieldName]) && formik.values[fieldName].includes(tag.Name)
                                          ? "bg-blue-50"
                                          : ""
                                      }`}
                                    >
                                      <span className="text-sm" style={{ color: colors.textPrimary }}>{tag.Name}</span>
                                      {Array.isArray(formik.values[fieldName]) && formik.values[fieldName].includes(tag.Name) && (
                                        <span style={{ color: colors.textPrimary }}>
                                          <Tick />
                                        </span>
                                      )}
                                    </label>
                                  ))
                                ) : (
                                  <div className="px-3 py-2 text-sm" style={{ color: colors.textSecondary }}>
                                    No Tags Available
                                  </div>
                                )}
                              </div>
                            )}
                            <input
                              type="hidden"
                              name={fieldName}
                              value={Array.isArray(formik.values[fieldName]) ? formik.values[fieldName].join(",") : ""}
                            />
                          </div>
                        </div>
                        {fieldError && (
                          <p className="text-red-500 text-sm mt-1">
                            {typeof formik.errors[fieldName] === "string" &&
                              formik.errors[fieldName]}
                          </p>
                        )}
                      </>
                      ) : isDropdown ? (
                        <>
                          <div
                            className={`rounded-lg px-3 py-2 w-full ${
                              fieldError ? "border border-red-500" : ""
                            }`}
                            style={{ backgroundColor: colors.hoverBg }}
                          >
                            <select
                              name={fieldName}
                              value={formik.values[fieldName] as string}
                              onChange={(e) => {
                                formik.handleChange(e);
                                formik.setFieldTouched(fieldName, true, false);
                              }}
                              onBlur={formik.handleBlur}
                              className="w-full outline-0 cursor-pointer bg-transparent"
                              style={{ color: value ? colors.textPrimary : colors.textSecondary }}
                            >
                              <option value="" disabled hidden>
                                {field.placeholder}
                              </option>
                              {field.options?.map((option) => (
                                <option
                                  key={option}
                                  value={option}
                                  className="outline-0 pt-4"
                                  style={{ color: colors.textPrimary, backgroundColor: colors.cardBg }}
                                >
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                          {fieldError && (
                            <p className="text-red-500 text-sm mt-1">
                              {typeof formik.errors[fieldName] === "string" &&
                                formik.errors[fieldName]}
                            </p>
                          )}
                        </>
                      ) : isPrimaryUpload ? (
                        <>
                          <div
                            className={`w-full rounded-lg px-3 py-2 ${
                              fieldError ? "border border-red-500" : ""
                            }`}
                            style={{ backgroundColor: colors.hoverBg, color: colors.textPrimary }}
                          >
                            {!formik.values["Primary Image"] ? (
                              <input
                                type="file"
                                name="Primary Image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="cursor-pointer"
                              />
                            ) : (
                              <div className="flex items-center justify-between gap-2">
                                {typeof formik.values["Primary Image"] === "string" && (
                                  <img
                                    src={formik.values["Primary Image"]}
                                    alt="primary"
                                    className="w-10 h-10 object-cover rounded flex-shrink-0"
                                  />
                                )}
                                {formik.values["Primary Image"] instanceof File && (
                                  <img
                                    src={URL.createObjectURL(formik.values["Primary Image"])}
                                    alt="primary"
                                    className="w-10 h-10 object-cover rounded flex-shrink-0"
                                  />
                                )}
                                <p className="font-medium flex-1 truncate text-sm" style={{ color: colors.textPrimary }}>
                                  {(() => {
                                    const primaryImage = formik.values["Primary Image"];
                                    if (!primaryImage) return "No file selected";
                                    if (primaryImage instanceof File) {
                                      const name = primaryImage.name;
                                      const ext = name.match(/\.[^/.]+$/)?.[0] ?? "";
                                      return `${name.replace(/\.[^/.]+$/, "").split(/[ .]/)[0].slice(0, 10)}${ext}`;
                                    }
                                    if (typeof primaryImage === "string") {
                                      const cleanUrl = primaryImage.split("?")[0];
                                      const filename = cleanUrl.split("/").pop() ?? "";
                                      const ext = filename.match(/\.[^/.]+$/)?.[0] ?? "";
                                      const base = filename.replace(/\.[^/.]+$/, "");
                                      return base.length > 12 ? `${base.slice(0, 12)}${ext}` : filename;
                                    }
                                    return "No file selected";
                                  })()}
                                </p>
                                <label className="cursor-pointer text-xs px-2 py-1 rounded flex-shrink-0 bg-blue-600 text-white">
                                  Replace
                                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                                <MdDeleteOutline
                                  className="cursor-pointer text-red-500 flex-shrink-0"
                                  onClick={handleDelete}
                                />
                              </div>
                            )}
                          </div>
                          {fieldError && (
                            <p className="text-red-500 text-sm mt-1">
                              {typeof formik.errors[fieldName] === "string" &&
                                formik.errors[fieldName]}
                            </p>
                          )}
                        </>
                      ) : isFileUpload ? (
                        <>
                          <div
                            className={`border border-dashed rounded-md py-12 px-4 text-center w-full ${
                              fieldError ? "border-red-500" : ""
                            }`}
                            style={{ borderColor: fieldError ? undefined : colors.cardBorder, backgroundColor: colors.cardBg }}
                          >
                            <div
                              onDrop={handleDrop}
                              onDragOver={(e) => e.preventDefault()}
                              onBlur={() =>
                                formik.setFieldTouched(
                                  "Gallery Images",
                                  true,
                                  false
                                )
                              }
                              className="font-normal text-[14px] flex flex-col items-center cursor-pointer"
                              style={{ color: colors.textSecondary }}
                            >
                              <input
                                type="file"
                                name="Gallery Images"
                                accept="image/png, image/jpeg"
                                multiple
                                onChange={handleFileUpload}
                                onBlur={() =>
                                  formik.setFieldTouched(
                                    "Gallery Images",
                                    true,
                                    false
                                  )
                                }
                                className="hidden"
                                id="generalinfo-upload"
                              />
                              <label
                                htmlFor="generalinfo-upload"
                                className="cursor-pointer block"
                                onClick={() =>
                                  formik.setFieldTouched(
                                    "Gallery Images",
                                    true,
                                    false
                                  )
                                }
                              >
                                <div className="flex items-center gap-1">
                                  <Image
                                    src="/images/Inventory/file_upload.svg"
                                    alt="upload"
                                    width={20}
                                    height={20}
                                  />
                                  <p>
                                    Drop file to attach or{" "}
                                    <span className="underline" style={{ color: colors.accent }}>
                                      browser
                                    </span>
                                  </p>
                                </div>
                                <p>JPEG, PNG (Max size 10MB)</p>
                              </label>
                              {Array.isArray(formik.values["Gallery Images"]) &&
                                formik.values["Gallery Images"].length > 0 && (
                                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                    {formik.values["Gallery Images"].map(
                                      (item: ImageItem, index: number) => {
                                        if (item.type === "url") {
                                          return (
                                            <div
                                              key={index}
                                              className="relative w-full aspect-square max-w-[100px]"
                                            >
                                              <Image
                                                src={item.value as string}
                                                alt={`gallery-${index}`}
                                                width={100}
                                                height={100}
                                                className="w-[100px] h-[100px] object-cover rounded-lg"
                                              />
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleRemoveImage(index)
                                                }
                                                className="absolute top-1 right-1 border cursor-pointer rounded-md p-1 shadow-lg"
                                                style={{ borderColor: colors.cardBorder, backgroundColor: colors.cardBg }}
                                              >
                                                <MdDeleteOutline className="text-red-500 text-md" />
                                              </button>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <div
                                              key={index}
                                              className="relative w-full aspect-square max-w-[100px]"
                                            >
                                              <Image
                                                src={URL.createObjectURL(
                                                  item.value as File
                                                )}
                                                alt={`gallery-${index}`}
                                                width={100}
                                                height={100}
                                                className="w-[100px] h-[100px] object-cover rounded-lg"
                                              />
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleRemoveImage(index)
                                                }
                                                className="absolute top-1 right-1 border cursor-pointer rounded-md p-1 shadow-lg"
                                                style={{ borderColor: colors.cardBorder, backgroundColor: colors.cardBg }}
                                              >
                                                <MdDeleteOutline className="text-red-500 text-md" />
                                              </button>
                                            </div>
                                          );
                                        }
                                      }
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                          {fieldError && (
                            <p className="text-red-500 text-sm mt-1">
                              {typeof formik.errors[fieldName] === "string" &&
                                formik.errors[fieldName]}
                            </p>
                          )}
                        </>
                      ) : isNumber ? (
                        <>
                          <input
                            type="number"
                            name={fieldName}
                            placeholder={field.placeholder}
                            value={
                              typeof formik.values[fieldName] === "string" ||
                              typeof formik.values[fieldName] === "number"
                                ? formik.values[fieldName]
                                : ""
                            }
                            onChange={(e) => {
                              formik.handleChange(e);
                              formik.setFieldTouched(fieldName, true, false);
                            }}
                            onBlur={formik.handleBlur}
                            className={`outline-none w-full rounded-lg px-3 py-2 ${
                              fieldError ? "border border-red-500" : ""
                            }`}
                            style={{ backgroundColor: colors.hoverBg, color: colors.textPrimary }}
                            onWheel={(e) => e.currentTarget.blur()}
                            onKeyDown={(e) => {
                              if (
                                e.key === "ArrowUp" ||
                                e.key === "ArrowDown"
                              ) {
                                e.preventDefault();
                              }
                            }}
                          />
                          {fieldError && (
                            <p className="text-red-500 text-sm mt-1">
                              {typeof formik.errors[fieldName] === "string" &&
                                formik.errors[fieldName]}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            name={fieldName}
                            placeholder={field.placeholder}
                            value={formik.values[fieldName] as string}
                            onChange={(e) => {
                              formik.handleChange(e);
                              formik.setFieldTouched(fieldName, true, false);
                            }}
                            onBlur={formik.handleBlur}
                            className={`outline-none w-full rounded-lg px-3 py-2 ${
                              fieldError ? "border border-red-500" : ""
                            }`}
                            style={{ backgroundColor: colors.hoverBg, color: colors.textPrimary }}
                          />
                          {fieldError && (
                            <p className="text-red-500 text-sm mt-1">
                              {typeof formik.errors[fieldName] === "string" &&
                                formik.errors[fieldName]}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {RichTextEditorSections.map((section) => {
          return (
            <div key={section.id} className="mt-4">
              <p className="font-bold mb-2" style={{ color: colors.textPrimary }}>{section.label}</p>
              <RichTextEditor
                value={formik.values[section.label as RichTextFieldKey] ?? ""}
                onChange={(html) => formik.setFieldValue(section.label, html)}
              />
            </div>
          );
        })}
        <div className="mt-3 flex justify-between">
          <button
            onClick={goToPrevTab}
            className="rounded-full px-[16px] py-[7px] border flex items-center gap-1 justify-center cursor-pointer font-medium"
            style={{ borderColor: colors.cardBorder, color: colors.textPrimary }}
          >
            <MdKeyboardArrowLeft />
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`rounded-full px-[16px] py-[8px] text-white flex items-center justify-center gap-2 font-medium transition-opacity hover:opacity-90 ${
              loading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            style={{ backgroundColor: colors.accent }}
          >
            {loading ? (
              "Save ..."
            ) : (
              <>
                <Tick /> Save
              </>
            )}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default YachtsUpdate;
