"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdEdit, MdKeyboardArrowLeft } from "react-icons/md";
import { FaSailboat } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useYachtByIdQuery, type YachtListItem, type YachtTranslation, type YachtGalleryImage, type YachtTag } from "@/lib/api/yachts";
import YachtsUpdate from "./Update";

interface YachtsDetailProps {
    id: string | number;
    defaultEdit?: boolean;
}


function getEmbedUrl(url?: string | null) {
    if (!url) return "";
    const yt = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const ytb = url.match(/(?:https?:\/\/)?youtu\.be\/([\w-]+)/);
    if (ytb) return `https://www.youtube.com/embed/${ytb[1]}`;
    return url;
}

const PURIFY_CONFIG = {
    ADD_ATTR: ["style", "class", "bgcolor", "color", "border", "cellpadding", "cellspacing", "width", "height", "align", "valign", "colspan", "rowspan", "target", "rel"],
    ADD_TAGS: ["table", "thead", "tbody", "tfoot", "tr", "th", "td", "colgroup", "col"],
};

const YachtsDetail: React.FC<YachtsDetailProps> = ({ id, defaultEdit = false }) => {
    const router = useRouter();
    const { colors } = useTheme();
    const [editing, setEditing] = useState(defaultEdit);
    const [richHtml, setRichHtml] = useState<Record<string, string>>({});
    const [locale, setLocale] = useState("en");
    const { data, isLoading } = useYachtByIdQuery(id as string);
    const y: YachtListItem | null = data?.yachts ?? null;
    const availableLocales = y?.translations?.map((t: YachtTranslation) => t.locale) ?? [];
    const tr: YachtTranslation | undefined = y?.translations?.find((t: YachtTranslation) => t.locale === locale) ?? y?.translations?.[0];
    const title = tr?.title ?? y?.name ?? y?.boatType ?? "—";

    useEffect(() => {
        if (!tr) return;
        import("dompurify").then(({ default: DOMPurify }) => {
            const map: Record<string, string> = {};
            [
                { label: "Day Charter", html: tr.dayCharter },
                { label: "Overnight Charter", html: tr.overnightCharter },
                { label: "About this Boat", html: tr.aboutThisBoat },
                { label: "Specifications", html: tr.specifications },
                { label: "Boat Layout", html: tr.boatLayout },
            ].forEach(s => {
                if (s.html?.trim()) map[s.label] = DOMPurify.sanitize(s.html, PURIFY_CONFIG);
            });
            setRichHtml(map);
        });
    }, [tr]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-112px)]" style={{ backgroundColor: colors.background }}>
                <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: colors.accent }} />
            </div>
        );
    }

    if (editing) {
        return (
            <div className="mt-4" style={{ backgroundColor: colors.background }}>
                <div className="rounded-2xl px-5 py-5" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
                    <YachtsUpdate goToPrevTab={() => setEditing(false)} id={id} />
                </div>
            </div>
        );
    }

    const guestsVal = y?.guests ?? (y?.capacityGuests != null ? String(y.capacityGuests) : undefined);
    const lengthVal = y?.length ? `${y.length}ft` : (y?.lengthM != null ? `${y.lengthM}m` : undefined);
    const builtVal = y?.built ?? (y?.yearBuilt != null ? String(y.yearBuilt) : undefined);
    const cruiseVal = y?.cruisingSpeed ?? (y?.cruiseSpeedKnots != null ? `${y.cruiseSpeedKnots} knots` : undefined);
    const fuelVal = y?.fuelCapacity ?? (y?.fuelCapacityL != null ? `${y.fuelCapacityL}L` : undefined);

    const leftFields = [
        { label: "Title", value: title },
        { label: "Yacht Type", value: y?.type },
        { label: "Capacity", value: y?.capacity },
        { label: "Cabins", value: y?.cabins ?? undefined },
        { label: "Passenger Day Trip", value: y?.passengerDayTrip ?? undefined },
        { label: "Guests", value: guestsVal },
        { label: "Day Trip Price", value: y?.dayTripPrice ?? undefined },
        { label: "Day Trip Price Euro", value: y?.daytripPriceEuro ? `${y.daytripPriceEuro}€` : undefined },
    ];

    const rightFields = [
        { label: "Boat Type", value: y?.boatType ?? undefined },
        { label: "Charter Type", value: y?.charterType ?? undefined },
        { label: "Length", value: lengthVal },
        { label: "Bathrooms", value: y?.bathrooms ?? undefined },
        { label: "Passenger Overnight", value: y?.passengerOvernight ?? undefined },
        { label: "Guests Range", value: y?.guestsRange ?? undefined },
        { label: "Overnight Price", value: y?.overnightPrice ?? undefined },
        { label: "Length Range", value: y?.lengthRange ?? undefined, optional: true },
        { label: "Cruising Speed", value: cruiseVal },
        { label: "Fuel Capacity", value: fuelVal },
        { label: "Water Capacity", value: y?.waterCapacity ?? undefined },
        { label: "Design", value: y?.design ?? undefined },
        { label: "Built", value: builtVal },
        { label: "Badge", value: y?.badge ?? undefined },
        { label: "Code", value: y?.code ?? undefined },
        { label: "Status", value: y?.status },
    ];

    const galleryImages: YachtGalleryImage[] = (y?.images ?? []).filter(i => i.imageUrl?.startsWith('http'));
    const rawCover = y?.primaryImage?.startsWith('http') ? y.primaryImage : null;
    const coverUrl = rawCover ?? galleryImages.find(i => i.isCover)?.imageUrl ?? galleryImages[0]?.imageUrl ?? null;
    const rawTags: YachtTag[] = y?.tags ?? [];
    const enTags = rawTags.filter(t => t.locale === "en");
    const tagSource = enTags.length > 0 ? enTags : rawTags;
    const tags: string[] = [...new Set(tagSource.map(t => t.tag))];

    const richSections = [
        { label: "Day Charter", html: tr?.dayCharter },
        { label: "Overnight Charter", html: tr?.overnightCharter },
        { label: "About this Boat", html: tr?.aboutThisBoat },
        { label: "Specifications", html: tr?.specifications },
        { label: "Boat Layout", html: tr?.boatLayout },
    ];

    const divider = { borderColor: colors.cardBorder };

    return (
        <div style={{ backgroundColor: colors.background }}>
            <div
                className="flex justify-between items-center rounded-2xl px-4 py-4 mb-4"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
            >
                <div className="flex items-center gap-3">
                    <FaSailboat style={{ color: colors.accent }} />
                    <span className="font-bold text-[20px] lg:text-[24px]" style={{ color: colors.textPrimary }}>
                        Yachts Name - {title}
                    </span>
                    {availableLocales.length > 1 && (
                        <div className="flex gap-1 ml-2">
                            {availableLocales.map(l => (
                                <button
                                    key={l}
                                    onClick={() => setLocale(l)}
                                    className="px-2 py-0.5 rounded text-xs font-semibold uppercase transition-opacity hover:opacity-80"
                                    style={{
                                        backgroundColor: locale === l ? colors.accent : colors.hoverBg,
                                        color: locale === l ? "#000" : colors.textSecondary,
                                        border: `1px solid ${colors.cardBorder}`,
                                    }}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    onClick={() => router.push("/yachts/addnewyachts")}
                    className="px-[16px] py-[7px] rounded-full font-medium cursor-pointer transition-opacity hover:opacity-80"
                    style={{ backgroundColor: colors.accent, color: "#000" }}
                >
                    + Add New Yachts
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                <div
                    className="w-full lg:w-[70%] xl:w-[75%] rounded-2xl px-5 py-5"
                    style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
                >
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 pb-5 mb-5 border-b" style={divider}>
                        {leftFields.filter(f => f.value).map((f, i) => (
                            <div key={i}>
                                <div className="text-xs font-bold mb-0.5" style={{ color: colors.textSecondary }}>{f.label}</div>
                                <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>{f.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 pb-5 mb-5 border-b" style={divider}>
                        {rightFields.filter(f => f.value).map((f, i) => (
                            <div key={i}>
                                <div className="text-xs font-bold mb-0.5" style={{ color: colors.textSecondary }}>
                                    {f.label}
                                    {f.optional && <span className="font-normal ml-1" style={{ color: colors.textSecondary }}>(Optional)</span>}
                                </div>
                                <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>{f.value}</div>
                            </div>
                        ))}
                    </div>

                    {tags.length > 0 && (
                        <div className="pb-5 mb-5 border-b" style={divider}>
                            <div className="text-xs font-bold mb-2" style={{ color: colors.textSecondary }}>Tags</div>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag: string, i: number) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-full text-xs font-medium"
                                        style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        {richSections.map(s => richHtml[s.label] && (
                            <div key={s.label} className="pb-5 mb-5 border-b last:border-0 last:mb-0 last:pb-0" style={divider}>
                                <div className="text-sm font-bold mb-3" style={{ color: colors.textPrimary }}>{s.label}</div>
                                <div
                                    className="rich-html-content max-w-full text-sm overflow-x-auto"
                                    style={{ color: colors.textPrimary }}
                                    dangerouslySetInnerHTML={{ __html: richHtml[s.label] }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between pt-4 border-t mt-4" style={divider}>
                        <button
                            onClick={() => router.push("/yachts")}
                            className="rounded-full px-[16px] py-[7px] border flex items-center gap-1 cursor-pointer font-medium text-sm transition-opacity hover:opacity-80"
                            style={{ borderColor: colors.cardBorder, color: colors.textPrimary, backgroundColor: colors.hoverBg }}
                        >
                            <MdKeyboardArrowLeft /> Back
                        </button>
                        <button
                            onClick={() => setEditing(true)}
                            className="rounded-full px-[16px] py-[7px] flex items-center gap-2 cursor-pointer font-medium text-sm transition-opacity hover:opacity-80"
                            style={{ backgroundColor: colors.accent, color: "#000" }}
                        >
                            <MdEdit /> Edit
                        </button>
                    </div>
                </div>

                <div className="w-full lg:w-[30%] xl:w-[26%] flex flex-col gap-3">
                    <div className="rounded-2xl px-3 py-3" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
                        <p className="font-bold text-[16px] mb-2 pb-2 border-b" style={{ color: colors.textPrimary, borderColor: colors.cardBorder }}>
                            Primary Image
                        </p>
                        <div className="rounded-lg overflow-hidden flex justify-center" style={{ border: `1px solid ${colors.cardBorder}` }}>
                            {coverUrl ? (
                                <Image src={coverUrl} alt="primary" width={296} height={200} className="object-cover w-full" />
                            ) : (
                                <p className="p-4 text-sm" style={{ color: colors.textSecondary }}>No featured image</p>
                            )}
                        </div>
                    </div>

                    {galleryImages.length > 0 && (
                        <div className="rounded-2xl px-3 py-3" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
                            <p className="font-bold text-[16px] mb-2 pb-2 border-b" style={{ color: colors.textPrimary, borderColor: colors.cardBorder }}>
                                Gallery Images
                            </p>
                            <div className="rounded-lg p-1.5" style={{ border: `1px solid ${colors.cardBorder}` }}>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {galleryImages.map((img: YachtGalleryImage, idx: number) => (
                                        <Image
                                            key={img.id ?? idx}
                                            src={img.imageUrl}
                                            alt={`Gallery ${idx + 1}`}
                                            width={100}
                                            height={70}
                                            className="rounded-md w-full h-[70px] object-cover"
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end mt-2">
                                <button
                                    className="rounded-full px-[14px] py-[6px] flex items-center gap-2 text-sm cursor-pointer font-medium transition-opacity hover:opacity-80"
                                    style={{ backgroundColor: colors.accent, color: "#000" }}
                                    onClick={() => {
                                        const html = `<html><head><style>body{font-family:sans-serif;padding:20px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;background:#f9f9f9}img{width:100%;height:300px;object-fit:cover;border-radius:8px}</style></head><body>${galleryImages.map((img: YachtGalleryImage) => `<img src="${img.imageUrl}" />`).join("")}</body></html>`;
                                        const win = window.open();
                                        if (win) { win.document.write(html); win.document.close(); }
                                    }}
                                >
                                    See All <IoEyeOutline />
                                </button>
                            </div>
                        </div>
                    )}

                    {y?.videoLink?.trim() && (
                        <div className="rounded-2xl px-3 py-3" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
                            <p className="font-bold text-[16px] mb-2 pb-2 border-b" style={{ color: colors.textPrimary, borderColor: colors.cardBorder }}>
                                Video
                            </p>
                            <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${colors.cardBorder}` }}>
                                <iframe
                                    src={getEmbedUrl(y.videoLink)}
                                    width="100%"
                                    height="160"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                    allowFullScreen
                                    className="block"
                                    title="Yacht Video"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default YachtsDetail;
