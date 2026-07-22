import type { CapacitorConfig } from "@capacitor/cli";

// App Android "casca" que abre o site publicado no Vercel em tela cheia.
// Uso pessoal / sideload — assinado com a chave de debug padrao do Android.
const config: CapacitorConfig = {
  appId: "app.vercel.naniiii",
  appName: "Nani?!",
  webDir: "capacitor-www",
  server: {
    url: "https://naniiii.vercel.app",
    cleartext: false,
  },
};

export default config;
