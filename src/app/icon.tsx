import { ImageResponse } from "next/og";

// Ícone usado em abas do navegador e resultados de busca.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#d5493f",
          color: "#ffffff",
          fontSize: 300,
          fontWeight: 800,
          letterSpacing: "-0.05em",
        }}
      >
        ?!
      </div>
    ),
    { ...size }
  );
}
