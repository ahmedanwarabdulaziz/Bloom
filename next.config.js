/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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
