"use client";

import { useRouter } from "next/navigation";
import { IoIosPricetags } from "react-icons/io";
import type { TagsApiResponse } from "@/lib/api/tags";

interface BreadCrumProps {
  showGeneralInfo: boolean;
  tag?: TagsApiResponse | null;
}

const BreadCrum: React.FC<BreadCrumProps> = ({ showGeneralInfo, tag: tags }) => {
  const router = useRouter();

  const handleAddNewVehicle = () => {
    router.push("/tags/addnewtags");
  };

  return (
    <div className="flex justify-between items-center bg-white shadow-xs rounded-2xl px-3 py-5">
      <div className="flex items-center gap-3">
        <IoIosPricetags />
        <div className="text-[#002733] font-bold text-[20px] lg:text-[22px] xl:text-[24px] 2xl:text-[28px]">
          Tag Name - {tags?.Name}
        </div>
      </div>
      {!showGeneralInfo && (
        <button
          className="px-[16px] py-[7px] rounded-full bg-[#012A50] hover:bg-[#5F5C63] text-center font-medium text-white cursor-pointer hover:text-white"
          onClick={handleAddNewVehicle}
        >
          + Add New Tags
        </button>
      )}
    </div>
  );
};

export default BreadCrum;
