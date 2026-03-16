"use client"

import Image from "next/image";
import { IoEyeOutline } from "react-icons/io5";
import type { YachtListItem } from "@/lib/api/yachts";

interface YachtProps {
    yacht?: YachtListItem | null;
}

function getEmbedUrl(url?: string | null) {
    if (!url) return '';
    const youtubeMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/);
    if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    const youtuBeMatch = url.match(/(?:https?:\/\/)?youtu\.be\/([\w-]+)/);
    if (youtuBeMatch) return `https://www.youtube.com/embed/${youtuBeMatch[1]}`;
    return url;
}

const Yachts: React.FC<YachtProps> = ({ yacht: y }) => {
    const galleryImages = y?.yacht_gallery_images ?? [];
    const coverUrl = y?.primary_image ?? galleryImages[0]?.image_url ?? null;
    const videoLink = y?.video_link ?? null;

    return (
        <div className="flex flex-col gap-3">
            <div className="bg-white shadow-xs rounded-lg px-2 py-2 w-full">
                <p className="text-[#001B48] font-bold text-[18px] mb-2 pb-2 border-b border-[#CCCCCC]">
                    Primary Image
                </p>
                <div className="border border-[#CCCCCC] p-1.5 rounded-lg flex justify-center">
                    {coverUrl ? (
                        <Image src={coverUrl} alt="primary" width={296} height={158} className="rounded-lg object-cover" />
                    ) : (
                        <p className="text-gray-500 p-4">No featured image</p>
                    )}
                </div>
            </div>

            <div className="bg-white shadow-xs rounded-lg px-2 py-2 w-full">
                <p className="text-[#001B48] font-bold text-[18px] mb-2 pb-2 border-b border-[#CCCCCC]">
                    Gallery Images
                </p>
                <div className="border border-[#CCCCCC] p-1.5 rounded-lg flex justify-center">
                    {galleryImages.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {galleryImages.map((img, index) => (
                                <div key={img.id ?? index} className="w-full h-auto">
                                    <Image
                                        src={img.image_url}
                                        alt={`Gallery Image ${index + 1}`}
                                        width={400}
                                        height={250}
                                        className="rounded-lg w-full h-[70px] 2xl:h-[90px] object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 p-4">No gallery images</p>
                    )}
                </div>
                {galleryImages.length > 0 && (
                    <div className="flex justify-end mt-4">
                        <button
                            className="rounded-full px-[16px] py-[7px] bg-[#001B48] flex items-center gap-2 hover:bg-[#222222] text-white text-center cursor-pointer font-medium"
                            onClick={() => {
                                const html = `<html><head><style>body{font-family:sans-serif;padding:20px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;background:#f9f9f9}img{width:100%;height:300px;object-fit:cover;border-radius:8px}</style></head><body>${galleryImages.map(img => `<img src="${img.image_url}" alt="Gallery Image" />`).join("")}</body></html>`;
                                const win = window.open();
                                if (win) { win.document.write(html); win.document.close(); }
                            }}
                        >
                            See All <IoEyeOutline />
                        </button>
                    </div>
                )}
            </div>

            {videoLink?.trim() && (
                <div className="bg-white shadow-xs rounded-lg px-2 py-2 w-full">
                    <p className="text-[#001B48] font-bold text-[18px] mb-2 pb-2 border-b border-[#CCCCCC]">
                        Video URL
                    </p>
                    <div className="border border-[#CCCCCC] p-1.5 rounded-lg flex justify-center">
                        <iframe
                            src={getEmbedUrl(videoLink)}
                            width="296"
                            height="158"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                            className="rounded-lg w-full"
                            title="Yacht Video"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Yachts;
