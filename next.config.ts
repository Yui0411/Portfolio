import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a minimal, self-contained server bundle in .next/standalone so the
  // Docker image only needs to copy that + static assets (small final image).
  output: "standalone",
};

export default nextConfig;
