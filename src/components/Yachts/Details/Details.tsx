"use client"

import { useRouter } from "next/navigation";
import { MdEdit, MdKeyboardArrowLeft } from "react-icons/md";
import DOMPurify from 'dompurify';
import type { YachtListItem } from "@/lib/api/yachts";

interface CustomersProps {
    goToNextTab: () => void;
    yacht?: YachtListItem | null;
}

const Yachts: React.FC<CustomersProps> = ({ goToNextTab, yacht: y }) => {

    const router = useRouter();

    const tr = y?.yacht_translations?.find(t => t.locale === 'en') ?? y?.yacht_translations?.[0];

    const GeneralInfoData = [
        { label: "Title", data: tr?.title ?? y?.name },
        { label: "Type", data: y?.type },
        { label: "Boat Type", data: y?.boat_type },
        { label: "Category", data: y?.price_category },
        { label: "Capacity", data: y?.capacity },
        { label: "Guests", data: y?.guests != null ? String(y.guests) : undefined },
        { label: "Guests Range", data: y?.guests_range },
        { label: "Length (m)", data: y?.length != null ? String(y.length) : undefined },
        { label: "Length Range", data: y?.length_range },
        { label: "Length Overall", data: y?.length_overall != null ? String(y.length_overall) : undefined },
        { label: "Cabins", data: y?.cabins != null ? String(y.cabins) : undefined },
        { label: "Bathrooms", data: y?.bathrooms != null ? String(y.bathrooms) : undefined },
        { label: "Passenger Day Trip", data: y?.passenger_day_trip != null ? String(y.passenger_day_trip) : undefined },
        { label: "Passenger Overnight", data: y?.passenger_overnight != null ? String(y.passenger_overnight) : undefined },
        { label: "Day Trip Price", data: y?.day_trip_price != null ? String(y.day_trip_price) : undefined },
        { label: "Overnight Price", data: y?.overnight_price != null ? String(y.overnight_price) : undefined },
        { label: "Daytrip Price (€)", data: y?.daytrip_price_euro != null ? String(y.daytrip_price_euro) : undefined },
        { label: "Cruising Speed", data: y?.cruising_speed },
        { label: "Fuel Capacity", data: y?.fuel_capacity },
        { label: "Water Capacity", data: y?.water_capacity },
        { label: "Design", data: y?.design },
        { label: "Built", data: y?.built },
        { label: "Badge", data: y?.badge },
        { label: "Code", data: y?.code },
        { label: "Slug", data: tr?.slug },
        { label: "Website", data: y?.website },
        { label: "Status", data: y?.status },
    ];

    const tags = y?.yacht_tags?.map(t => t.tag) ?? [];

    const richSections = [
        { label: "Day Charter", html: tr?.day_charter },
        { label: "Overnight Charter", html: tr?.overnight_charter },
        { label: "About this Boat", html: tr?.about_this_boat },
        { label: "Specifications", html: tr?.specifications },
        { label: "Boat Layout", html: tr?.boat_layout },
    ];

    return (
        <div>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                {GeneralInfoData.filter(item => item.data).map((item, idx) => (
                    <div key={idx} className="flex">
                        <span className="text-[#222222] font-bold w-1/2">{item.label}</span>
                        <span className="font-inter font-medium text-[#222222] w-1/2 break-words">{item.data}</span>
                    </div>
                ))}
            </div>

            {tags.length > 0 && (
                <div className="mt-4">
                    <h2 className="font-bold text-[#222222] mb-4">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, i) => (
                            <span key={i} className="bg-[#F0F2F4] text-[#222222] font-medium text-[14px] px-3 py-1 rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
            )}

            {richSections.map(section => section.html?.trim() && (
                <div key={section.label} className="mt-4">
                    <h2 className="font-bold text-[#222222] mb-4">{section.label}</h2>
                    <div
                        className="prose max-w-full"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.html) }}
                    />
                </div>
            ))}

            <div className="mt-3 flex justify-between">
                <button onClick={() => router.push('/yachts')} className="rounded-full px-[16px] py-[7px] border border-[#666666] text-[#222222] flex items-center gap-1 justify-center cursor-pointer font-medium">
                    <MdKeyboardArrowLeft />
                    Back
                </button>
                <button onClick={goToNextTab} className="rounded-full px-[16px] py-[7px] bg-[#012A50] hover:bg-[#5F5C63] text-white text-center cursor-pointer font-medium flex items-center gap-2">
                    <MdEdit />
                    Edit
                </button>
            </div>
        </div>
    )
}

export default Yachts;
