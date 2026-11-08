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
/* MEDIA PLACEHOLDERS (Easily Replaceable)                                     */
/* -------------------------------------------------------------------------- */

export const SAIDI_SECTION_ASSETS = {
  // Hero Character Cutouts (High-resolution transparent PNGs)
  groomImage: "/statues/saidi-man.png",
  brideImage: "/statues/saidi-woman.png",

  // Section 3 Saidi Traditional Audio Track (غناء محمود الليثي - اللي ابوه صعيدي ميخافش)
  saidiTrack: "/audio/track-c-saidi.mp3",
};

/* -------------------------------------------------------------------------- */
/* Styling Constants                                                           */
/* -------------------------------------------------------------------------- */

const ROSE_GOLD = "#D4AF37";
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
    corner: "K",
    title: "The Sparkler",
    place: "Midnight Celebrations",
    time: "Midnight",
    badge: "★ I",
    photo: "/moments-saidi/01.jpg",
  },
  {
    num: "02",
    corner: "K",
    title: "The Surprise Proposal",
    place: "Terrace by the Sea",
    time: "August Evening",
    badge: "★ X",
    photo: "/moments-saidi/02.jpg",
  },
  {
    num: "03",
    corner: "Q",
    title: "Cozy Morning Blanket",
    place: "Old Hearth",
    time: "Winter Cabin",
    badge: "★ 0",
    photo: "/moments-saidi/03.jpg",
  },
  {
    num: "04",
    corner: "3",
    title: "Candlelit Conversations",
    place: "Piazza Lights",
    time: "Midnight Walk",
    badge: "★ C",
    photo: "/moments-saidi/04.jpg",
  },
  {
    num: "05",
    corner: "18",
    title: "Our Very First",
    place: "Evening Melody",
    time: "Golden Hour",
    badge: "★ BT",
    photo: "/moments-saidi/05.jpg",
  },
  {
    num: "06",
    corner: "9",
    title: "Hands Entwined",
    place: "The Vow Ceremony",
    time: "Evening",
    badge: "★ IX",
    photo: "/moments-saidi/06.jpg",
  },
];

// Preserved rotational offsets for natural card layout
const ROTATIONS = [
  "rotate-[-3deg]",
  "rotate-[2deg]",
  "rotate-[-1.5deg]",
  "rotate-[3deg]",
];

/* -------------------------------------------------------------------------- */
/* Authentic Saidi & Upper Egypt Inline SVGs (No Pharaonic Symbols)           */
/* -------------------------------------------------------------------------- */

