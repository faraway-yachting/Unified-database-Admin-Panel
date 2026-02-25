"use client"

import { useRouter } from "next/navigation";
import { FaSailboat } from "react-icons/fa6";
import type { YachtsApiResponse } from "@/lib/api/yachts";

interface BreadCrumProps {
    yacht?: YachtsApiResponse | null;
}

const BreadCrum: React.FC<BreadCrumProps> = ({ yacht }) => {

    const router = useRouter();

    return (
        <div className="flex justify-between items-center bg-white shadow-xs rounded-2xl px-3 py-5">
            <div className="flex items-center gap-3">
                <FaSailboat />
                <div className="text-[#002733] font-bold text-[20px] lg:text-[22px] xl:text-[24px] 2xl:text-[28px]">
                    Yachts Name - {yacht?.title}
                </div>
            </div>
            <button onClick={() => router.push('/yachts/addnewyachts')} className="px-[16px] py-[7px] rounded-full bg-[#012A50] hover:bg-[#5F5C63] text-center font-medium text-white cursor-pointer hover:text-white">
                + Add New Yachts
            </button>
        </div>
    );
};

export default BreadCrum;