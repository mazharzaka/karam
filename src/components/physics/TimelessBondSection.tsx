"use client";

import { SmoothImage } from "@/components/SmoothImage";
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
  useScroll,
  useTransform,
} from "framer-motion";
import { useGlobalAudio } from "@/utils/globalAudioCoordinator";
import {
  useWeddingConfig,
  mergeGalleryIntoCards,
  isImageFlipped,
} from "@/context/WeddingConfigContext";

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

const GOLD = "#C9A227";
const MARQUEE_SPEED_PX_PER_SEC = 45;
const STATUE_LEFT_SRC = "/statues/tutankhamun.png";
const STATUE_RIGHT_SRC = "/statues/nefertiti.png";

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
  { num: "01", corner: "K", title: "The Sparkler", place: "Midnight Celebrations", time: "Midnight", badge: "★ I", photo: "/moments/01.jpg" },
  { num: "02", corner: "K", title: "The Surprise Proposal", place: "Terrace by the Sea", time: "August Evening", badge: "★ X", photo: "/moments/02.jpg" },
  { num: "03", corner: "Q", title: "Cozy Morning Blanket", place: "Old Hearth", time: "Winter Cabin", badge: "★ 0", photo: "/moments/03.jpg" },
  { num: "04", corner: "3", title: "Candlelit Conversations", place: "Piazza Lights", time: "Midnight Walk", badge: "★ C", photo: "/moments/04.jpg" },
  { num: "05", corner: "18", title: "Our Very First", place: "Evening Melody", time: "Golden Hour", badge: "★ BT", photo: "/moments/05.jpg" },
  { num: "06", corner: "9", title: "Hands Entwined", place: "The Vow Ceremony", time: "Evening", badge: "★ IX", photo: "/moments/06.jpg" },
];

// Static class strings so Tailwind can see them. Picked by ORIGINAL card index so
// the duplicated half of the track matches the first half exactly (seamless loop).
const ROTATIONS = ["rotate-[-3deg]", "rotate-[2deg]", "rotate-[-1.5deg]", "rotate-[3deg]"];

/* -------------------------------------------------------------------------- */
/* Inline SVG backgrounds (data URIs)                                          */
/* -------------------------------------------------------------------------- */

const svgUri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

const PATTERN_BG = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none" stroke="${GOLD}" stroke-width="1.4" stroke-linecap="round">
    <g transform="translate(34 14)"><ellipse cx="0" cy="8" rx="7" ry="9"/><line x1="0" y1="17" x2="0" y2="44"/><line x1="-13" y1="26" x2="13" y2="26"/></g>
    <g transform="translate(86 78)"><path d="M-22 0 Q0 -16 22 0 Q0 16 -22 0Z"/><circle cx="0" cy="0" r="4" fill="${GOLD}"/><path d="M-24 -9 Q0 -24 24 -9"/><path d="M0 9 V22"/><path d="M-6 8 Q-10 20 -18 18"/></g>
    <g transform="translate(34 124)"><path d="M0 -16 Q-9 -4 0 8 Q9 -4 0 -16Z"/><path d="M-4 6 Q-18 -4 -16 -14 Q-6 -10 -2 2"/><path d="M4 6 Q18 -4 16 -14 Q6 -10 2 2"/><line x1="0" y1="8" x2="0" y2="20"/></g>
    <g transform="translate(126 26)"><ellipse cx="0" cy="8" rx="5" ry="7"/><line x1="0" y1="15" x2="0" y2="34"/><line x1="-9" y1="22" x2="9" y2="22"/></g>
  </svg>`
);

const EDGE_STRIP_BG = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="44" viewBox="0 0 24 44" fill="none" stroke="${GOLD}" stroke-width="1.6" stroke-linejoin="miter">
    <line x1="1" y1="0" x2="1" y2="44" stroke-width="1"/><line x1="23" y1="0" x2="23" y2="44" stroke-width="1"/>
    <path d="M5 40 V4 H19 V30 H10 V16 H14"/>
  </svg>`
);

/* -------------------------------------------------------------------------- */
/* Tiny inline icons                                                           */
/* -------------------------------------------------------------------------- */

