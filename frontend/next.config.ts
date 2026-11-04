import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "props-yeah-laundry.ngrok-free.dev",
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "*.ngrok.io",
    "*.ngrok.app",
  ],
  experimental: {
    agentFeedback: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "http://requirement-prioritization-app-backend:5000/api/:path*",
      },
    ];
  },
};
export default nextConfig;
