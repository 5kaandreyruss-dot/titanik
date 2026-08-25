import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Titanic: The Last Chance",
    short_name: "Titanic",
    description: "An atmospheric, alternate-history survival game aboard the RMS Titanic.",
    start_url: "/",
    display: "standalone",
    background_color: "#060d16",
    theme_color: "#0a1420",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
