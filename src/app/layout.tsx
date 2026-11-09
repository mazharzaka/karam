import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import { WeddingConfigProvider } from "@/context/WeddingConfigContext";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FDECEF",
};

export const metadata: Metadata = {
  title: "Romantic Wrapped 2025 | A Cinematic Experience",
  description:
    "An Awwwards-grade interactive cinematic desktop experience celebrating our love story, milestones, and memories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full overflow-hidden select-none">
      <body
        className={`${playfair.variable} ${plusJakarta.variable} ${caveat.variable} font-sans h-full w-full overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FDECEF] to-[#FCE4EC] text-romantic-charcoal`}
      >
        <WeddingConfigProvider>{children}</WeddingConfigProvider>
      </body>
    </html>
  );
}
