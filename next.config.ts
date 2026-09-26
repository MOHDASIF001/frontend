import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Legacy DB rows reference bundled site images as "images/xyz.jpg", but the
// backend's /images folder doesn't have them. List what this frontend ships in
// public/images so resolveAssetUrl can serve exactly those locally and send
// everything else (admin uploads) to the backend.
function listPublicImages(dir: string, prefix = "images"): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? listPublicImages(path.join(dir, e.name), `${prefix}/${e.name}`)
      : [`${prefix}/${e.name}`],
  );
}

const nextConfig: NextConfig = {
  // Stop leaking "X-Powered-By: Next.js" on every response (flagged by SEO/security audits).
  poweredByHeader: false,

  env: {
    NEXT_PUBLIC_LOCAL_IMAGES: JSON.stringify(
      listPublicImages(path.join(process.cwd(), "public", "images")),
    ),
  },

  // Vercel's build machine is slower than local dev hardware, and a handful
  // of pages were hitting the default 60s-per-page static generation
  // timeout there even though they build in seconds locally. Give it more room.
  staticPageGenerationTimeout: 300,

  // Admin-uploaded images (packages, hotels, cabs, destinations, activities)
  // are served from the PHP backend's own domain, which is different from
  // this frontend's domain in production. next/image refuses to optimize an
  // external image unless its host is explicitly whitelisted here.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'backend.twinbholidays.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },

  // The bundled site images in public/images (logo, section icons, hero photos)
  // are served with no caching by default, so a returning visitor re-downloads
  // them on every visit (flagged by PageSpeed as "inefficient cache lifetime").
  // These are static build assets, not admin-uploaded content, so caching them
  // is safe; 30 days (not a full year) leaves headroom in case one is ever
  // swapped in place under the same filename.
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },

  // In production the frontend and the PHP API/uploads live on the same
  // domain, so admin-uploaded image paths like "/uploads/..." resolve
  // automatically. Locally they're on different origins (this dev server vs
  // XAMPP on port 80), so without this rewrite every uploaded image 404s
  // here even though the file exists and loads fine through the PHP server.
  async rewrites() {
    if (process.env.NODE_ENV !== "development") {
      return [];
    }
    return [
      {
        source: "/uploads/:path*",
        destination: "http://localhost/twin-project-3-new/uploads/:path*",
      },
      // Same problem for slider images: the admin panel saves those to the
      // project-root "images/" folder (served by PHP), not
      // frontend/public/images/. Since this is an array-return rewrite it
      // only applies after the filesystem/public folder is checked, so it
      // won't shadow any of the site's real bundled images in public/images.
      {
        source: "/images/:path*",
        destination: "http://localhost/twin-project-3-new/images/:path*",
      },
    ];
  },
};

export default nextConfig;