const Ankh: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <ellipse cx="12" cy="7" rx="4" ry="5" />
    <line x1="12" y1="12" x2="12" y2="22" />
    <line x1="6" y1="15" x2="18" y2="15" />
  </svg>
);

const Eye: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M2 12 Q12 4 22 12 Q12 20 2 12Z" />
    <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    <path d="M12 16 V21" />
  </svg>
);

const Lotus: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M12 4 Q7 10 12 17 Q17 10 12 4Z" />
    <path d="M10 16 Q3 14 3 7 Q9 8 11 14" />
    <path d="M14 16 Q21 14 21 7 Q15 8 13 14" />
  </svg>
);

const Sun: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="8" strokeDasharray="2 3" />
  </svg>
);

const Heart: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.3 3 5 6.3 5c2 0 3.4 1.1 4.2 2.4h3C14.3 6.1 15.7 5 17.7 5 21 5 23.1 8.3 21.6 11.8 19.5 16.4 12 21 12 21z" />
  </svg>
);

const Pin: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

const Moon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
  </svg>
);

const VolumeIcon: React.FC<{ muted?: boolean; className?: string }> = ({ muted, className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

/* -------------------------------------------------------------------------- */
/* Card                                                                        */
/* -------------------------------------------------------------------------- */

const PhotoCard: React.FC<{ card: MomentCard; rotation: string }> = ({ card, rotation }) => (
  <div
    className={`flex w-[clamp(200px,20vw,280px)] aspect-[3/4] shrink-0 flex-col rounded-md border-[6px] border-white bg-[#FFFDF8] shadow-[0_14px_28px_-8px_rgba(120,60,70,0.35)] transition-transform duration-500 hover:scale-105 ${rotation}`}
  >
    {/* Top strip */}
    <div className="flex h-7 shrink-0 items-center justify-between px-2 text-[#8A6A1F]">
      <span className="flex items-center gap-0.5 font-serif text-sm font-bold leading-none text-[#2B1D24]">
        {card.corner}
        <Ankh className="h-3 w-3 text-[#C9A227]" />
      </span>
      <span className="text-[10px] tracking-widest text-[#C9A227]">CARD #{card.num}</span>
      <Heart className="h-3 w-3 text-pink-400" />
    </div>

    {/* Photo */}
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-sm bg-zinc-900">
      <SmoothImage
        src={card.photo}
        alt={card.title}
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover brightness-[1.03] saturate-[0.95]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 pb-2 pt-8 text-white">
        <p className="font-serif text-lg leading-tight">{card.title}</p>
        <div className="mt-1 flex items-center justify-between text-[10px] text-white/90">
          <span className="flex items-center gap-1">
            <Pin className="h-2.5 w-2.5 text-[#E3C45A]" />
            {card.place}
          </span>
          <span className="flex items-center gap-1">
            <Moon className="h-2.5 w-2.5 text-[#E3C45A]" />
            {card.time}
          </span>
        </div>
      </div>
    </div>

    {/* Footer strip */}
    <div className="flex h-7 shrink-0 items-center justify-between px-2 text-[#C9A227]">
      <span className="font-serif text-[10px] italic text-[#5A4650]">A Timeless Bond</span>
      <span className="flex items-center gap-1">
        <Ankh className="h-2.5 w-2.5" />
        <Eye className="h-2.5 w-2.5" />
        <Lotus className="h-2.5 w-2.5" />
        <Sun className="h-2.5 w-2.5" />
      </span>
      <span className="font-serif text-[10px] font-bold text-[#2B1D24]">{card.badge}</span>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

export default function TimelessBondSection({
  onNext,
  scrollContainerRef,
}: {
  onNext?: () => void;
  scrollContainerRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
} = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { config } = useWeddingConfig();
  const dynamicCards = React.useMemo(
    () => mergeGalleryIntoCards(CARDS, config.gallery, 0),
    [config.gallery]
  );

  const controls = useAnimation();
  const x = useMotionValue(0);

  const [loopDistance, setLoopDistance] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { isEnabled: isGlobalAudioEnabled, toggleAudio: toggleGlobalAudio, playTrack, stopTrack } = useGlobalAudio();
  const isAudioMuted = !isGlobalAudioEnabled;

  const pausedRef = useRef(false);
  const runIdRef = useRef(0);

  /* ---- Scroll-Linked Parallax Elevator for Statues ---- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollContainerRef?.current ? scrollContainerRef : undefined,
    offset: ["start end", "end start"],
  });

  // As the user scrolls into Section 2, statues rise from y: "100%" (hidden beneath floor)
  // to resting position "0%". When scrolling past, they sink smoothly back to "100%".
  const statueY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.45, 0.72, 0.96],
    ["100%", "100%", "0%", "0%", "100%"]
  );

  const statueOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.38, 0.74, 0.96],
    [0, 0, 1, 1, 0]
  );

  const isInView = useInView(sectionRef, {
    root: scrollContainerRef?.current ? scrollContainerRef : undefined,
    amount: 0.3,
  });

  /* ---- Measure the exact distance of one full set of cards ---- */
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const first = track.children[0] as HTMLElement | undefined;
      const copy = track.children[CARDS.length] as HTMLElement | undefined;
      if (first && copy) setLoopDistance(copy.offsetLeft - first.offsetLeft);
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

  /* ---- Marquee loop: resumes from the current x, restarts at 0 on completion ---- */
  const run = useCallback(() => {
    if (!loopDistance || pausedRef.current) return;

    const id = ++runIdRef.current;

    // Normalise the current x into (-loopDistance, 0]
    let start = x.get() % loopDistance;
    if (start > 0) start -= loopDistance;
    x.set(start);

    const remaining = loopDistance + start;
    controls
      .start({
        x: [start, -loopDistance],
        transition: { duration: remaining / MARQUEE_SPEED_PX_PER_SEC, ease: "linear" },
      })
      .then(() => {
        if (runIdRef.current !== id || pausedRef.current) return; // stale or paused
        x.set(0);
        run();
      })
      .catch(() => { });
  }, [controls, loopDistance, x]);

  useEffect(() => {
    run();
    return () => {
      runIdRef.current += 1; // invalidate any pending .then()
      controls.stop();
    };
  }, [run, controls]);

  const togglePause = () => {
    if (pausedRef.current) {
      pausedRef.current = false;
      setIsPaused(false);
      run(); // resumes from the stored x
    } else {
      pausedRef.current = true;
      setIsPaused(true);
      runIdRef.current += 1;
      controls.stop(); // x keeps its current value
    }
  };

  const toggleAudio = () => {
    toggleGlobalAudio();
  };

  /* ---- Audio: play while the section is in view with smooth crossfade ---- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isInView && isGlobalAudioEnabled) {
      playTrack(audio, 0.85);
    } else {
      stopTrack(audio, 800);
    }
  }, [isInView, isGlobalAudioEnabled, playTrack, stopTrack]);

  const loopedCards = [...dynamicCards, ...dynamicCards];

  return (
    <section
      ref={sectionRef}
      id="section-2-timeless"
      className="relative isolate flex h-[82vh] min-h-[640px] max-h-[820px] w-full flex-col overflow-hidden select-none bg-[#FCEBF0]"
    >
      <audio
        ref={audioRef}
        loop
        preload="auto"
        className="hidden"
      />

      {/* Faint Egyptian line pattern (~6%) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.06]"
        style={{ backgroundImage: PATTERN_BG, backgroundSize: "160px 160px" }}
      />

      {/* Gold ornamental edge strips */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-[25] w-6"
        style={{ backgroundImage: EDGE_STRIP_BG, backgroundRepeat: "repeat-y" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-[25] w-6"
        style={{ backgroundImage: EDGE_STRIP_BG, backgroundRepeat: "repeat-y" }}
      />

      {/* Top-right controls */}
      <div className="absolute right-6 top-6 z-50 flex items-center gap-2.5 md:right-12 md:top-8">
        {/* Audio Mute/Play Control Button */}
        <button
          type="button"
          onClick={toggleAudio}
          aria-label={isAudioMuted ? "Unmute Pharaonic music" : "Mute Pharaonic music"}
          title={isAudioMuted ? "Play Music" : "Mute Music"}
          className="flex items-center gap-1.5 rounded-full border border-[#C9A227]/50 bg-white/85 px-3 py-2 text-xs font-medium text-[#2B1D24] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow active:scale-95 cursor-pointer"
        >
          <VolumeIcon muted={isAudioMuted} className="h-4 w-4 text-[#C9A227]" />
          <span className="hidden sm:inline font-sans">{isAudioMuted ? "Unmute" : "Music"}</span>
        </button>

        <button
          type="button"
          onClick={togglePause}
          aria-pressed={isPaused}
          className="rounded-full border border-[#C9A227]/50 bg-white/85 px-4 py-2 text-sm text-[#2B1D24] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow active:scale-95 cursor-pointer"
        >
          {isPaused ? "▶ Play" : "❚❚ Pause"}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-full bg-[#C9A227] px-4 py-2 text-sm text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#B89220] active:scale-95 cursor-pointer"
        >
          Scene 03: Physics Desk →
        </button>
      </div>

      {/* Perfectly Centered Header with generous bottom spacing */}
      <header className="relative z-30 flex flex-col items-center text-center w-full px-6 pt-8 pb-6 md:pb-10 mb-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 bg-white/80 px-4 py-1 text-xs text-[#8A6A1F] shadow-sm">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="#22A06B" />
            <path d="M7 12.5l3.2 3.2L17 9" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Chapter 02 • The Timeless Journey
        </span>

        <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#2B1D24] max-w-3xl tracking-tight">
          {config.groomName} &amp; {config.brideName}
        </h2>

        <p className="mt-2 font-serif text-sm italic text-[#B08A2E] md:text-base max-w-2xl">
          Across every lifetime and every horizon, {config.groomName} &amp; {config.brideName}&apos;s hearts always find their way together.
        </p>
      </header>

      {/* Card row */}
      <div className="relative z-10 my-auto h-[440px] min-h-[400px] overflow-hidden">
        <motion.div
          ref={trackRef}
          animate={controls}
          style={{ x }}
          className="flex h-full w-max items-center will-change-transform"
        >
          {loopedCards.map((card, i) => (
            // pr-6 acts as the 24px gap so the loop distance is exactly one set of cards
            <div key={`${card.num}-${i}`} className="shrink-0 pr-6">
              <PhotoCard card={card} rotation={ROTATIONS[(i % CARDS.length) % ROTATIONS.length]} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Hero character: Pharaonic Groom (Left - Mirrored Inward via style & class, matching Saidi section) */}
      <motion.div
        style={{ y: statueY, opacity: statueOpacity }}
        className="pointer-events-none absolute bottom-0 left-0 z-20 h-[95%] max-h-[800px] w-auto max-w-[42vw] min-w-[300px] flex items-end justify-start will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.pharaonicGroomUrl || STATUE_LEFT_SRC}
          alt={`${config.groomName} Pharaonic Guardian`}
          aria-hidden="true"
          className="h-full w-auto object-contain object-bottom drop-shadow-2xl"
          style={{
            transform: isImageFlipped(config, "pharaonicGroomUrl", true)
              ? "scaleX(-1)"
              : "none",
          }}
        />
      </motion.div>

      {/* Hero character: Pharaonic Bride (Right - Standard Facing, matching Saidi section) */}
      <motion.div
        style={{ y: statueY, opacity: statueOpacity }}
        className="pointer-events-none absolute bottom-0 right-0 z-20 h-[95%] max-h-[800px] w-auto max-w-[42vw] min-w-[300px] flex items-end justify-end will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.pharaonicBrideUrl || STATUE_RIGHT_SRC}
          alt={`${config.brideName} Pharaonic Guardian`}
          aria-hidden="true"
          style={{
            transform: isImageFlipped(config, "pharaonicBrideUrl", false)
              ? "scaleX(-1)"
              : "none",
          }}
          className="h-full w-auto object-contain object-bottom drop-shadow-2xl"
        />
      </motion.div>

      {/* Footer */}
      <footer className="relative z-30 flex items-center justify-between px-6 pb-5 text-xs text-[#7A6A5A]">
        <span>✦ Hover over any photo card to softly glide and view cherished memories.</span>
        <span className="flex items-center gap-3">
          <span>24 Moments • Infinite Auto-Marquee</span>
        </span>
      </footer>
    </section >
  );
}

