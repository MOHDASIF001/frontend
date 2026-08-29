import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel's build machine is slower than local dev hardware, and a handful
  // of pages were hitting the default 60s-per-page static generation
  // timeout there even though they build in seconds locally. Give it more room.
  staticPageGenerationTimeout: 300,

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
