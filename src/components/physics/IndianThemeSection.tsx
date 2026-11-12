"use client";

import React from "react";
import { useWeddingConfig, isImageFlipped } from "@/context/WeddingConfigContext";
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

const MandalaTilePatternSVG: React.FC = () => (
  <svg
    className="h-full w-full"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <pattern
        id="indianMandalaPattern"
        width="160"
        height="160"
        patternUnits="userSpaceOnUse"
      >
        {/* Concentric Gold Mandala Rings */}
        <circle cx="80" cy="80" r="68" fill="none" stroke="#FBBF24" strokeWidth="1.2" strokeDasharray="4 4" />
        <circle cx="80" cy="80" r="50" fill="none" stroke="#EC4899" strokeWidth="1.1" />
        <circle cx="80" cy="80" r="28" fill="none" stroke="#FBBF24" strokeWidth="1.2" />
        {/* 8-Petal Royal Lotus */}
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 45} 80 80)`}>
            <path
              d="M80 12 Q92 34 80 50 Q68 34 80 12 Z"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="1.1"
            />
            <path
              d="M80 50 Q86 64 80 72 Q74 64 80 50 Z"
              fill="#EC4899"
              fillOpacity="0.25"
              stroke="#EC4899"
              strokeWidth="0.9"
            />
            <circle cx="80" cy="22" r="2" fill="#EC4899" />
          </g>
        ))}
        {/* Corner Ornamental Dots */}
        <circle cx="0" cy="0" r="10" fill="none" stroke="#FBBF24" strokeWidth="1" />
        <circle cx="160" cy="0" r="10" fill="none" stroke="#FBBF24" strokeWidth="1" />
        <circle cx="0" cy="160" r="10" fill="none" stroke="#FBBF24" strokeWidth="1" />
        <circle cx="160" cy="160" r="10" fill="none" stroke="#FBBF24" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#indianMandalaPattern)" />
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
  const section = config.sections?.indian;

  return (
    <HeritageMarqueeShell
      id="section-indian"
      chapterBadge={section?.chapterBadge || "🪷 Maharaja Palace • ليالي بوليوود"}
      title={section?.title || "ليالي بوليوود"}
      subtitle={section?.subtitle || "Maharaja Palace • Royal Teal, Magenta & Eternal Gold"}
      footerLabel={section?.footerLabel || "Maharaja Palace Royal Celebration"}
      backgroundClassName="bg-gradient-to-br from-teal-900 via-sky-900 to-indigo-950"
      badgeClassName="border border-pink-400/50 bg-indigo-950/60 text-pink-300"
      titleClassName="text-amber-300 drop-shadow-[0_4px_18px_rgba(236,72,153,0.45)]"
      subtitleClassName="text-pink-300 font-semibold"
      accentColor="#EC4899"
      footerTextClassName="text-amber-200/85"
      audioSrc={config.audioIndian || section?.audioSrc || "/audio/pharaonic-track.mp3"}
      groomImageSrc={config.indianGroomUrl || section?.groomImage || "/statues/tutankhamun.png"}
      brideImageSrc={config.indianBrideUrl || section?.brideImage || "/statues/nefertiti.png"}
      flipGroom={isImageFlipped(config, "indianGroomUrl", false)}
      flipBride={isImageFlipped(config, "indianBrideUrl", false)}
      defaultCards={section?.cards?.length ? section.cards : DEFAULT_INDIAN_CARDS}
      galleryOffset={36}
      onNext={onNext}
      scrollContainerRef={scrollContainerRef}
      backgroundDecorations={
        <>
          {/* Repeating Gold & Magenta Mandala Lattice Backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-10"
          >
            <MandalaTilePatternSVG />
          </div>

          {/* Flanking Ornamental Royal Mandalas */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[6%] top-[30%] z-0 opacity-10 text-amber-400"
          >
            <MandalaSVG className="w-52 h-52 md:w-64 md:h-64" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[6%] top-[30%] z-0 opacity-10 text-pink-400"
          >
            <MandalaSVG className="w-52 h-52 md:w-64 md:h-64" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 z-0 opacity-10 text-amber-300"
          >
            <MandalaSVG className="w-[380px] h-[380px] md:w-[500px] md:h-[500px]" />
          </div>
        </>
      }
    />
  );
}

