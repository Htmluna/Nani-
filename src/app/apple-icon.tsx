import { ImageResponse } from "next/og";

// Ícone do atalho "Adicionar à Tela de Início" no iOS/iPadOS.
// O iOS aplica o próprio arredondamento, então usamos um quadrado cheio.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 108,
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
