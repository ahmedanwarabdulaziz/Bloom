/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // Images are already compressed to WebP on upload; serve them directly
        // instead of through Vercel's metered optimizer (returned 402 when quota ran out).
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pub-03f42476f4324996812e6d8a983be0f0.r2.dev',
                pathname: '/**',
            },
        ],
    },
};

module.exports = nextConfig;
