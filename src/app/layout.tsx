import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import { WeddingConfigProvider } from "@/context/WeddingConfigContext";
import { AssetProtectionGuard } from "@/components/AssetProtectionGuard";
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
  title: "Our Wedding Story | A Cinematic Experience",
  description:
    "An interactive cinematic experience celebrating our love story, milestones, and memories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-full w-full">
      <body
        className={`${playfair.variable} ${plusJakarta.variable} ${caveat.variable} font-sans min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FDECEF] to-[#FCE4EC] text-romantic-charcoal`}
      >
        <WeddingConfigProvider>
          <AssetProtectionGuard />
          {children}
        </WeddingConfigProvider>
      </body>
    </html>
  );
}
