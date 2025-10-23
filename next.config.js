/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backendTarget = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    return [
      {
        source: '/search/:path*',
        destination: `${backendTarget}/search/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
