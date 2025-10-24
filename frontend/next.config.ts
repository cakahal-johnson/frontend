import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
   experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ["via.placeholder.com", "localhost", "127.0.0.1",
      "zillowrentalsolutions.com"],
  },
};

export default nextConfig;
