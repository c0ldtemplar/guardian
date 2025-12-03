/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow cross-origin requests during development
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
  // Configure allowed dev origins to suppress the warning
  experimental: {
    allowedDevOrigins: ["192.168.3.144"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: "standalone",
};

export default nextConfig;
