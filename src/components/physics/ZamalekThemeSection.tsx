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
  useScroll,
  useTransform,
} from "framer-motion";

/* -------------------------------------------------------------------------- */
/* MEDIA PLACEHOLDERS (CRITICAL FOR USER REPLACEMENT)                         */
/* -------------------------------------------------------------------------- */
// Easily swap these paths or paste new URLs directly here:
export const ZAMALEK_AUDIO_SRC = "/audio/zamalek-curva-sud.mp3";
export const ZAMALEK_GROOM_SRC = "/statues/zamalek-groom.png";
export const ZAMALEK_BRIDE_SRC = "/statues/zamalek-bride.png";

/* -------------------------------------------------------------------------- */
/* Styling Constants (Zamalek Pure White & Red Lines)                         */
/* -------------------------------------------------------------------------- */

const ZAMALEK_RED = "#E3001B";
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
    corner: "Z",
    title: "في الكورفا سود",
    place: "استاد القاهرة الدولي",
    time: "جمهور أسود 2024",
    badge: "★ 1911",
    photo: "/moments-zamalek/01.jpg",
  },
  {
    num: "02",
    corner: "K",
    title: "عشق الأبيض بخطين حُمر",
    place: "تراس النادي الملكي",
    time: "غروب النيل",
    badge: "★ Red Lines",
    photo: "/moments-zamalek/02.jpg",
  },
  {
    num: "03",
    corner: "Q",
    title: "فرحة الديربي والبطولات",
    place: "كورنيش الجزيرة",
    time: "ليلة الانتصار",
    badge: "★ Art",
    photo: "/moments-zamalek/03.jpg",
  },
  {
    num: "04",
    corner: "11",
    title: "مدرسة الفن والهندسة",
    place: "ميت عقبة العريقة",
    time: "الساعة الذهبية",
    badge: "★ Eng.",
    photo: "/moments-zamalek/04.jpg",
  },
  {
    num: "05",
    corner: "🏹",
    title: "الفرسان البيض للأبد",
    place: "قصر النيل الملكي",
    time: "عهد الوفاء",
    badge: "★ Royal",
    photo: "/moments-zamalek/05.jpg",
  },
  {
    num: "06",
    corner: "Z",
    title: "أبطال قلوبنا دائماً",
    place: "ميدان الأوبرا",
    time: "ليلة بيضاء",
    badge: "★ Knights",
    photo: "/moments-zamalek/06.jpg",
  },
];

const ROTATIONS = [
  "rotate-[-3deg]",
  "rotate-[2deg]",
  "rotate-[-1.5deg]",
  "rotate-[3deg]",
];

/* -------------------------------------------------------------------------- */
/* Zamalek "Bow and Arrow" (القوس والسهم) Emblem Watermark SVG (10% Opacity)   */
/* -------------------------------------------------------------------------- */

const ZamalekBowAndArrowWatermark: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Outer Circular Shield Medallion */}
    <circle
      cx="100"
      cy="100"
      r="92"
      stroke={ZAMALEK_RED}
      strokeWidth="3.5"
      strokeDasharray="8 6"
    />
    <circle cx="100" cy="100" r="84" stroke={ZAMALEK_RED} strokeWidth="1.8" />

    {/* The Ancient Pharaonic Archer Drawing the Bow */}
    <ellipse
      cx="78"
      cy="76"
      rx="9"
      ry="11"
      stroke={ZAMALEK_RED}
      strokeWidth="2.5"
      fill={ZAMALEK_RED}
      fillOpacity="0.25"
    />
    <path
      d="M74 66 C70 60 84 58 88 64 C90 70 88 80 84 84"
      stroke={ZAMALEK_RED}
      strokeWidth="2.2"
    />

    {/* Torso & Muscular Posture */}
    <path
      d="M78 87 L75 118 L86 118 L92 90 Z"
      stroke={ZAMALEK_RED}
      strokeWidth="2.8"
      fill={ZAMALEK_RED}
      fillOpacity="0.18"
    />

    {/* Stance Legs */}
    <path
      d="M75 118 L60 148 L68 152 L84 122"
      stroke={ZAMALEK_RED}
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M86 118 L104 148 L114 146 L95 120"
      stroke={ZAMALEK_RED}
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Extended Left Arm Holding Bow */}
    <path
      d="M84 90 L126 78 L142 74"
      stroke={ZAMALEK_RED}
      strokeWidth="3.5"
      strokeLinecap="round"
    />

    {/* Right Arm Pulling Bowstring */}
    <path
      d="M74 92 L62 96 L74 80"
      stroke={ZAMALEK_RED}
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* The Iconic Classical Curved Bow (القوس) */}
    <path
      d="M136 24 C158 54 162 100 134 136"
      stroke={ZAMALEK_RED}
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="136" cy="24" r="3" fill={ZAMALEK_RED} />
    <circle cx="134" cy="136" r="3" fill={ZAMALEK_RED} />

    {/* The Taut Bowstring (وتر القوس) */}
    <line
      x1="136"
      y1="24"
      x2="74"
      y2="80"
      stroke={ZAMALEK_RED}
      strokeWidth="1.8"
      strokeDasharray="2 2"
    />
    <line
      x1="74"
      y1="80"
      x2="134"
      y2="136"
      stroke={ZAMALEK_RED}
      strokeWidth="1.8"
      strokeDasharray="2 2"
    />

    {/* The Aimed Arrow Piercing Forward (السهم) */}
    <line
      x1="66"
      y1="84"
      x2="168"
      y2="68"
      stroke={ZAMALEK_RED}
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <polygon
      points="168,68 156,62 159,74"
      fill={ZAMALEK_RED}
      stroke={ZAMALEK_RED}
      strokeWidth="1.5"
    />

    {/* Foundation Year Accent: 1911 */}
    <text
      x="100"
      y="178"
      textAnchor="middle"
      fill={ZAMALEK_RED}
      fontSize="13"
      fontWeight="bold"
      letterSpacing="3"
      fontFamily="serif"
    >
      ★ 1911 ★
    </text>
  </svg>
);

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

