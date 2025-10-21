/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backendTarget = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    return [
      {
        source: '/chatkit/:path*',
        destination: `${backendTarget}/chatkit/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;