/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/api/uploads/[file]": ["./node_modules/ffmpeg-static/ffmpeg*"],
  },
};

export default nextConfig;