const VolumeIcon: React.FC<{ muted?: boolean; className?: string }> = ({
  muted,
  className,
}) => (
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
    {muted ? (
      <>
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </>
    ) : (
      <>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </>
    )}
  </svg>
);

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.3 3 5 6.3 5c2 0 3.4 1.1 4.2 2.4h3C14.3 6.1 15.7 5 17.7 5 21 5 23.1 8.3 21.6 11.8 19.5 16.4 12 21 12 21z" />
  </svg>
);

const PinIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* Zamalek White & Red Photo Card Component                                   */
/* -------------------------------------------------------------------------- */

const PhotoCard: React.FC<{ card: MomentCard; rotation: string }> = ({
  card,
  rotation,
}) => (
  <div
    className={`flex w-[clamp(200px,20vw,280px)] aspect-[3/4] shrink-0 flex-col rounded-md border-[6px] border-white bg-white shadow-[0_14px_35px_-8px_rgba(227,0,27,0.18),0_10px_20px_-6px_rgba(0,0,0,0.1)] transition-transform duration-500 hover:scale-105 ${rotation}`}
  >
    {/* Top strip with Zamalek Double Red Line Accents */}
    <div className="flex h-7 shrink-0 items-center justify-between px-2.5 bg-gradient-to-r from-white via-red-50/40 to-white border-b border-[#E3001B]/15">
      <div className="flex items-center gap-1.5 font-serif text-xs font-black text-[#E3001B]">
        <span>{card.corner}</span>
        <span className="flex gap-0.5 h-3">
          <span className="w-0.5 h-full bg-[#E3001B]" />
          <span className="w-0.5 h-full bg-[#E3001B]" />
        </span>
      </div>
      <span className="text-[10px] tracking-widest font-semibold text-[#B30015]">
        ZAMALEK #{card.num}
      </span>
      <HeartIcon className="h-3 w-3 text-[#E3001B]" />
    </div>

    {/* Photo with high contrast and pure aesthetic */}
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-sm bg-stone-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.photo}
        alt={card.title}
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover brightness-[1.03] contrast-[1.05]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-2.5 pb-2 pt-8 text-white">
        <p className="font-serif text-lg leading-tight tracking-wide font-bold">{card.title}</p>
        <div className="mt-1 flex items-center justify-between text-[10px] text-white/95">
          <span className="flex items-center gap-1">
            <PinIcon className="h-2.5 w-2.5 text-[#FFA8B3]" />
            {card.place}
          </span>
          <span className="text-[#FFA8B3] font-mono">{card.time}</span>
        </div>
      </div>
    </div>

    {/* Footer strip with Zamalek Two Red Lines */}
    <div className="flex h-7 shrink-0 items-center justify-between px-2.5 bg-gradient-to-r from-white via-red-50/40 to-white border-t border-[#E3001B]/15">
      <span className="font-serif text-[10px] italic font-bold text-[#E3001B]">
        الفن والهندسة
      </span>
      <div className="flex items-center gap-1 text-[#E3001B]">
        <span className="text-xs">🏹</span>
        <span className="flex gap-0.5 h-3">
          <span className="w-0.5 h-full bg-[#E3001B]" />
          <span className="w-0.5 h-full bg-[#E3001B]" />
        </span>
      </div>
      <span className="font-serif text-[10px] font-black text-[#2A2421]">
        {card.badge}
      </span>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* ZamalekThemeSection Component                                              */
