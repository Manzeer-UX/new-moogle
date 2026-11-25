import type { NextConfig } from "next";

/**
 * `npm run build`        -> regular Next.js build (Vercel, `next start`, any Node host).
 * `npm run build:static` -> fully static HTML in ./out for plain file hosting (Apache, IIS, S3...).
 *    Set NEXT_BASE_PATH (e.g. "/BEL/mooglelabs_next") when the site lives in a sub-folder.
 */
const isStaticExport = process.env.NEXT_OUTPUT === "export";
const basePath = process.env.NEXT_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: isStaticExport ? "export" : undefined,
  basePath,
  trailingSlash: isStaticExport,
  experimental: {
    // Inline the (small) stylesheet into the HTML: removes the only render-blocking request.
    inlineCss: true,
  },
};

export default nextConfig;
