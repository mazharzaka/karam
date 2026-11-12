"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useAnimation,
  useInView,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { useSectionAudio } from "@/utils/globalAudioCoordinator";
import { BottomAudioControls } from "./BottomAudioControls";
import {
  useWeddingConfig,
  mergeGalleryIntoCards,
  isImageFlipped,
} from "@/context/WeddingConfigContext";

/* -------------------------------------------------------------------------- */
/* 1. MEDIA CONSTANTS (Hardcoded with Provided Assets)                         */
/* -------------------------------------------------------------------------- */

export const FALAHI_AUDIO_SRC = "/audio/hadret-el-omda.mp3"; // (Track: Hadret El Omda)
export const FALAHI_GROOM_SRC = "/statues/falahi-groom.png";
export const FALAHI_BRIDE_SRC = "/statues/falahi-bride.png";

/* -------------------------------------------------------------------------- */
/* Styling Constants (Fresh Delta Pastel Green & Vibrant Tangerines)          */
/* -------------------------------------------------------------------------- */

const SPEED = 45; // 45px per second marquee speed

interface MomentCard {
  num: string;
  corner: string;
  title: string;
  place: string;
  time: string;
  badge: string;
  photo: string;
}

const CARDS: MomentCard[] = [
  {
    num: "01",
    corner: "🍊",
    title: "موسم حصاد اليوسفي",
    place: "جناين الدلتا الخضرا",
    time: "ريحة الشتا العطرة",
    badge: "★ خير الريف",
    photo: "/moments/01.jpg",
  },
  {
    num: "02",
    corner: "🌾",
    title: "زفة المندرة وحضرة العمدة",
    place: "دوار العيلة العريق",
    time: "ضحكات المساء",
    badge: "★ أصالة",
    photo: "/moments/02.jpg",
  },
  {
    num: "03",
    corner: "🚜",
    title: "مشوار على الجسر وقت العصير",
    place: "طريق القناطر والترعة",
    time: "غروب ذهبي هادي",
    badge: "★ مودة",
    photo: "/moments/03.jpg",
  },
  {
    num: "04",
    corner: "🍯",
    title: "فطير مشلتت وعسل نحل",
    place: "بيت العروسة الدافئ",
    time: "صباحية مباركة",
    badge: "★ فرحة",
    photo: "/moments/04.jpg",
  },
  {
    num: "05",
    corner: "🌿",
    title: "صوت الساقية وسحر النيل",
    place: "حقول البرسيم والخير",
    time: "أول الفجر",
    badge: "★ بهجة",
    photo: "/moments/05.jpg",
  },
  {
    num: "06",
    corner: "🤍",
    title: "أغاني الفرح وحنة الغالية",
    place: "ساحة الدار الكبيرة",
    time: "ليلة العمر",
    badge: "★ زغاريد",
    photo: "/moments/06.jpg",
  },
];

const ROTATIONS = [-2.5, 1.8, -1.2, 2.8, -1.9, 1.5];

/* -------------------------------------------------------------------------- */
/* SVG Motifs: Tangerine (استفندي) & Traditional Egyptian Saqia (ساقية)        */
/* -------------------------------------------------------------------------- */

