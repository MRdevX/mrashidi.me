import { Albert_Sans, Exo_2, JetBrains_Mono } from "next/font/google";

export const albertSans = Albert_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-albert-sans",
});

export const exo2 = Exo_2({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-exo-2",
});

export const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  preload: false,
});

export const fontVariables = `${albertSans.variable} ${exo2.variable} ${jetBrainsMono.variable}`;
