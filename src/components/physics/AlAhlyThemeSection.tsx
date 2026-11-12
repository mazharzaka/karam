"use client";

import React from "react";
import { useWeddingConfig } from "@/context/WeddingConfigContext";
import { HeritageMarqueeShell, ThemeMomentCard } from "./HeritageMarqueeShell";

const DEFAULT_AHLY_CARDS: ThemeMomentCard[] = [
  {
    num: "01",
    corner: "🦅",
    title: "أعظم نادي في الكون",
    place: "ستاد مختار التتش",
    time: "ليلة اللقب",
    badge: "★ 1907",
    photo:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "02",
    corner: "🏆",
    title: "نادي القرن الإفريقي",
    place: "التالتة شمال",
    time: "لحظة انتصار",
    badge: "★ XI",
    photo:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "03",
    corner: "❤️",
    title: "الأهلي فوق الجميع",
    place: "القاهرة",
    time: "ساعة الفرح",
    badge: "★ IX",
    photo:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "04",
    corner: "🦅",
    title: "فرحتنا بالأحمر الملكي",
    place: "الجزيرة",
    time: "مساء المجد",
    badge: "★ C",
    photo:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "05",
    corner: "⚽",
    title: "دائماً على القمة",
    place: "ستاد القاهرة",
    time: "اللحظة الذهبية",
    badge: "★ XII",
    photo:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    num: "06",
    corner: "🏆",
    title: "حب يجمعنا مدى الحياة",
    place: "القلعة الحمراء",
    time: "أمسية ساحرة",
    badge: "★ 1",
    photo:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
  },
];

export default function AlAhlyThemeSection({
  onNext,
  scrollContainerRef,
}: {
  onNext?: () => void;
  scrollContainerRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
}) {
  const { config } = useWeddingConfig();
  const section = config.sections?.ahly;

  return (
    <HeritageMarqueeShell
      id="section-ahly"
      chapterBadge={section?.chapterBadge || "🦅 Al Ahly SC • 43 League Titles • 12 African Champions"}
      title={section?.title || "نادي القرن"}
      subtitle={section?.subtitle || "The Red Devils • Club of the Century"}
      footerLabel={section?.footerLabel || "Al Ahly SC • 43 League Titles • 12 African Champions"}
      backgroundClassName="bg-gradient-to-br from-red-950 via-red-900 to-black"
      badgeClassName="border border-yellow-500/45 bg-black/50 text-yellow-400"
      titleClassName="text-yellow-400 drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)]"
      subtitleClassName="text-yellow-500 font-semibold"
      accentColor="#EAB308"
      footerTextClassName="text-yellow-500/85"
      audioSrc={config.audioAhly || section?.audioSrc || "/audio/ahly.mp3"}
      groomImageSrc={config.ahlyGroomUrl || section?.groomImage || "/statues/zamalek-groom.png"}
      brideImageSrc={config.ahlyBrideUrl || section?.brideImage || "/statues/zamalek-bride.png"}
      flipGroom
      defaultCards={section?.cards?.length ? section.cards : DEFAULT_AHLY_CARDS}
      galleryOffset={30}
      onNext={onNext}
      scrollContainerRef={scrollContainerRef}
      backgroundDecorations={
        <>
          {/* Left Off-Center CAF Trophy Watermark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/caf-logo.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute left-[6%] md:left-[14%] top-1/2 -translate-y-1/2 z-0 w-56 sm:w-72 md:w-[22rem] h-auto object-contain opacity-10"
          />

          {/* Right Off-Center Al Ahly Crest Watermark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ahly-logo.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute right-[6%] md:right-[14%] top-1/2 -translate-y-1/2 z-0 w-64 sm:w-80 md:w-[26rem] h-auto object-contain opacity-10"
          />
        </>
      }
    />
  );
}
