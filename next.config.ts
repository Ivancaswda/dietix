import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        domains: ['lh3.googleusercontent.com', 'images.unsplash.com', 'img.youtube.com']
    }
};

export default nextConfig;
