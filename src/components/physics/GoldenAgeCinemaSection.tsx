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

export const CINEMA_SECTION_ASSETS = {
  // Hero Character Cutouts (1950s Vintage Cinema Elegance)
  groomImage: "/statues/vintage-groom.png", // Handsome 1950s tuxedo gentleman
  brideImage: "/statues/vintage-bride.png", // Vintage Soad Hosny style glamorous dress

  // Section 4 Audio Track (Classic Abdel Halim Hafez / Golden Age Romance)
  cinemaTrack: "/audio/track-d-cinema.mp3",
};

/* -------------------------------------------------------------------------- */
/* Styling Constants                                                           */
/* -------------------------------------------------------------------------- */

const VINTAGE_BRONZE = "#8B7355";
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
    place: "Cinema Metropole",
    time: "Midnight",
    badge: "★ I",
    photo: "/moments-cinema/01.jpg",
  },
  {
    num: "02",
    corner: "K",
    title: "The Surprise Proposal",
    place: "Nile Corniche Promenade",
    time: "Sunset 1956",
    badge: "★ X",
    photo: "/moments-cinema/02.jpg",
  },
  {
    num: "03",
    corner: "Q",
    title: "Cozy Morning Blanket",
    place: "Garden City Balcony",
    time: "Winter Morning",
    badge: "★ 0",
    photo: "/moments-cinema/03.jpg",
  },
  {
    num: "04",
    corner: "3",
    title: "Candlelit Conversations",
    place: "Groppi Tearoom",
    time: "Late Afternoon",
    badge: "★ C",
    photo: "/moments-cinema/04.jpg",
  },
  {
    num: "05",
    corner: "18",
    title: "Our Very First",
    place: "Opera House Hall",
    time: "Golden Hour",
    badge: "★ BT",
    photo: "/moments-cinema/05.jpg",
  },
  {
    num: "06",
    corner: "9",
    title: "Hands Entwined",
    place: "Studio Misr Gala",
    time: "Moonlit Evening",
    badge: "★ IX",
    photo: "/moments-cinema/06.jpg",
  },
];

const ROTATIONS = [
  "rotate-[-3deg]",
  "rotate-[2deg]",
  "rotate-[-1.5deg]",
  "rotate-[3deg]",
];

/* -------------------------------------------------------------------------- */
/* Vintage 35mm Filmstrip Sprocket Borders                                     */
/* -------------------------------------------------------------------------- */