function TangerineSVG({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Leaves */}
      <path
        d="M50 30 C40 10, 20 18, 25 32 C30 38, 45 35, 50 30 Z"
        fill="#2E7D32"
      />
      <path
        d="M27 24 C34 26, 42 28, 48 30"
        stroke="#81C784"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M54 28 C65 14, 80 18, 78 30 C75 38, 62 34, 54 28 Z"
        fill="#388E3C"
      />
      <path
        d="M74 24 C68 26, 60 28, 55 28"
        stroke="#A5D6A7"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Stem */}
      <path
        d="M50 35 L52 24"
        stroke="#5D4037"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Main Tangerine Body */}
      <ellipse
        cx="50"
        cy="62"
        rx="36"
        ry="32"
        fill="url(#tangerineGradFalahi)"
      />

      {/* Citrus Top Dip */}
      <path
        d="M44 33 C47 35, 53 35, 56 33"
        stroke="#E65100"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Glossy / Juicy Highlights */}
      <path
        d="M32 48 C36 44, 46 42, 54 44"
        stroke="#FFE082"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.65"
      />
      <circle cx="28" cy="62" r="2.5" fill="#FFE082" opacity="0.6" />
      <circle cx="34" cy="72" r="2" fill="#FFE082" opacity="0.5" />
      <circle cx="70" cy="58" r="2" fill="#FFE082" opacity="0.5" />

      {/* Gradients */}
      <defs>
        <radialGradient
          id="tangerineGradFalahi"
          cx="42%"
          cy="48%"
          r="52%"
          fx="35%"
          fy="42%"
        >
          <stop offset="0%" stopColor="#FFA726" />
          <stop offset="55%" stopColor="#FB8C00" />
          <stop offset="85%" stopColor="#F57C00" />
          <stop offset="100%" stopColor="#E65100" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function SaqiaWaterwheelSVG({ className = "w-96 h-96" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer Wheel Rims */}
      <circle cx="100" cy="100" r="88" strokeWidth="3" strokeDasharray="6 4" />
      <circle cx="100" cy="100" r="82" strokeWidth="4" />
      <circle cx="100" cy="100" r="54" strokeWidth="2.5" opacity="0.6" />
      <circle cx="100" cy="100" r="22" strokeWidth="4" fill="currentColor" fillOpacity="0.08" />
      <circle cx="100" cy="100" r="8" strokeWidth="3" />

      {/* Spokes (12 Spokes) */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line
          key={deg}
          x1="100"
          y1="100"
          x2={100 + 82 * Math.cos((deg * Math.PI) / 180)}
          y2={100 + 82 * Math.sin((deg * Math.PI) / 180)}
          strokeWidth="2.5"
        />
      ))}

      {/* Water Buckets / القواديس (Clay Pots on Rim) */}
      {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = 100 + 84 * Math.cos(rad);
        const y = 100 + 84 * Math.sin(rad);
        return (
          <rect
            key={deg}
            x={x - 6}
            y={y - 8}
            width="12"
            height="16"
            rx="3"
            strokeWidth="2"
            fill="currentColor"
            fillOpacity="0.15"
            transform={`rotate(${deg + 90} ${x} ${y})`}
          />
        );
      })}

      {/* Flowing Water Streams / موجات الترعة */}
      <path
        d="M20 180 C50 170, 80 190, 110 180 C140 170, 170 190, 190 182"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M10 192 C40 184, 70 200, 100 192 C130 184, 160 200, 195 194"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

