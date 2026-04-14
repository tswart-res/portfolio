import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Local media served from /public/media — no remote patterns needed
    // sharp is installed for optimisation in standalone mode
  },
};

export default nextConfig;
