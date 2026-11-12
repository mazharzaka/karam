"use client";

import React from "react";
import { useWeddingConfig, isImageFlipped } from "@/context/WeddingConfigContext";
import {
  HeritageMarqueeShell,
  ThemeMomentCard,
} from "./HeritageMarqueeShell";

const DEFAULT_MEXICAN_CARDS: ThemeMomentCard[] = [
  {
    num: "01",
    corner: "🌮",
    title: "ليلة المارياتشي",
    place: "ساحة غوادالاخارا",
    time: "أغنية حب",
    badge: "★ I",
    photo: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "02",
    corner: "🎉",
    title: "ألوان الفييستا",
    place: "أواكساكا",
    time: "احتفال العمر",
    badge: "★ II",
    photo: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "03",
    corner: "🌵",
    title: "شمس المكسيك الدافئة",
    place: "سان ميغيل",
    time: "وقت الغروب",
    badge: "★ III",
    photo: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "04",
    corner: "💃",
    title: "رقصة السعادة",
    place: "كانكون",
    time: "على الشاطئ",
    badge: "★ IV",
    photo: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "05",
    corner: "🎊",
    title: "قلوب تنبض بالفرح",
    place: "مكسيكو سيتي",
    time: "منتصف الليل",
    badge: "★ V",
    photo: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "06",
    corner: "🎸",
    title: "حب بلا حدود",
    place: "تولوم",
    time: "سماء مرصعة",
    badge: "★ VI",
    photo: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
  },
];

const PapelPicadoBannerSVG: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    viewBox="0 0 600 90"
    fill="none"
    className={className}
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path d="M0 8 Q300 28 600 8" stroke="white" strokeWidth="2" strokeOpacity="0.55" />
    {[
      { x: 25, fill: "#F97316" },
      { x: 120, fill: "#EC4899" },
      { x: 215, fill: "#FACC15" },
      { x: 310, fill: "#14B8A6" },
      { x: 405, fill: "#EC4899" },
      { x: 500, fill: "#F97316" },
    ].map((flag, i) => (
      <g key={i} transform={`translate(${flag.x} 16)`}>
        <path
          d="M0 0 H76 V56 L63 46 L50 56 L38 46 L25 56 L13 46 L0 56 Z"
          fill={flag.fill}
          fillOpacity="0.65"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.7"
        />
        <circle cx="38" cy="24" r="9" fill="white" fillOpacity="0.55" />
        <polygon points="16,12 22,22 10,22" fill="white" fillOpacity="0.5" />
        <polygon points="60,12 66,22 54,22" fill="white" fillOpacity="0.5" />
      </g>
    ))}
  </svg>
);

export default function MexicanThemeSection({
  onNext,
  scrollContainerRef,
}: {
  onNext?: () => void;
  scrollContainerRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
}) {
  const { config } = useWeddingConfig();
  const section = config.sections?.mexican;

  return (
    <HeritageMarqueeShell
      id="section-mexican"
      chapterBadge={section?.chapterBadge || "🎉 Mexican Fiesta • احتفال الحياة والحب"}
      title={section?.title || "فييستا مكسيكية"}
      subtitle={section?.subtitle || "Teal Skies, Fiesta Orange & Mariachi Joy"}
      footerLabel={section?.footerLabel || "Mexican Fiesta Celebration"}
      backgroundClassName="bg-gradient-to-br from-[#0f766e] via-[#0d9488] to-[#f97316]"
      badgeClassName="border border-white/40 bg-black/25 text-white"
      titleClassName="text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.45)]"
      subtitleClassName="text-white/90 drop-shadow-xs"
      accentColor="#EA580C"
      footerTextClassName="text-white/90"
      audioSrc={config.audioMexican || section?.audioSrc || "/audio/pharaonic-track.mp3"}
      groomImageSrc={config.mexicanGroomUrl || section?.groomImage || "/statues/saidi-man.png"}
      brideImageSrc={config.mexicanBrideUrl || section?.brideImage || "/statues/saidi-woman.png"}
      flipGroom={isImageFlipped(config, "mexicanGroomUrl", false)}
      flipBride={isImageFlipped(config, "mexicanBrideUrl", false)}
      defaultCards={section?.cards?.length ? section.cards : DEFAULT_MEXICAN_CARDS}
      galleryOffset={42}
      onNext={onNext}
      scrollContainerRef={scrollContainerRef}
      backgroundDecorations={
        <>
          {/* Papel Picado Top String Banner */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[5] opacity-35"
          >
            <PapelPicadoBannerSVG className="w-full h-24 md:h-28" />
          </div>
          {/* Lower Papel Picado Decorative Accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[10%] top-[42%] z-[4] opacity-20 rotate-[-8deg]"
          >
            <PapelPicadoBannerSVG className="w-64 h-16" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[10%] top-[42%] z-[4] opacity-20 rotate-[8deg]"
          >
            <PapelPicadoBannerSVG className="w-64 h-16" />
          </div>
        </>
      }
    />
  );
}

