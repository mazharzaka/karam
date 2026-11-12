"use client";

import React from "react";
import { useWeddingConfig } from "@/context/WeddingConfigContext";
import {
  HeritageMarqueeShell,
  ThemeMomentCard,
} from "./HeritageMarqueeShell";

const DEFAULT_FATIMID_CARDS: ThemeMomentCard[] = [
  {
    num: "01",
    corner: "☪️",
    title: "ليالي شارع المعز لدين الله",
    place: "القاهرة الفاطمية",
    time: "سحر التاريخ",
    badge: "★ I",
    photo: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "02",
    corner: "🕌",
    title: "فوانيس المماليك الذهبية",
    place: "خان الخليلي",
    time: "نور المحروسة",
    badge: "★ II",
    photo: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "03",
    corner: "✨",
    title: "عقد قران مبارك",
    place: "مسجد السلطان حسن",
    time: "لحظة السكينة",
    badge: "★ III",
    photo: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "04",
    corner: "🌙",
    title: "مآذن وقباب من ذهب",
    place: "قلعة صلاح الدين",
    time: "غروب ذهبي",
    badge: "★ IV",
    photo: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "05",
    corner: "✦",
    title: "نقوش أرابيسك خالدة",
    place: "بيت السحيمي",
    time: "أمسية هادئة",
    badge: "★ V",
    photo: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "06",
    corner: "🤍",
    title: "مودة ورحمة للأبد",
    place: "حديقة الأزهر",
    time: "ليلة العمر",
    badge: "★ VI",
    photo: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
  },
];

const IslamicGeometricStarPatternSVG: React.FC = () => (
  <svg
    className="h-full w-full"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <pattern
        id="fatimidIslamicStarPattern"
        width="120"
        height="120"
        patternUnits="userSpaceOnUse"
      >
        {/* Outer Octagonal Geometric Lattice */}
        <polygon
          points="60,6 98,22 114,60 98,98 60,114 22,98 6,60 22,22"
          fill="none"
          stroke="#D97706"
          strokeWidth="1.4"
        />
        {/* 8-Pointed Rub el Hizb / Khatam Star (Two Overlapping Squares) */}
        <rect
          x="26"
          y="26"
          width="68"
          height="68"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1.5"
        />
        <rect
          x="26"
          y="26"
          width="68"
          height="68"
          transform="rotate(45 60 60)"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1.5"
        />
        {/* Inner 8-Pointed Star Rosette */}
        <circle
          cx="60"
          cy="60"
          r="20"
          fill="none"
          stroke="#D97706"
          strokeWidth="1.2"
        />
        <polygon
          points="60,44 66,54 76,60 66,66 60,76 54,66 44,60 54,54"
          fill="#D97706"
          fillOpacity="0.35"
          stroke="#F59E0B"
          strokeWidth="1"
        />
        {/* Interlocking Corner Diamonds */}
        <polygon points="0,0 16,0 0,16" fill="none" stroke="#D97706" strokeWidth="1" />
        <polygon points="120,0 104,0 120,16" fill="none" stroke="#D97706" strokeWidth="1" />
        <polygon points="0,120 16,120 0,104" fill="none" stroke="#D97706" strokeWidth="1" />
        <polygon points="120,120 104,120 120,104" fill="none" stroke="#D97706" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#fatimidIslamicStarPattern)" />
  </svg>
);

export default function FatimidThemeSection({
  onNext,
  scrollContainerRef,
}: {
  onNext?: () => void;
  scrollContainerRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
}) {
  const { config } = useWeddingConfig();
  const section = config.sections?.fatimid;

  return (
    <HeritageMarqueeShell
      id="section-fatimid"
      chapterBadge={section?.chapterBadge || "☪️ التراث الفاطمي والمملوكي • ليالي المعز"}
      title={section?.title || "ليالي القاهرة الفاطمية"}
      subtitle={section?.subtitle || "Fatimid & Mamluk Cairo • Antique Gold & Emerald Majesty"}
      footerLabel={section?.footerLabel || "Fatimid Islamic Heritage Celebration"}
      backgroundClassName="bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950"
      badgeClassName="border border-amber-500/40 bg-emerald-950/80 text-amber-500"
      titleClassName="text-amber-500 drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]"
      subtitleClassName="text-amber-500 font-semibold"
      accentColor="#D97706"
      footerTextClassName="text-amber-500/85"
      audioSrc={config.audioFatimid || section?.audioSrc || "/audio/fatami.mp3"}
      groomImageSrc={config.fatimidGroomUrl || section?.groomImage || "/statues/saidi-man.png"}
      brideImageSrc={config.fatimidBrideUrl || section?.brideImage || "/statues/saidi-woman.png"}
      flipGroom
      defaultCards={section?.cards?.length ? section.cards : DEFAULT_FATIMID_CARDS}
      galleryOffset={48}
      onNext={onNext}
      scrollContainerRef={scrollContainerRef}
      backgroundDecorations={
        <>
          {/* Repeating 8-Point Islamic Geometric Star Wall Texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
          >
            <IslamicGeometricStarPatternSVG />
          </div>

          {/* Top-Left Background: Antique Hanging Fatimid Lantern */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fatimid-lantern.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute left-4 md:left-12 top-0 z-0 w-44 sm:w-56 md:w-72 h-auto object-contain opacity-20 mix-blend-luminosity"
          />

          {/* Top-Right Background: Ornate Fatimid Filigree Crescent */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fatimid-crescent.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute right-4 md:right-12 top-6 z-0 w-48 sm:w-64 md:w-80 h-auto object-contain opacity-20 mix-blend-luminosity"
          />
        </>
      }
    />
  );
}

