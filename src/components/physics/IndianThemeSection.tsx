"use client";

import React from "react";
import { useWeddingConfig } from "@/context/WeddingConfigContext";
import {
  HeritageMarqueeShell,
  ThemeMomentCard,
} from "./HeritageMarqueeShell";

const DEFAULT_INDIAN_CARDS: ThemeMomentCard[] = [
  {
    num: "01",
    corner: "🪷",
    title: "ليلة السانجيت الساحرة",
    place: "قصر راجستان",
    time: "أمسية الألوان",
    badge: "★ I",
    photo: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "02",
    corner: "✨",
    title: "أضواء الديوالي",
    place: "مومباي",
    time: "سحر الشرق",
    badge: "★ II",
    photo: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "03",
    corner: "💍",
    title: "ألحان بوليوود الخالدة",
    place: "جايبور",
    time: "غروب ذهبي",
    badge: "★ III",
    photo: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "04",
    corner: "🌺",
    title: "رقصة الحب الأبدي",
    place: "أودايبور",
    time: "ليلة القمر",
    badge: "★ IV",
    photo: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "05",
    corner: "🪷",
    title: "زهور اللوتس والياسمين",
    place: "تاج محل",
    time: "فجر جديد",
    badge: "★ V",
    photo: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "06",
    corner: "✨",
    title: "فرحة العمر",
    place: "حدائق الزعفران",
    time: "مساء دافئ",
    badge: "★ VI",
    photo: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
  },
];

const MandalaSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 160 160"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    aria-hidden="true"
  >
    <circle cx="80" cy="80" r="70" strokeDasharray="4 3" />
    <circle cx="80" cy="80" r="56" />
    <circle cx="80" cy="80" r="38" />
    <circle cx="80" cy="80" r="18" />
    <circle cx="80" cy="80" r="6" fill="currentColor" fillOpacity="0.3" />
    {Array.from({ length: 12 }).map((_, i) => {
      const deg = i * 30;
      return (
        <g key={i} transform={`rotate(${deg} 80 80)`}>
          <path d="M80 10 Q92 30 80 42 Q68 30 80 10 Z" fill="currentColor" fillOpacity="0.1" />
          <path d="M80 42 Q88 54 80 62 Q72 54 80 42 Z" />
          <circle cx="80" cy="24" r="2.2" fill="currentColor" />
        </g>
      );
    })}
  </svg>
);

export default function IndianThemeSection({
  onNext,
  scrollContainerRef,
}: {
  onNext?: () => void;
  scrollContainerRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
}) {
  const { config } = useWeddingConfig();

  return (
    <HeritageMarqueeShell
      id="section-indian"
      chapterBadge="🪷 Bollywood Nights • سحر الشرق"
      title="ليالي بوليوود"
      subtitle="Royal Colors, Saffron Lights & Eternal Romance"
      footerLabel="Bollywood Royal Celebration"
      backgroundClassName="bg-gradient-to-br from-[#b91c1c] via-[#c2410c] to-[#ea580c]"
      badgeClassName="border border-[#FDE68A]/45 bg-black/25 text-[#FDE68A]"
      titleClassName="text-[#FDE68A] drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
      subtitleClassName="text-[#FEF3C7]/90"
      accentColor="#D97706"
      footerTextClassName="text-[#FEF3C7]/85"
      audioSrc={config.audioIndian}
      groomImageSrc={config.indianGroomUrl}
      brideImageSrc={config.indianBrideUrl}
      defaultCards={DEFAULT_INDIAN_CARDS}
      galleryOffset={36}
      onNext={onNext}
      scrollContainerRef={scrollContainerRef}
      backgroundDecorations={
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[6%] top-[30%] z-[4] opacity-15 text-[#FDE68A]"
          >
            <MandalaSVG className="w-52 h-52 md:w-64 md:h-64" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[6%] top-[30%] z-[4] opacity-15 text-[#FDE68A]"
          >
            <MandalaSVG className="w-52 h-52 md:w-64 md:h-64" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 z-[3] opacity-15 text-[#FDE68A]"
          >
            <MandalaSVG className="w-[380px] h-[380px] md:w-[500px] md:h-[500px]" />
          </div>
        </>
      }
    />
  );
}