function OliveBranchSVG({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 90 Q40 50 85 15"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Leaf pairs */}
      <path d="M30 68 C20 60, 24 45, 34 50 C40 55, 38 65, 30 68 Z" />
      <path d="M42 58 C50 50, 60 52, 58 62 C54 68, 44 65, 42 58 Z" />
      <path d="M50 48 C42 38, 46 25, 56 30 C62 35, 58 45, 50 48 Z" />
      <path d="M62 38 C72 30, 82 34, 80 44 C76 50, 66 46, 62 38 Z" />
      <path d="M72 26 C68 15, 78 8, 86 14 C90 20, 82 28, 72 26 Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Volume Icon Helper                                                         */
/* -------------------------------------------------------------------------- */

function VolumeIcon({
  muted,
  className = "w-4 h-4",
}: {
  muted: boolean;
  className?: string;
}) {
  if (muted) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* PhotoCard Component (Egyptian Rural Kotsheena Aesthetic)                   */
/* -------------------------------------------------------------------------- */

interface PhotoCardProps {
  card: MomentCard;
  rotation: number;
}

function PhotoCard({ card, rotation }: PhotoCardProps) {
  return (
    <motion.div
      style={{ rotate: rotation }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        zIndex: 30,
        transition: { type: "spring", stiffness: 320, damping: 20 },
      }}
      className="group relative h-[360px] w-[260px] sm:h-[390px] sm:w-[280px] shrink-0 cursor-pointer rounded-2xl border-2 border-[#C8E6C9] bg-white p-3.5 shadow-md transition-shadow duration-300 hover:shadow-2xl hover:border-[#FF9800]"
    >
      {/* Corner Citrus / Motif */}
      <span className="absolute left-3.5 top-3.5 select-none font-serif text-sm font-bold text-[#E65100]">
        {card.corner}
      </span>
      <span className="absolute right-3.5 top-3.5 select-none text-[11px] font-bold text-[#2E7D32]">
        {card.num}
      </span>

      {/* Main Image Container */}
      <div className="relative mt-5 h-[230px] sm:h-[250px] w-full overflow-hidden rounded-xl bg-[#F1F8E9]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.photo}
          alt={card.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80";
          }}
        />

        {/* Badge in Bottom Corner */}
        <span className="absolute bottom-2 right-2 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-[#2E7D32] shadow-xs backdrop-blur-xs">
          {card.badge}
        </span>
      </div>

      {/* Card Typography */}
      <div className="mt-3 text-right">
        <h4 className="font-serif text-base font-bold text-[#1B5E20] line-clamp-1">
          {card.title}
        </h4>
        <div className="mt-0.5 flex items-center justify-between text-xs text-[#558B2F]">
          <span className="font-mono text-[10px] font-medium text-[#E65100]">
            {card.time}
          </span>
          <span className="font-medium">{card.place}</span>
        </div>
      </div>

      {/* Subtle Bottom Accent Line in Citrus Orange */}
      <div className="mt-2.5 h-1 w-full rounded-full bg-gradient-to-r from-[#81C784] via-[#FFA726] to-[#81C784] opacity-50" />
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Component: FalahiHeritageSection (أفراح الريف)                         */
/* -------------------------------------------------------------------------- */

export interface FalahiHeritageSectionProps {
  onNext?: () => void;
  scrollContainerRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
}

export default function FalahiHeritageSection({
  onNext,
}: FalahiHeritageSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { config } = useWeddingConfig();
  const dynamicCards = React.useMemo(
    () => mergeGalleryIntoCards(CARDS, config.gallery, 18),
    [config.gallery]
  );

  // Marquee controls & state (matching Saidi & Zamalek)
  const controls = useAnimation();
  const x = useMotionValue(0);

  const halfRef = useRef<number>(0);
  const posRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const runIdRef = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);

  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Sync posRef with the latest motion value
  useMotionValueEvent(x, "change", (latest) => {
    posRef.current = latest;
  });

  // Section in-view detectors for audio & bottom-corner character reveal
  const inView = useInView(sectionRef, { amount: 0.35 });
  const charactersInView = useInView(sectionRef, { amount: 0.05 });

  const {
    isMuted,
    toggleGlobalMute: toggleMute,
    isTrackPlaying,
    togglePlayStop,
    volume,
    increaseVolume,
    decreaseVolume,
  } = useSectionAudio(audioRef, inView);

  // Doubled looped cards for seamless Saidi/Zamalek marquee
  const loopedCards = [...dynamicCards, ...dynamicCards];

  /* ---- Measurement for Infinite Marquee (Saidi/Zamalek standard) ---- */
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const first = track.children[0] as HTMLElement | undefined;
      const copy = track.children[dynamicCards.length] as HTMLElement | undefined;
      if (first && copy) {
        halfRef.current = copy.offsetLeft - first.offsetLeft;
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [dynamicCards.length]);

  /* ---- Marquee Animation Execution (Saidi/Zamalek standard) ---- */
  const run = useCallback(() => {
    const halfWidth = halfRef.current;
    if (!halfWidth || pausedRef.current) return;

    const id = ++runIdRef.current;

    let start = x.get() % halfWidth;
    if (start > 0) start -= halfWidth;
    x.set(start);
    posRef.current = start;
    startRef.current = start;

    const remaining = halfWidth + start;
    controls
      .start({
        x: [start, -halfWidth],
        transition: { duration: remaining / SPEED, ease: "linear" },
      })
      .then(() => {
        if (runIdRef.current !== id || pausedRef.current) return;
        x.set(0);
        posRef.current = 0;
        run();
      })
      .catch(() => {});
  }, [controls, x]);

  useEffect(() => {
    run();
    return () => {
      runIdRef.current += 1;
      controls.stop();
    };
  }, [run, controls]);

  const togglePause = () => {
    if (pausedRef.current) {
      pausedRef.current = false;
      setIsPaused(false);
      run();
    } else {
      pausedRef.current = true;
      setIsPaused(true);
      runIdRef.current += 1;
      controls.stop();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex h-[82vh] min-h-[640px] max-h-[820px] w-full flex-col overflow-hidden bg-gradient-to-b from-[#E8F5E9] via-[#F1F8E9] to-[#E8F5E9] select-none text-[#1B5E20]"
    >
      {/* Native HTML5 Audio with Hadret El Omda */}
      <audio
        ref={audioRef}
        src={config.audioFalahi || FALAHI_AUDIO_SRC}
        preload="auto"
        loop
      />

      {/* -------------------------------------------------------------------- */}
      {/* 1. FRESH DELTA VIBE & BACKGROUND MOTIFS: TANGERINES & SAQIA          */}
      {/* -------------------------------------------------------------------- */}

      {/* Waterwheel (ساقية) Large Center Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-[3] opacity-20 text-[#2E7D32] transition-all duration-700"
      >
        <SaqiaWaterwheelSVG className="w-[420px] h-[420px] sm:w-[540px] sm:h-[540px] md:w-[640px] md:h-[640px] drop-shadow-xs" />
      </div>

      {/* Scattered Tangerines (الاستفندي) Across the Delta Horizon */}
      {/* Top Left Tangerine Cluster */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-8 sm:left-14 top-12 z-[4] opacity-85 drop-shadow-md"
      >
        <TangerineSVG className="w-14 h-14 sm:w-16 sm:h-16 rotate-[-12deg]" />
      </div>

      {/* Top Right Tangerine Cluster */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-16 sm:right-28 top-16 z-[4] opacity-90 drop-shadow-md"
      >
        <TangerineSVG className="w-12 h-12 sm:w-14 sm:h-14 rotate-[18deg]" />
      </div>

      {/* Mid Left Tangerine Floating near Cards */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/3 z-[4] opacity-80 drop-shadow-sm"
      >
        <TangerineSVG className="w-10 h-10 sm:w-12 sm:h-12 rotate-[8deg]" />
      </div>

      {/* Mid Right Tangerine Floating */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-2/3 z-[4] opacity-85 drop-shadow-sm"
      >
        <TangerineSVG className="w-11 h-11 sm:w-13 sm:h-13 rotate-[-15deg]" />
      </div>

      {/* Bottom Center Scattered Tangerines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-16 bottom-14 z-[4] opacity-80"
      >
        <TangerineSVG className="w-9 h-9 sm:w-11 sm:h-11 rotate-[25deg]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-20 bottom-16 z-[4] opacity-85"
      >
        <TangerineSVG className="w-10 h-10 sm:w-12 sm:h-12 rotate-[-20deg]" />
      </div>

      {/* Subtle Green Decorative Branches along borders */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-24 z-[3] opacity-25 text-[#2E7D32]"
      >
        <OliveBranchSVG className="w-28 h-28 sm:w-36 sm:h-36 rotate-12" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-28 z-[3] opacity-25 text-[#2E7D32]"
      >
        <OliveBranchSVG className="w-28 h-28 sm:w-36 sm:h-36 -scale-x-100 rotate-[-12deg]" />
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Top Floating Controls                                                */}
      {/* -------------------------------------------------------------------- */}
      <div className="absolute right-6 top-6 z-50 flex items-center gap-2.5">
        {/* Audio Mute/Unmute */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute Falahi Anthem" : "Mute Falahi Anthem"}
          title={isMuted ? "Play Anthem" : "Mute Anthem"}
          className="flex items-center gap-1.5 rounded-full border border-[#2E7D32]/40 bg-white/90 px-3 py-2 text-xs font-bold text-[#1B5E20] shadow-xs transition-all duration-200 hover:scale-105 hover:bg-emerald-50 active:scale-95 cursor-pointer"
        >
          <VolumeIcon muted={isMuted} className="h-4 w-4 text-[#E65100]" />
          <span className="hidden sm:inline font-sans">{isMuted ? "Muted" : "Mute All"}</span>
        </button>

        {/* Marquee Play/Pause */}
        <button
          type="button"
          onClick={togglePause}
          aria-pressed={isPaused}
          className="rounded-full border border-[#2E7D32]/40 bg-white/90 px-4 py-2 text-sm font-bold text-[#1B5E20] shadow-xs transition-all duration-200 hover:scale-105 hover:bg-emerald-50 active:scale-95 cursor-pointer"
        >
          {isPaused ? "▶ Play" : "❚❚ Pause"}
        </button>

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="rounded-full bg-gradient-to-r from-[#E65100] to-[#FF9800] px-4 py-2 text-sm font-bold text-white shadow-xs transition-all duration-200 hover:scale-105 hover:opacity-95 active:scale-95 cursor-pointer"
          >
            Scene 06: الزمالك →
          </button>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Centered Header: أفراح الريف (Saidi Spacing)                         */}
      {/* -------------------------------------------------------------------- */}
      <header className="relative z-30 px-6 pt-8 text-center md:pt-10 mb-20 md:mb-24 pb-10 md:pb-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#2E7D32]/35 bg-white/85 px-4 py-1 text-xs font-bold text-[#2E7D32] shadow-xs">
          <span className="text-[#FF9800]">🍊</span>
          <span>Chapter 05 • التراث الفلاحي وريحة اليوسفي</span>
        </span>

        {/* Main Title popping in Vibrant Warm Citrus Orange */}
        <h2 className="mt-3 font-serif text-3xl font-black md:text-5xl text-[#D84315] tracking-tight drop-shadow-xs">
          أفراح الريف
        </h2>

        <p className="mt-2 font-serif text-sm italic font-semibold text-[#33691E] md:text-base">
          Egyptian Rural &amp; Delta Heritage • The Scent of Tangerines &amp; Nile Greenery
        </p>
      </header>

      {/* -------------------------------------------------------------------- */}
      {/* Full-Width Cards Marquee (Matches Saidi & Zamalek Sections)          */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative z-20 my-auto h-[440px] min-h-[400px] w-full overflow-hidden">
        <motion.div
          ref={trackRef}
          animate={controls}
          style={{ x }}
          className="flex w-max gap-6 will-change-transform"
        >
          {loopedCards.map((card, i) => (
            <PhotoCard
              key={`${card.num}-${i}`}
              card={card}
              rotation={ROTATIONS[(i % CARDS.length) % ROTATIONS.length]}
            />
          ))}
        </motion.div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Left Character Image: Bottom-Left Corner (Standard Clean CSS)        */}
      {/* -------------------------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={charactersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 z-50 w-44 md:w-64 lg:w-80 pointer-events-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.falahiGroomUrl || FALAHI_GROOM_SRC}
          alt={`${config.groomName} in Rural Egyptian Attire`}
          aria-hidden="true"
          style={{
            transform: isImageFlipped(config, "falahiGroomUrl", false)
              ? "scaleX(-1)"
              : "none",
          }}
          className="w-full h-auto object-contain object-bottom"
        />
      </motion.div>

      {/* -------------------------------------------------------------------- */}
      {/* Right Character Image: Bottom-Right Corner (Standard Clean CSS)      */}
      {/* -------------------------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={charactersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 right-0 z-50 w-44 md:w-64 lg:w-80 pointer-events-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.falahiBrideUrl || FALAHI_BRIDE_SRC}
          alt={`${config.brideName} in Rural Egyptian Attire`}
          aria-hidden="true"
          style={{
            transform: isImageFlipped(config, "falahiBrideUrl", false)
              ? "scaleX(-1)"
              : "none",
          }}
          className="w-full h-auto object-contain object-bottom"
        />
      </motion.div>

      {/* -------------------------------------------------------------------- */}
      {/* Footer + Bottom Centered Section Audio Controls                      */}
      {/* -------------------------------------------------------------------- */}
      <footer className="relative z-40 flex flex-col sm:flex-row items-center justify-between gap-2 px-6 pb-5 text-xs text-[#558B2F]">
        <span className="hidden md:flex items-center gap-1.5 font-medium">
          <span className="text-[#E65100]">🍊</span>
          <span>يا بركة الريف وخير الأرض الطيبة.. مبروك لأحلى عرسان.</span>
        </span>
        <div className="mx-auto sm:mx-0">
          <BottomAudioControls
            isPlaying={isTrackPlaying}
            isMuted={isMuted}
            volume={volume}
            onTogglePlayStop={togglePlayStop}
            onIncreaseVolume={increaseVolume}
            onDecreaseVolume={decreaseVolume}
            variant="light"
          />
        </div>
        <span className="hidden md:flex items-center gap-3">
          <span className="font-semibold">24 Moments • Delta Rural Marquee</span>
          <span className="h-3 w-px bg-[#2E7D32]/40" />
          <span className="font-serif italic font-bold text-[#E65100]">
            أفراح الريف
          </span>
        </span>
      </footer>
    </section>
  );
}
