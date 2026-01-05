import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Фіскальний календар з ISO 8601",
    short_name: "Календар ISO",
    description: "Календар з фіскальними тижнями за стандартом ISO 8601 та українськими святами",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    lang: "uk",
    dir: "ltr",
    orientation: "portrait",
  };
}
