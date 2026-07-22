import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nani?! — estude japonês competindo",
    short_name: "Nani?!",
    description:
      "Aprenda hiragana, katakana e kanji pelos níveis JLPT, com flashcards, competição e desafios entre amigos.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#d5493f",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
