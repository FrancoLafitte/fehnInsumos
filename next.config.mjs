/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.0.7"],
  images: {
    unoptimized: true,
  },
}

export default nextConfig
