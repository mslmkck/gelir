import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Modern Full-Stack App",
    short_name: "Modern App",
    description:
      "A modern full-stack starter with offline-ready PWA support, built with Next.js, TypeScript, and Tailwind CSS.",
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#6366f1",
    lang: "en",
    orientation: "any",
    categories: ["productivity", "developer", "utilities"],
    icons: [
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
    screenshots: [
      {
        src: "/icons/screenshot-light.svg",
        sizes: "1280x720",
        type: "image/svg+xml",
        form_factor: "wide",
      },
    ],
    shortcuts: [
      {
        name: "Open dashboard",
        short_name: "Dashboard",
        url: "/",
      },
      {
        name: "Launch offline mode",
        short_name: "Offline",
        url: "/offline",
      },
    ],
    related_applications: [],
  };
}
