/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pub-06d66a1fe1954760a84cd11776a43309.r2.dev',
                pathname: '/**',
            },
        ],
    },
};

module.exports = nextConfig;
