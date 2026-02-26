import type { NextConfig } from "next";

// S3 image hostname from env (set NEXT_PUBLIC_S3_PUBLIC_URL to match backend AWS_S3_PUBLIC_URL)
const s3PublicUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL || "";
const s3Hostname = s3PublicUrl
  ? (() => {
      try {
        return new URL(s3PublicUrl).hostname;
      } catch {
        return null;
      }
    })()
  : null;

const imageDomains = [
  "res.cloudinary.com",
  "awais.thedevapp.online",
  "images.unsplash.com",
  ...(s3Hostname ? [s3Hostname] : []),
];

const nextConfig: NextConfig = {
  images: {
    domains: imageDomains,
    remotePatterns: [
      ...(s3Hostname
        ? [{ protocol: "https" as const, hostname: s3Hostname, pathname: "/**" }]
        : []),
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
        pathname: "/**",
      },
    ],
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
  },
  // Removed experimental.optimizeCss as it causes build issues
};

export default nextConfig;