const svgUri = (svg: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

// 35mm Classic Filmstrip Edge Perforations
const FILMSTRIP_BORDER_BG = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="40" viewBox="0 0 24 40" fill="none" stroke="${VINTAGE_BRONZE}">
    <line x1="2" y1="0" x2="2" y2="40" stroke-width="1.2" opacity="0.5"/>
    <line x1="22" y1="0" x2="22" y2="40" stroke-width="1.2" opacity="0.5"/>
    <rect x="5.5" y="4" width="13" height="12" rx="2" fill="${VINTAGE_BRONZE}" fill-opacity="0.18" stroke-width="1.3"/>
    <rect x="5.5" y="24" width="13" height="12" rx="2" fill="${VINTAGE_BRONZE}" fill-opacity="0.18" stroke-width="1.3"/>
  </svg>`
);

/* -------------------------------------------------------------------------- */
/* PROMINENT VINTAGE CINEMA HERO MOTIFS (1950s Egyptian Golden Age)           */
/* -------------------------------------------------------------------------- */

// Classic 35mm Movie Film Reel (بكرة سينما كلاسيكية)
const ProminentFilmReelSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Outer wheel rim & film teeth */}
    <circle cx="60" cy="60" r="54" strokeWidth="3" />
    <circle cx="60" cy="60" r="48" strokeWidth="1.6" strokeDasharray="3 4" />
    <circle cx="60" cy="60" r="42" strokeWidth="2.2" />

    {/* Center hub */}
    <circle cx="60" cy="60" r="16" strokeWidth="2.4" />
    <circle cx="60" cy="60" r="6" fill="currentColor" fillOpacity="0.25" strokeWidth="2" />

    {/* 5 Classic Film Reel Cutouts / Spokes */}
    {[0, 72, 144, 216, 288].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const cx = 60 + 29 * Math.cos(rad);
      const cy = 60 + 29 * Math.sin(rad);
      return (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="9"
          strokeWidth="2.2"
          fill="currentColor"
          fillOpacity="0.15"
        />
      );
    })}
  </svg>
);

// Vintage Gramophone with Brass Horn (جرامافون كلاسيكي)
const ProminentGramophoneSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Wooden Cabinet Base */}
    <rect x="25" y="86" width="60" height="22" rx="3" strokeWidth="2.6" />
    <line x1="20" y1="108" x2="90" y2="108" strokeWidth="3" />
    <line x1="30" y1="97" x2="80" y2="97" strokeWidth="1.5" strokeDasharray="2 3" />
    {/* Winding Crank */}
    <path d="M85 97 L96 97 L96 90" strokeWidth="2.2" />
    <circle cx="96" cy="88" r="3" fill="currentColor" fillOpacity="0.3" strokeWidth="1.5" />

    {/* Vinyl Record & Turntable Platter */}
    <ellipse cx="55" cy="84" rx="28" ry="6" strokeWidth="2.4" />
    <ellipse cx="55" cy="84" rx="10" ry="2.5" strokeWidth="1.6" />
    <circle cx="55" cy="84" r="1.5" fill="currentColor" />

    {/* Tonearm */}
    <path d="M55 84 Q48 72 38 68" strokeWidth="2" />
    <ellipse cx="54" cy="84" rx="3" ry="1.5" strokeWidth="1.5" />

    {/* Brass Horn Sound Conduit & Mega Horn Bell */}
    <path d="M38 68 C34 60 40 44 60 38" strokeWidth="2.8" />
    <path
      d="M58 40 C75 35 90 24 102 10 C96 28 92 48 80 58 C70 54 64 48 58 40 Z"
      strokeWidth="2.4"
      fill="currentColor"
      fillOpacity="0.12"
    />
    <ellipse cx="98" cy="16" rx="14" ry="10" transform="rotate(-30 98 16)" strokeWidth="2.4" />
  </svg>
);

// Vintage 1950s Studio Ribbon Microphone (ميكروفون إذاعي عتيق)
const ProminentMicrophoneSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 100 120"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Retro Oval Capsule */}
    <rect x="36" y="16" width="28" height="48" rx="14" strokeWidth="2.5" />
    {/* Horizontal Louver Ribs */}
    <line x1="38" y1="28" x2="62" y2="28" strokeWidth="1.8" />
    <line x1="37" y1="38" x2="63" y2="38" strokeWidth="2" />
    <line x1="38" y1="48" x2="62" y2="48" strokeWidth="1.8" />
    <line x1="41" y1="56" x2="59" y2="56" strokeWidth="1.6" />

    {/* U-Shape Swivel Mount */}
    <path d="M28 38 C28 64 72 64 72 38" strokeWidth="2.4" />
    <circle cx="28" cy="38" r="3" fill="currentColor" />
    <circle cx="72" cy="38" r="3" fill="currentColor" />

    {/* Stem & Heavy Desk Base */}
    <line x1="50" y1="64" x2="50" y2="98" strokeWidth="3" />
    <ellipse cx="50" cy="100" rx="20" ry="7" strokeWidth="2.6" />
    <line x1="30" y1="107" x2="70" y2="107" strokeWidth="3" />
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

const FilmIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <rect x="2" y="2" width="20" height="20" rx="3" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="12" x2="7" y2="12" />
    <line x1="2" y1="17" x2="7" y2="17" />
    <line x1="17" y1="7" x2="22" y2="7" />
    <line x1="17" y1="12" x2="22" y2="12" />
    <line x1="17" y1="17" x2="22" y2="17" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* Vintage Cinema Photo Card (Sepia / Warm Silver Tone)                        */
/* -------------------------------------------------------------------------- */

const PhotoCard: React.FC<{ card: MomentCard; rotation: string }> = ({
  card,
  rotation,
}) => (
  <div
    className={`flex w-[clamp(200px,20vw,280px)] aspect-[3/4] shrink-0 flex-col rounded-md border-[6px] border-white bg-[#FDFBF7] shadow-[0_14px_30px_-8px_rgba(70,60,50,0.3)] transition-transform duration-500 hover:scale-105 ${rotation}`}
  >
    {/* Top strip */}
    <div className="flex h-7 shrink-0 items-center justify-between px-2 text-[#7A6E65]">
      <span className="flex items-center gap-1 font-serif text-sm font-bold leading-none text-[#2A2421]">
        {card.corner}
        <FilmIcon className="h-3 w-3 text-[#A38F78]" />
      </span>
      <span className="text-[10px] tracking-widest text-[#A38F78]">SCENE #{card.num}</span>
      <HeartIcon className="h-3 w-3 text-[#B08968]" />
    </div>

    {/* Photo with subtle nostalgic vintage sepia warmth */}
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-sm bg-stone-300">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.photo}
        alt={card.title}
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover brightness-[1.02] contrast-[1.08] sepia-[0.18]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-2.5 pb-2 pt-8 text-white">
        <p className="font-serif text-lg leading-tight tracking-wide">{card.title}</p>
        <div className="mt-1 flex items-center justify-between text-[10px] text-white/90">
          <span className="flex items-center gap-1">
            <PinIcon className="h-2.5 w-2.5 text-[#E6D5B8]" />
            {card.place}
          </span>
          <span className="text-[#E6D5B8]">{card.time}</span>
        </div>
      </div>
    </div>

    {/* Footer strip */}
    <div className="flex h-7 shrink-0 items-center justify-between px-2 text-[#7A6E65]">
      <span className="font-serif text-[10px] italic text-[#594F48]">زمن الفن الجميل</span>
      <span className="flex items-center gap-1 text-[#A38F78]">
        <FilmIcon className="h-2.5 w-2.5" />
        <span className="text-[9px]">✦</span>
        <FilmIcon className="h-2.5 w-2.5" />
      </span>
      <span className="font-serif text-[10px] font-bold text-[#2A2421]">{card.badge}</span>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* GoldenAgeCinemaSection Component                                            */
/* -------------------------------------------------------------------------- */

export default function GoldenAgeCinemaSection({
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
      .catch(() => { });
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
      // Pause any preceding audio tracks
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
            audio.play().catch(() => { });
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
      id="section-4-cinema"
      className="relative isolate flex h-[82vh] min-h-[640px] max-h-[820px] w-full flex-col overflow-hidden select-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#F4EFEA] via-[#E2D5C4] to-[#C8B8A6]"
    >
      {/* Golden Age Cinema Soundtrack (Track D: Abdel Halim Hafez) */}
      <audio
        ref={audioRef}
        src={CINEMA_SECTION_ASSETS.cinemaTrack}
        loop
        preload="auto"
        className="hidden"
      />

      {/* 35mm Filmstrip Sprocket Perforations on Left & Right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-[25] w-6 opacity-60"
        style={{
          backgroundImage: FILMSTRIP_BORDER_BG,
          backgroundRepeat: "repeat-y",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-[25] w-6 opacity-60"
        style={{
          backgroundImage: FILMSTRIP_BORDER_BG,
          backgroundRepeat: "repeat-y",
        }}
      />

      {/* -------------------------------------------------------------------- */}
      {/* PROMINENT VINTAGE CINEMA WATERMARKS (Film Reel, Gramophone, Radio)   */}
      {/* -------------------------------------------------------------------- */}

      {/* Prominent 35mm Film Reel - Left Flank */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] md:left-[11%] top-[34%] -translate-y-1/2 z-[5] opacity-15 text-[#8B7355] transition-all duration-700"
      >
        <ProminentFilmReelSVG className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 drop-shadow-md" />
      </div>

      {/* Prominent Vintage Gramophone - Right Flank */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] md:right-[11%] top-[34%] -translate-y-1/2 z-[5] opacity-15 text-[#8B7355] transition-all duration-700"
      >
        <ProminentGramophoneSVG className="w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 drop-shadow-md" />
      </div>

      {/* Symmetrical Vintage Microphones atop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[28%] top-12 z-[5] opacity-15 text-[#8B7355]"
      >
        <ProminentMicrophoneSVG className="w-28 h-28 md:w-34 md:h-34 rotate-[-12deg]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[28%] top-12 z-[5] opacity-15 text-[#8B7355]"
      >
        <ProminentMicrophoneSVG className="w-28 h-28 md:w-34 md:h-34 rotate-[12deg] scale-x-[-1]" />
      </div>

      {/* Top-Right Controls */}
      <div className="absolute right-6 top-6 z-40 flex items-center gap-2.5">
        {/* Audio Mute/Unmute */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute Cinema Music" : "Mute Cinema Music"}
          title={isMuted ? "Play Music" : "Mute Music"}
          className="flex items-center gap-1.5 rounded-full border border-[#A38F78]/50 bg-white/85 px-3 py-2 text-xs font-medium text-[#2A2421] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow active:scale-95 cursor-pointer"
        >
          <VolumeIcon muted={isMuted} className="h-4 w-4 text-[#7A6E65]" />
          <span className="hidden sm:inline font-sans">{isMuted ? "Unmute" : "Music"}</span>
        </button>

        {/* Marquee Play/Pause */}
        <button
          type="button"
          onClick={togglePause}
          aria-pressed={isPaused}
          className="rounded-full border border-[#A38F78]/50 bg-white/85 px-4 py-2 text-sm text-[#2A2421] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow active:scale-95 cursor-pointer"
        >
          {isPaused ? "▶ Play" : "❚❚ Pause"}
        </button>

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="rounded-full bg-[#7A6E65] px-4 py-2 text-sm text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#63574F] active:scale-95 cursor-pointer"
          >
            Scene 05: Physics Desk →
          </button>
        )}
      </div>

      {/* Centered Header with generous bottom clearance */}
      <header className="relative z-30 px-6 pt-8 text-center md:pt-10 mb-20 md:mb-24 pb-10 md:pb-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#A38F78]/40 bg-white/80 px-4 py-1 text-xs text-[#594F48] shadow-sm">
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
          Chapter 04 • السينما المصرية القديمة
        </span>

        <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl text-[#241D1A] tracking-tight">
          زمن الفن الجميل
        </h2>

        <p className="mt-2 font-serif text-sm italic text-[#7A6E65] md:text-base">
          The Golden Age of Egyptian Cinema • 1950s Romance
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

      {/* Left Character: 1950s Tuxedo Gentleman (Mirrored Inward with scale-x-[-1]) */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="pointer-events-none absolute bottom-0 left-0 z-20 h-[95%] max-h-[800px] w-auto max-w-[42vw] min-w-[300px] flex items-end justify-start will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CINEMA_SECTION_ASSETS.groomImage}
          alt="1950s Groom in Tuxedo"
          aria-hidden="true"
          className="-scale-x-100 h-full w-auto object-contain object-bottom drop-shadow-2xl"
          style={{ transform: "scaleX(-1)" }}
        />
      </motion.div>

      {/* Right Character: Vintage Soad Hosny Style Glamorous Lady (Facing Inward) */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="pointer-events-none absolute bottom-0 right-0 z-20 h-[95%] max-h-[800px] w-auto max-w-[42vw] min-w-[300px] flex items-end justify-end will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CINEMA_SECTION_ASSETS.brideImage}
          alt="1950s Vintage Bride"
          aria-hidden="true"
          className="h-full w-auto object-contain object-bottom drop-shadow-2xl"
        />
      </motion.div>

      {/* Footer */}
      <footer className="relative z-30 flex items-center justify-between px-6 pb-5 text-xs text-[#6A6058]">
        <span>✦ Hover over any photo card to softly glide and view cherished memories.</span>
        <span className="flex items-center gap-3">
          <span>24 Moments • Infinite Auto-Marquee</span>
          <span className="h-3 w-px bg-[#A38F78]/50" />
          <span className="font-serif italic text-[#7A6E65]">زمن الفن الجميل</span>
        </span>
      </footer>
    </section>
  );
}