/* -------------------------------------------------------------------------- */

export default function ZamalekThemeSection({
  onNext,
  scrollContainerRef,
}: {
  onNext?: () => void;
  scrollContainerRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
} = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeAnimationRef = useRef<number | null>(null);

  // Marquee controls & state
  const controls = useAnimation();
  const x = useMotionValue(0);

  const halfRef = useRef<number>(0);
  const posRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const runIdRef = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useMotionValueEvent(x, "change", (latest) => {
    posRef.current = latest;
  });

  /* ---- Parallax Scroll Transformation for Heroes ---- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollContainerRef?.current ? scrollContainerRef : undefined,
    offset: ["start end", "end start"],
  });

  const heroY = useTransform(
    scrollYProgress,
    [0, 0.22, 0.46, 0.72, 1],
    ["100%", "100%", "0%", "0%", "100%"]
  );

  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.38, 0.74, 0.96],
    [0, 0, 1, 1, 0]
  );

  const inView = useInView(sectionRef, {
    root: scrollContainerRef?.current ? scrollContainerRef : undefined,
    amount: 0.35,
  });

  /* ---- Measurement for Infinite Marquee ---- */
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const first = track.children[0] as HTMLElement | undefined;
      const copy = track.children[CARDS.length] as HTMLElement | undefined;
      if (first && copy) {
        const dist = copy.offsetLeft - first.offsetLeft;
        halfRef.current = dist;
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
  }, []);

  /* ---- Marquee Animation Execution ---- */
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

  /* ---- Pause / Resume Handler ---- */
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

  /* ---- Audio Mute Handler ---- */
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  /* ---- Audio Playback & Auto Crossfade Controller ---- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeAnimationRef.current) {
      cancelAnimationFrame(fadeAnimationRef.current);
      fadeAnimationRef.current = null;
    }

    const DURATION = 1400; // 1.4s smooth crossfade
    const startTime = performance.now();

    if (inView) {
      document.querySelectorAll("audio").forEach((otherAudio) => {
        if (otherAudio !== audio && !otherAudio.paused) {
          otherAudio.pause();
        }
      });

      const startVol = audio.volume;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const unlock = () => {
            audio.play().catch(() => {});
          };
          window.addEventListener("pointerdown", unlock, { once: true });
        });
      }

      const animateIn = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / DURATION);
        audio.volume = Math.max(0, Math.min(1, startVol + (1 - startVol) * progress));

        if (progress < 1) {
          fadeAnimationRef.current = requestAnimationFrame(animateIn);
        } else {
          audio.volume = 1;
          fadeAnimationRef.current = null;
        }
      };

      fadeAnimationRef.current = requestAnimationFrame(animateIn);
    } else {
      const startVol = audio.volume;

      const animateOut = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / DURATION);
        audio.volume = Math.max(0, Math.min(1, startVol * (1 - progress)));

        if (progress < 1) {
          fadeAnimationRef.current = requestAnimationFrame(animateOut);
        } else {
          audio.pause();
          audio.volume = 0;
          fadeAnimationRef.current = null;
        }
      };

      fadeAnimationRef.current = requestAnimationFrame(animateOut);
    }

    return () => {
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
        fadeAnimationRef.current = null;
      }
    };
  }, [inView]);

  const loopedCards = [...CARDS, ...CARDS];

  return (
    <section
      ref={sectionRef}
      id="section-5-zamalek"
      className="relative isolate flex h-[82vh] min-h-[640px] max-h-[820px] w-full flex-col overflow-hidden select-none bg-white"
    >
      {/* Zamalek SC Anthem Soundtrack (Track: ZAMALEK_AUDIO_SRC) */}
      <audio
        ref={audioRef}
        src={ZAMALEK_AUDIO_SRC}
        loop
        preload="auto"
        className="hidden"
      />

      {/* -------------------------------------------------------------------- */}
      {/* THE FAMOUS TWO RED LINES (الخطين الحمر) - Vertical Stripes           */}
      {/* Positioned aesthetically behind characters & framing cards           */}
      {/* -------------------------------------------------------------------- */}

      {/* Left Flank: Subtle Double Red Lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-6 sm:left-10 md:left-14 z-[6] flex gap-2.5 opacity-30 transition-opacity duration-500"
      >
        <div className="w-1.5 sm:w-2 h-full bg-[#E3001B]" />
        <div className="w-1.5 sm:w-2 h-full bg-[#E3001B]" />
      </div>

      {/* Right Flank: Subtle Double Red Lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-6 sm:right-10 md:right-14 z-[6] flex gap-2.5 opacity-30 transition-opacity duration-500"
      >
        <div className="w-1.5 sm:w-2 h-full bg-[#E3001B]" />
        <div className="w-1.5 sm:w-2 h-full bg-[#E3001B]" />
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* WATERMARK: ZAMALEK "BOW & ARROW" (القوس والسهم) In Exact Center      */}
      {/* Large scale, 10% opacity behind the marquee                          */}
      {/* -------------------------------------------------------------------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-[4] opacity-10 text-[#E3001B] transition-all duration-700"
      >
        <ZamalekBowAndArrowWatermark className="w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] md:w-[560px] md:h-[560px] drop-shadow-sm" />
      </div>

      {/* Top-Right Floating Controls */}
      <div className="absolute right-6 top-6 z-40 flex items-center gap-2.5">
        {/* Audio Mute/Unmute */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute Zamalek Anthem" : "Mute Zamalek Anthem"}
          title={isMuted ? "Play Anthem" : "Mute Anthem"}
          className="flex items-center gap-1.5 rounded-full border border-[#E3001B]/40 bg-white/90 px-3 py-2 text-xs font-bold text-[#E3001B] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-red-50 hover:shadow active:scale-95 cursor-pointer"
        >
          <VolumeIcon muted={isMuted} className="h-4 w-4 text-[#E3001B]" />
          <span className="hidden sm:inline font-sans">{isMuted ? "Unmute" : "Anthem"}</span>
        </button>

        {/* Marquee Play/Pause */}
        <button
          type="button"
          onClick={togglePause}
          aria-pressed={isPaused}
          className="rounded-full border border-[#E3001B]/40 bg-white/90 px-4 py-2 text-sm font-bold text-[#2A2421] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-red-50 hover:shadow active:scale-95 cursor-pointer"
        >
          {isPaused ? "▶ Play" : "❚❚ Pause"}
        </button>

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="rounded-full bg-[#E3001B] px-4 py-2 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#B30015] active:scale-95 cursor-pointer"
          >
            Scene 06: Physics Desk →
          </button>
        )}
      </div>

      {/* Centered Header with generous mb-24 bottom clearance */}
      <header className="relative z-30 px-6 pt-8 text-center md:pt-10 mb-20 md:mb-24 pb-10 md:pb-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#E3001B]/35 bg-white px-4 py-1 text-xs font-bold text-[#E3001B] shadow-sm">
          <span className="flex gap-0.5 h-3">
            <span className="w-0.5 h-full bg-[#E3001B]" />
            <span className="w-0.5 h-full bg-[#E3001B]" />
          </span>
          Chapter 05 • الزمالك نادي القرن الحقيقي
        </span>

        {/* Main Title popping in Zamalek Red (#E3001B) */}
        <h2 className="mt-3 font-serif text-3xl font-black md:text-5xl text-[#E3001B] tracking-tight drop-shadow-sm">
          مدرسة الفن والهندسة
        </h2>

        <p className="mt-2 font-serif text-sm italic font-semibold text-[#33272A] md:text-base">
          Zamalek SC • The White Knights • Royal Romance
        </p>
      </header>

      {/* Card row: 3-card visible focus Kotsheena marquee */}
      <div className="relative z-10 my-auto h-[440px] min-h-[400px] overflow-hidden">
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

      {/* Left Character: Groom in White Zamalek Jersey (Mirrored Inward -scale-x-100) */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="pointer-events-none absolute bottom-0 left-0 z-50 will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ZAMALEK_GROOM_SRC}
          alt="Groom wearing White Zamalek Jersey"
          aria-hidden="true"
          className="absolute bottom-0 left-0 z-50 h-[80vh] lg:h-[335px] lg:max-w-[335px] w-auto object-contain -scale-x-100 drop-shadow-2xl"
          style={{ transform: "scaleX(-1)" }}
        />
      </motion.div>

      {/* Right Character: Bride in White Zamalek Jersey (Facing Inward toward Groom) */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="pointer-events-none absolute bottom-0 right-0 z-50 will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ZAMALEK_BRIDE_SRC}
          alt="Bride wearing White Zamalek Jersey"
          aria-hidden="true"
          className="absolute bottom-0 right-0 z-50 h-[80vh] lg:h-[335px] lg:max-w-[335px] w-auto object-contain drop-shadow-2xl"
        />
      </motion.div>

      {/* Footer */}
      <footer className="relative z-30 flex items-center justify-between px-6 pb-5 text-xs text-[#55474A]">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="text-[#E3001B]">🏹</span>
          <span>عشق الأبيض بخطين حُمر لا ينتهي أبدًا.</span>
        </span>
        <span className="flex items-center gap-3">
          <span className="font-semibold">24 Moments • White Knights Marquee</span>
          <span className="h-3 w-px bg-[#E3001B]/40" />
          <span className="font-serif italic font-bold text-[#E3001B]">
            مدرسة الفن والهندسة
          </span>
        </span>
      </footer>
    </section>
  );
}
