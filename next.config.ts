import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // pdfkit loads its standard-font .afm files from disk at runtime; Next's
  // file tracer doesn't follow that dynamic require, so the receipt route's
  // serverless bundle needs them included explicitly or PDF generation
  // fails in production with an ENOENT it never hits locally.
  outputFileTracingIncludes: {
    "/api/admin/shipments/**": ["./node_modules/pdfkit/js/data/**/*"],
  },
};

export default nextConfig;
