import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for @react-pdf/renderer and Node.js built-ins (tls, dns)
  // used in scan API routes
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
