"use client";

import React from "react";
import { useWeddingConfig } from "@/context/WeddingConfigContext";
import {
  HeritageMarqueeShell,
  ThemeMomentCard,
} from "./HeritageMarqueeShell";

const DEFAULT_AHLY_CARDS: ThemeMomentCard[] = [
  {
    num: "01",
    corner: "🦅",
    title: "أعظم نادي في الكون",
    place: "ستاد مختار التتش",
    time: "ليلة اللقب",
    badge: "★ 1907",
    photo: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "02",
    corner: "🏆",
    title: "نادي القرن الإفريقي",
    place: "التالتة شمال",
    time: "لحظة انتصار",
    badge: "★ XI",
    photo: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "03",
    corner: "❤️",
    title: "الأهلي فوق الجميع",
    place: "القاهرة",
    time: "ساعة الفرح",
    badge: "★ IX",
    photo: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "04",
    corner: "🦅",
    title: "فرحتنا بالأحمر الملكي",
    place: "الجزيرة",
    time: "مساء المجد",
    badge: "★ C",
    photo: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "05",
    corner: "⚽",
    title: "دائماً على القمة",
    place: "ستاد القاهرة",
    time: "اللحظة الذهبية",
    badge: "★ XII",
    photo: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "06",
    corner: "🏆",
    title: "حب يجمعنا مدى الحياة",
    place: "القلعة الحمراء",
    time: "أمسية ساحرة",
    badge: "★ 1",
    photo: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
  },
];

const EagleSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 160 120"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Spread Wings */}
    <path d="M80 48 C62 22 30 14 8 24 C20 38 34 44 52 50 C34 52 22 60 14 70 C34 70 54 64 68 58" />
    <path d="M80 48 C98 22 130 14 152 24 C140 38 126 44 108 50 C126 52 138 60 146 70 C126 70 106 64 92 58" />
    {/* Eagle Head & Shield Body */}
    <path d="M74 30 C76 18 86 16 90 22 C87 24 85 28 86 34 L80 42 Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M68 48 L80 40 L92 48 L88 86 L80 102 L72 86 Z" fill="currentColor" fillOpacity="0.14" />
    <line x1="80" y1="42" x2="80" y2="100" />
  </svg>
);

const StadiumSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 220 120"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
  >
    <ellipse cx="110" cy="70" rx="95" ry="34" />
    <ellipse cx="110" cy="64" rx="76" ry="24" strokeDasharray="4 4" />
    <rect x="74" y="54" width="72" height="26" rx="3" />
    <line x1="110" y1="54" x2="110" y2="80" />
    <circle cx="110" cy="67" r="7" />
    {/* Floodlights */}
    <line x1="36" y1="44" x2="26" y2="14" strokeWidth="2.5" />
    <line x1="184" y1="44" x2="194" y2="14" strokeWidth="2.5" />
    <rect x="16" y="8" width="20" height="8" rx="2" fill="currentColor" fillOpacity="0.25" />
    <rect x="184" y="8" width="20" height="8" rx="2" fill="currentColor" fillOpacity="0.25" />
  </svg>
);

export default function AlAhlyThemeSection({
  onNext,
  scrollContainerRef,
}: {
  onNext?: () => void;
  scrollContainerRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
}) {
  const { config } = useWeddingConfig();

  return (
    <HeritageMarqueeShell
      id="section-ahly"
      chapterBadge="🦅 Al Ahly SC • القلعة الحمراء"
      title="نادي القرن"
      subtitle="The Red Devils • Club of the Century"
      footerLabel="Al Ahly SC Celebration Marquee"
      backgroundClassName="bg-red-700 bg-gradient-to-b from-red-700 via-red-900 to-[#3B060B]"
      badgeClassName="border border-[#F2D98D]/40 bg-black/30 text-[#F2D98D]"
      titleClassName="text-[#F2D98D] drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]"
      subtitleClassName="text-[#FDE68A]/90"
      accentColor="#D4AF37"
      footerTextClassName="text-[#FDE68A]/85"
      audioSrc={config.audioAhly}
      groomImageSrc={config.ahlyGroomUrl}
      brideImageSrc={config.ahlyBrideUrl}
      defaultCards={DEFAULT_AHLY_CARDS}
      galleryOffset={30}
      onNext={onNext}
      scrollContainerRef={scrollContainerRef}
      backgroundDecorations={
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[8%] top-[28%] z-[4] opacity-15 text-[#F2D98D]"
          >
            <EagleSVG className="w-48 h-36 md:w-64 md:h-48" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[8%] top-[28%] z-[4] opacity-15 text-[#F2D98D]"
          >
            <EagleSVG className="w-48 h-36 md:w-64 md:h-48" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 z-[3] opacity-10 text-[#F2D98D]"
          >
            <StadiumSVG className="w-[460px] h-[250px] md:w-[620px] md:h-[340px]" />
          </div>
        </>
      }
    />
  );
}

