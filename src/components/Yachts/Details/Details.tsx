"use client"

import { useRouter } from "next/navigation";
import { MdEdit, MdKeyboardArrowLeft } from "react-icons/md";
import DOMPurify from 'dompurify';
import type { YachtListItem } from "@/lib/api/yachts";

interface CustomersProps {
    goToNextTab: () => void;
    yacht?: YachtListItem | null;
}

const Yachts: React.FC<CustomersProps> = ({ goToNextTab, yacht: yachts }) => {

    const router = useRouter();

    const GeneralInfoData = [
        {
            array: [
                { label: "Title", data: yachts?.name || "N/A" },
                { label: "Yacht Type", data: yachts?.type || "N/A" },
                { label: "Capacity", data: yachts?.capacityGuests != null ? String(yachts.capacityGuests) : "N/A" },
                { label: "Length", data: yachts?.lengthM != null ? `${yachts.lengthM}ft` : "N/A" },
                { label: "Year Built", optional: "(Optional)", data: yachts?.yearBuilt != null ? String(yachts.yearBuilt) : "N/A" },
                { label: "Status", data: yachts?.status || "N/A" },
            ],
            iconone: MdKeyboardArrowLeft,
            btn: "Back",
            icon: MdEdit,
            btnone: "Edit",
        },
    ];

    return (
        <div className="">
            {GeneralInfoData.map((section, Idx) => (
                <div key={Idx}>
                    {section.array && (
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                            {section.array
                                .filter((item) => item.data !== "N/A")
                                .map((item, idx) => (
                                    <div key={idx} className="flex">
                                        <div className="flex items-center gap-1 w-1/2">
                                            <span className="text-[#222222] font-bold">{item.label}</span>
                                            <span className="text-[#222222] font-normal text-[14px]">{item.optional}</span>
                                        </div>
                                        <span className="font-inter font-medium text-[#222222] w-1/2 break-words">{item.data}</span>
                                    </div>
                                ))}
                        </div>
                    )}
                    <div className="mt-4">
                        <h2 className="font-bold text-[#222222] mb-4">Tags</h2>
                        <div className="space-y-2">
                            {(yachts as { tags?: string[] })?.tags?.map((tag) => (
                                <div key={tag} className="flex items-center">
                                    <span className="text-[#222222] mr-2">•</span>
                                    <span className="text-[#222222] font-medium text-[14px]">{tag}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {(yachts as { dayCharter?: string })?.dayCharter?.trim() && (
                        <div className="mt-4">
                            <h2 className="font-bold text-[#222222] mb-4">Day Charter</h2>
                            <div
                                className="prose max-w-full"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((yachts as { dayCharter?: string }).dayCharter || "") }}
                            />
                        </div>
                    )}
                    {(yachts as { overnightCharter?: string })?.overnightCharter?.trim() && (
                        <div className="mt-4">
                            <h2 className="font-bold text-[#222222] mb-4">Overnight Charter</h2>
                            <div
                                className="prose max-w-full"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((yachts as { overnightCharter?: string }).overnightCharter || "") }}
                            />
                        </div>
                    )}
                    {(yachts as { aboutThisBoat?: string })?.aboutThisBoat?.trim() && (
                        <div className="mt-4">
                            <h2 className="font-bold text-[#222222] mb-4">About this Boat</h2>
                            <div
                                className="prose max-w-full"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((yachts as { aboutThisBoat?: string }).aboutThisBoat || "") }}
                            />
                        </div>
                    )}
                    {(yachts as { specifications?: string })?.specifications?.trim() && (
                        <div className="mt-4">
                            <h2 className="font-bold text-[#222222] mb-4">Specifications</h2>
                            <div
                                className="prose max-w-full"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((yachts as { specifications?: string }).specifications || "") }}
                            />
                        </div>
                    )}
                    {(yachts as { boatLayout?: string })?.boatLayout?.trim() && (
                        <div className="mt-4">
                            <h2 className="font-bold text-[#222222] mb-4">Boat Layout</h2>
                            <div
                                className="prose max-w-full"
                                dangerouslySetInnerHTML={{ __html: (yachts as { boatLayout?: string }).boatLayout || "" }}
                            />
                        </div>
                    )}
                    {(section.btn || section.btnone) && (
                        <div className="mt-3 flex justify-between">
                            {section.btn &&
                                <button onClick={() => router.push('/yachts')} className="rounded-full px-[16px] py-[7px] border border-[#666666] text-[#222222] flex items-center gap-1 justify-center cursor-pointer font-medium">
                                    {section.iconone && <section.iconone />}
                                    {section.btn}
                                </button>}
                            {section.btnone &&
                                <button onClick={goToNextTab} className="rounded-full px-[16px] py-[7px] bg-[#012A50] hover:bg-[#5F5C63] text-white text-center cursor-pointer font-medium flex items-center gap-2">
                                    {section.icon && <section.icon />}
                                    {section.btnone}
                                </button>
                            }
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default Yachts;