const svgUri = (svg: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

// Traditional Talli (تلي) Vertical Border Strip (Nested Diamonds & Chevron Ladder)
const TALLI_BORDER_BG = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="48" viewBox="0 0 24 48" fill="none" stroke="${ROSE_GOLD}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <line x1="2" y1="0" x2="2" y2="48" stroke-width="1" opacity="0.6"/>
    <line x1="22" y1="0" x2="22" y2="48" stroke-width="1" opacity="0.6"/>
    <polygon points="12,3 20,13 12,23 4,13"/>
    <polygon points="12,7 17,13 12,19 7,13" stroke-width="1.1"/>
    <circle cx="12" cy="13" r="1.6" fill="${ROSE_GOLD}"/>
    <polyline points="4,27 12,33 20,27"/>
    <polyline points="4,34 12,40 20,34"/>
    <polyline points="4,41 12,47 20,41"/>
  </svg>`
);

/* -------------------------------------------------------------------------- */
/* PROMINENT SAIDI HERO MOTIFS (Large Visible Watermarks: Olla, Palms, Wheat)   */
/* -------------------------------------------------------------------------- */

// Traditional Egyptian Clay Water Pitcher (Olla / قلة قناوي)
const ProminentOllaSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 100 120"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Lip & Neck */}
    <ellipse cx="50" cy="14" rx="18" ry="6" strokeWidth="2.6" />
    <path
      d="M34 15 C34 23 41 29 41 38 C31 46 20 59 20 78 C20 100 33 113 50 113 C67 113 80 100 80 78 C80 59 69 46 59 38 C59 29 66 23 66 15"
      strokeWidth="2.8"
    />
    <line x1="39" y1="28" x2="61" y2="28" strokeWidth="2" strokeDasharray="3 3" />
    <ellipse cx="50" cy="38" rx="10" ry="3.5" strokeWidth="2.2" />

    {/* Decorated Belly Patterns (نقوش الفخار الصعيدي) */}
    <path d="M30 68 Q50 80 70 68" strokeWidth="2.4" />
    <path d="M28 81 Q50 94 72 81" strokeWidth="2.4" />
    <path d="M34 93 Q50 102 66 93" strokeWidth="2" strokeDasharray="3 3" />

    {/* Traditional Spout (بزبوز القلة) */}
    <path d="M20 66 C10 61 6 70 13 76" strokeWidth="2.6" />

    {/* Base Stand */}
    <ellipse cx="50" cy="111" rx="15" ry="4" strokeWidth="2.2" />
  </svg>
);

// Arching Palm Fronds (سعف وجريد النخل)
const ProminentPalmFrondSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Main curving stalk */}
    <path d="M10 112 Q55 75 108 14" strokeWidth="3.4" />
    {/* Left leaflets */}
    <path d="M26 95 Q10 78 4 66" strokeWidth="2.4" />
    <path d="M38 83 Q18 63 12 48" strokeWidth="2.4" />
    <path d="M50 71 Q30 47 24 33" strokeWidth="2.4" />
    <path d="M62 58 Q44 33 36 18" strokeWidth="2.4" />
    <path d="M76 45 Q58 21 52 8" strokeWidth="2.4" />
    <path d="M90 31 Q76 10 70 2" strokeWidth="2.2" />

    {/* Right leaflets */}
    <path d="M34 89 Q56 78 68 82" strokeWidth="2.4" />
    <path d="M46 77 Q72 64 85 70" strokeWidth="2.4" />
    <path d="M58 64 Q86 49 100 56" strokeWidth="2.4" />
    <path d="M70 51 Q98 35 112 43" strokeWidth="2.4" />
    <path d="M84 37 Q106 21 118 28" strokeWidth="2.2" />
  </svg>
);

// Golden Wheat Stalks (سنابل القمح)
const ProminentWheatSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 100 120"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1="50" y1="116" x2="50" y2="10" strokeWidth="2.8" />
    {[22, 38, 54, 70, 86].map((y, i) => (
      <g key={i}>
        <path d={`M50 ${y} C39 ${y - 6} 35 ${y + 2} 50 ${y + 8}`} strokeWidth="2.2" />
        <line x1="42" y1={y} x2="22" y2={y - 15} strokeWidth="1.8" />
        <path d={`M50 ${y} C61 ${y - 6} 65 ${y + 2} 50 ${y + 8}`} strokeWidth="2.2" />
        <line x1="58" y1={y} x2="78" y2={y - 15} strokeWidth="1.8" />
      </g>
    ))}
    <line x1="50" y1="10" x2="38" y2="2" strokeWidth="1.8" />
    <line x1="50" y1="10" x2="50" y2="0" strokeWidth="2" />
    <line x1="50" y1="10" x2="62" y2="2" strokeWidth="1.8" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* Card Icons                                                                 */
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

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
  </svg>
);

const WheatMiniIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="12" y1="22" x2="12" y2="2" />
    <path d="M12 5l-3-2M12 5l3-2" />
    <path d="M12 9l-4-2.5M12 9l4-2.5" />
    <path d="M12 13l-4-2.5M12 13l4-2.5" />
    <path d="M12 17l-4-2.5M12 17l4-2.5" />
  </svg>
);

const OllaMiniIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <ellipse cx="12" cy="5" rx="4" ry="2" />
    <path d="M9 5v4c0 2-3 4-3 7 0 3.5 2.5 5 6 5s6-1.5 6-5c0-3-3-5-3-7V5" />
    <line x1="8" y1="10" x2="16" y2="10" />
  </svg>
);

const PalmMiniIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M12 22V9" />
    <path d="M12 9C8 5 4 7 2 10" />
    <path d="M12 9C16 5 20 7 22 10" />
    <path d="M12 13C7 10 4 13 3 16" />
    <path d="M12 13C17 10 20 13 21 16" />
    <path d="M12 6C9 2 5 3 4 5" />
    <path d="M12 6C15 2 19 3 20 5" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* Kotsheena Photo Card                                                       */
/* -------------------------------------------------------------------------- */

const PhotoCard: React.FC<{ card: MomentCard; rotation: string }> = ({
  card,
  rotation,
}) => (
  <div
    className={`flex w-[clamp(200px,20vw,280px)] aspect-[3/4] shrink-0 flex-col rounded-md border-[6px] border-white bg-[#FFFDF8] shadow-[0_14px_28px_-8px_rgba(120,60,70,0.35)] transition-transform duration-500 hover:scale-105 ${rotation}`}
  >
    {/* Top strip */}
    <div className="flex h-7 shrink-0 items-center justify-between px-2 text-[#8A6A1F]">
      <span className="flex items-center gap-0.5 font-serif text-sm font-bold leading-none text-[#2B1D24]">
        {card.corner}
        <WheatMiniIcon className="h-3 w-3 text-[#D4AF37]" />
      </span>
      <span className="text-[10px] tracking-widest text-[#D4AF37]">CARD #{card.num}</span>
      <HeartIcon className="h-3 w-3 text-amber-500" />
    </div>

    {/* Photo */}
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-sm bg-stone-300">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.photo}
        alt={card.title}
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover brightness-[1.03] saturate-[0.95]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 pb-2 pt-8 text-white">
        <p className="font-serif text-lg leading-tight">{card.title}</p>
        <div className="mt-1 flex items-center justify-between text-[10px] text-white/90">
          <span className="flex items-center gap-1">
            <PinIcon className="h-2.5 w-2.5 text-[#E3C45A]" />
            {card.place}
          </span>
          <span className="flex items-center gap-1">
            <MoonIcon className="h-2.5 w-2.5 text-[#E3C45A]" />
            {card.time}
          </span>
        </div>
      </div>
    </div>

    {/* Footer strip */}
    <div className="flex h-7 shrink-0 items-center justify-between px-2 text-[#D4AF37]">
      <span className="font-serif text-[10px] italic text-[#5A4650]">أصالة وجذور</span>
      <span className="flex items-center gap-1">
        <OllaMiniIcon className="h-2.5 w-2.5" />
        <WheatMiniIcon className="h-2.5 w-2.5" />
        <PalmMiniIcon className="h-2.5 w-2.5" />
      </span>
      <span className="font-serif text-[10px] font-bold text-[#2B1D24]">{card.badge}</span>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* SaidiHeritageSection Component                                             */
/* -------------------------------------------------------------------------- */

export default function SaidiHeritageSection({
  onNext,
  scrollContainerRef,
}: {
  onNext?: () => void;
  scrollContainerRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
} = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Dedicated Audio reference for Section 3 Saidi track
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

  // Sync posRef with the latest motion value
  useMotionValueEvent(x, "change", (latest) => {
    posRef.current = latest;
  });

  /* ---- Magical Reveal: Parallax Scroll Transformation for Heroes ---- */
  // As the user scrolls deeply into Section 3 (after Section 2 has passed),
  // the Saidi characters magically rise from 100% (hidden below floor) to 0% (resting position).
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

    // Normalise current position into (-halfWidth, 0]
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

  /* ---- Strict Saidi Audio Crossfade & Playback Controller ---- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeAnimationRef.current) {
      cancelAnimationFrame(fadeAnimationRef.current);
      fadeAnimationRef.current = null;
    }

    const DURATION = 1200; // 1.2 seconds smooth audio crossfade
    const startTime = performance.now();

    if (inView) {
      // 1. Immediately pause any other audio tracks (e.g., Section 2 Pharaonic audio)
      document.querySelectorAll("audio").forEach((otherAudio) => {
        if (otherAudio !== audio && !otherAudio.paused) {
          otherAudio.pause();
        }
      });

      // 2. Play Section 3 Saidi track with smooth volume fade-in
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
      // Fade out Saidi track when leaving view, then pause
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
      id="section-3-saidi"
      className="relative isolate flex h-[82vh] min-h-[640px] max-h-[820px] w-full flex-col overflow-hidden select-none bg-[#F6EBD9]"
    >
      {/* Saidi Audio Element */}
      <audio
        ref={audioRef}
        src={SAIDI_SECTION_ASSETS.saidiTrack}
        loop
        preload="auto"
        className="hidden"
      />

      {/* Extreme Left & Right Vertical Talli Embroidery Strips */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-[25] w-6"
        style={{
          backgroundImage: TALLI_BORDER_BG,
          backgroundRepeat: "repeat-y",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-[25] w-6"
        style={{
          backgroundImage: TALLI_BORDER_BG,
          backgroundRepeat: "repeat-y",
        }}
      />

      {/* -------------------------------------------------------------------- */}
      {/* PROMINENT UPPER EGYPT BACKGROUND MOTIFS (Visible Framing Icons)      */}
      {/* -------------------------------------------------------------------- */}

      {/* Prominent Clay Olla (قلة قناوي) - Left Watermark Framing */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] md:left-[11%] top-[34%] -translate-y-1/2 z-[5] opacity-25 text-[#D4AF37] transition-all duration-700"
      >
        <ProminentOllaSVG className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 drop-shadow-[0_10px_20px_rgba(212,175,55,0.3)]" />
      </div>

      {/* Prominent Palm Fronds (سعف النخل) - Right Watermark Framing */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] md:right-[11%] top-[34%] -translate-y-1/2 z-[5] opacity-25 text-[#D4AF37] transition-all duration-700"
      >
        <ProminentPalmFrondSVG className="w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 drop-shadow-[0_10px_20px_rgba(212,175,55,0.3)]" />
      </div>

      {/* Upper Wheat Stalks (سنابل القمح) - Symmetrical Top Watermarks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[28%] top-12 z-[5] opacity-20 text-[#D4AF37]"
      >
        <ProminentWheatSVG className="w-28 h-28 md:w-36 md:h-36 rotate-[-15deg]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[28%] top-12 z-[5] opacity-20 text-[#D4AF37]"
      >
        <ProminentWheatSVG className="w-28 h-28 md:w-36 md:h-36 rotate-[15deg] scale-x-[-1]" />
      </div>

      {/* Top-Right Controls */}
      <div className="absolute right-6 top-6 z-40 flex items-center gap-2.5">
        {/* Audio Mute/Unmute Control */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute Saidi music" : "Mute Saidi music"}
          title={isMuted ? "Play Music" : "Mute Music"}
          className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-white/85 px-3 py-2 text-xs font-medium text-[#2B1D24] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow active:scale-95 cursor-pointer"
        >
          <VolumeIcon muted={isMuted} className="h-4 w-4 text-[#D4AF37]" />
          <span className="hidden sm:inline font-sans">{isMuted ? "Unmute" : "Music"}</span>
        </button>

        {/* Marquee Play/Pause Control */}
        <button
          type="button"
          onClick={togglePause}
          aria-pressed={isPaused}
          className="rounded-full border border-[#D4AF37]/50 bg-white/85 px-4 py-2 text-sm text-[#2B1D24] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow active:scale-95 cursor-pointer"
        >
          {isPaused ? "▶ Play" : "❚❚ Pause"}
        </button>

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="rounded-full bg-[#D4AF37] px-4 py-2 text-sm text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#B89220] active:scale-95 cursor-pointer"
          >
            Scene 04: Physics Desk →
          </button>
        )}
      </div>

      {/* Centered Header with generous bottom spacing */}
      <header className="relative z-30 px-6 pt-8 text-center md:pt-10 mb-20 md:mb-24 pb-10 md:pb-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/80 px-4 py-1 text-xs text-[#8A6A1F] shadow-sm">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="#22A06B" />
            <path
              d="M7 12.5l3.2 3.2L17 9"
              stroke="white"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Chapter 03 • الصعيد الجواني
        </span>

        <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl text-[#2B1D24] tracking-tight">
          أصالة وجذور
        </h2>

        <p className="mt-2 font-serif text-sm italic text-[#B08A2E] md:text-base">
          Roots &amp; Authenticity
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

      {/* Hero character: Saidi Groom (Left - Explicitly Mirrored Inward via style & class) */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="pointer-events-none absolute bottom-0 left-0 z-20 h-[95%] max-h-[800px] w-auto max-w-[42vw] min-w-[300px] flex items-end justify-start will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SAIDI_SECTION_ASSETS.groomImage}
          alt="Saidi Groom"
          aria-hidden="true"
          className="-scale-x-100 h-full w-auto object-contain object-bottom drop-shadow-2xl"
          style={{ transform: "scaleX(-1)" }}
        />
      </motion.div>

      {/* Hero character: Saidi Bride (Right - Facing Inward toward Groom) */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="pointer-events-none absolute bottom-0 right-0 z-20 h-[95%] max-h-[800px] w-auto max-w-[42vw] min-w-[300px] flex items-end justify-end will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SAIDI_SECTION_ASSETS.brideImage}
          alt="Saidi Bride"
          aria-hidden="true"
          className="h-full w-auto object-contain object-bottom drop-shadow-2xl"
        />
      </motion.div>

      {/* Footer */}
      <footer className="relative z-30 flex items-center justify-between px-6 pb-5 text-xs text-[#7A6A5A]">
        <span>✦ Hover over any photo card to softly glide and view cherished memories.</span>
        <span className="flex items-center gap-3">
          <span>24 Moments • Infinite Auto-Marquee</span>
          <span className="h-3 w-px bg-[#D4AF37]/50" />
          <span className="font-serif italic text-[#D4AF37]">أصالة وجذور</span>
        </span>
      </footer>
    </section>
  );
}
