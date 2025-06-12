/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['www.gravatar.com', 'lh3.googleusercontent.com'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
