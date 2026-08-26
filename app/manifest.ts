import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI Pet",
    short_name: "AI Pet",
    description: "Вырасти живого ИИ-питомца, который правда тебя помнит.",
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
