"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useAnimation,
  useInView,
  useMotionValue,
} from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Heart,
  Play,
  Pause,
  Compass,
  Calendar,
  MapPin,
} from "lucide-react";
import { sceneAudio } from "@/utils/sceneAudioController";

// =========================================================================
// SWAPPABLE ASSETS (replace later with AI-generated bride & groom faces)
// =========================================================================
export const DEFAULT_LEFT_GUARDIAN_IMG = "/images/guardian-tutankhamun.png";
export const DEFAULT_RIGHT_GUARDIAN_IMG = "/images/guardian-nefertiti.png"; // Nefertiti with pink bow + roses
export const PHARAONIC_TRACK_SRC = "/audio/pharaonic.mp3";

const MARQUEE_LOOP_SECONDS = 52; // one full 0% -> -50% pass at normal speed
const HOVER_SPEED = 0.15; // gentle glide while hovering the cards
const TRACK_VOLUME = 0.7;

export interface Scene2DraggableFilmstripProps {
  onNext?: () => void;
  isActive?: boolean;
  /** Mirrors the global sound toggle from the scene manager. */
  isMusicEnabled?: boolean;
  /** Fired once the Pharaonic track actually starts playing (lets the HUD show "sound on"). */
  onAudioStart?: () => void;
  leftGuardianUrl?: string; // Groom / King Tutankhamun
  rightGuardianUrl?: string; // Bride / Queen Nefertiti
  leftGuardianName?: string;
  rightGuardianName?: string;
  autoPlayAudio?: boolean;
}

export interface TimelessPharaonicCard {
  id: number;
  rank: string;
  hieroglyphsTop: string;
  hieroglyphsBottom: string;
  footerIndex: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
}

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`;

const G1 = "𓇳 𓋹 𓊽";
const G2 = "𓆣 𓆗 𓇳";
const G3 = "𓇳 𓁹 𓋹";
const G4 = "𓊽 𓆣 𓇳";
const B1 = "𓋹 𓇳 𓊽 𓆣 𓆗";
const B2 = "𓊽 𓆣 𓋹 𓇳 𓁹";
const B3 = "𓇳 𓊽 𓆣 𓆗 𓋹";
const B4 = "𓆗 𓋹 𓇳 𓊽 𓁹";

// 12 normal romantic couple moments
const TIMELESS_COUPLE_CARDS: TimelessPharaonicCard[] = [
  { id: 1, rank: "A ✦", hieroglyphsTop: G1, hieroglyphsBottom: B1, footerIndex: "★ I", title: "Golden Hour Whispers", date: "Summer Solstice", location: "Coastline Cliffs", imageUrl: U("photo-1519741497674-611481863552") },
  { id: 2, rank: "K ✦", hieroglyphsTop: G1, hieroglyphsBottom: B1, footerIndex: "★ X", title: "The Surprise Proposal", date: "August Evening", location: "Terrace by the Sea", imageUrl: U("photo-1515934751635-c81c6bc9a2d8") },
  { id: 3, rank: "Q ✦", hieroglyphsTop: G2, hieroglyphsBottom: B2, footerIndex: "★ Q", title: "Cozy Morning Blanket", date: "Winter Cabin", location: "Old Hearth", imageUrl: U("photo-1522673607200-164d1b6ce486") },
  { id: 4, rank: "3 ✦", hieroglyphsTop: G3, hieroglyphsBottom: B3, footerIndex: "★ C", title: "Candlelit Conversations", date: "Midnight Walk", location: "Piazza Lights", imageUrl: U("photo-1516589178581-6cd7833ae3b2") },
  { id: 5, rank: "18 ♥", hieroglyphsTop: G4, hieroglyphsBottom: B4, footerIndex: "★ BT", title: "Holding Close at Sunset", date: "Golden Rays", location: "Warm Sands", imageUrl: U("photo-1520854221256-17451cc331bf") },
  { id: 6, rank: "A ✦", hieroglyphsTop: G1, hieroglyphsBottom: B1, footerIndex: "★ VI", title: "The Sparkler Send-Off", date: "Midnight Celebrations", location: "Garden Courtyard", imageUrl: U("photo-1537633552985-df8429e8048b") },
  { id: 7, rank: "K ♥", hieroglyphsTop: G2, hieroglyphsBottom: B2, footerIndex: "★ VII", title: "Our Very First Dance", date: "Evening Melody", location: "Under String Lights", imageUrl: U("photo-1469371670807-013ccf25f16a") },
  { id: 8, rank: "Q ♦", hieroglyphsTop: G3, hieroglyphsBottom: B3, footerIndex: "★ VIII", title: "Hands Entwined Forever", date: "Vow Ceremony", location: "The Altar", imageUrl: U("photo-1465495976277-4387d4b0b4c6") },
  { id: 9, rank: "J ✦", hieroglyphsTop: G4, hieroglyphsBottom: B4, footerIndex: "★ IX", title: "Strolling the Coastline", date: "Endless Horizon", location: "Ocean Breeze", imageUrl: U("photo-1524863479829-916d8e77f114") },
  { id: 10, rank: "10 ♥", hieroglyphsTop: G1, hieroglyphsBottom: B1, footerIndex: "★ X", title: "A Heartfelt Embrace", date: "Golden Afternoon", location: "Olive Grove", imageUrl: U("photo-1513279922550-250c2129b13a") },
  { id: 11, rank: "K ✦", hieroglyphsTop: G2, hieroglyphsBottom: B2, footerIndex: "★ XI", title: "Laughter in the Meadows", date: "Spring Sun", location: "Open Field", imageUrl: U("photo-1532712938310-34cb3982ef74") },
  { id: 12, rank: "Q ♥", hieroglyphsTop: G3, hieroglyphsBottom: B4, footerIndex: "★ XII", title: "Pure Joy Together", date: "Unscripted Moment", location: "Everywhere With You", imageUrl: U("photo-1494774157365-9e04c6720e47") },
];

// =========================================================================
// AUDIO HELPER: smooth volume fade for an HTMLAudioElement
// =========================================================================
const fadeTimers = new Map<HTMLAudioElement, number>();

function fadeAudio(audio: HTMLAudioElement, to: number, ms: number, onDone?: () => void) {
  const existing = fadeTimers.get(audio);
  if (existing !== undefined) window.clearInterval(existing);

  const from = audio.volume;
  const startedAt = performance.now();
  const timer = window.setInterval(() => {
    const t = Math.min(1, (performance.now() - startedAt) / ms);
    audio.volume = Math.min(1, Math.max(0, from + (to - from) * t));
    if (t >= 1) {
      window.clearInterval(timer);
      fadeTimers.delete(audio);
      onDone?.();
    }
  }, 40);
  fadeTimers.set(audio, timer);
}

// Decorative SVG symbols
const AnkhIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
    <ellipse cx="32" cy="17" rx="9" ry="11" />
    <line x1="32" y1="28" x2="32" y2="60" />
    <line x1="15" y1="38" x2="49" y2="38" />
  </svg>
);

const EyeOfHorusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 80 50" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <path d="M10 26 Q40 6 70 26 Q40 44 10 26 Z" />
    <circle cx="40" cy="26" r="5.5" fill="currentColor" />
    <path d="M8 16 Q40 2 72 16" strokeWidth="2.8" />
    <path d="M40 34 L40 46" />
    <path d="M33 33 Q28 45 18 43" />
  </svg>
);

export const Scene2DraggableFilmstrip: React.FC<Scene2DraggableFilmstripProps> = ({
  onNext,
  isMusicEnabled = true,
  onAudioStart,
  leftGuardianUrl = DEFAULT_LEFT_GUARDIAN_IMG,
  rightGuardianUrl = DEFAULT_RIGHT_GUARDIAN_IMG,
  leftGuardianName = "King Tutankhamun",
  rightGuardianName = "Queen Nefertiti",
  autoPlayAudio = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.5 });

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [mouseX, setMouseX] = useState<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setMouseX((e.clientX / window.innerWidth - 0.5) * 2);
  }, []);

  // 12 cards duplicated -> seamless 0% to -50% loop
  const duplicatedCards = useMemo(
    () => [...TIMELESS_COUPLE_CARDS, ...TIMELESS_COUPLE_CARDS],
    []
  );

  // =========================================================================
  // 1. PAUSE / PLAY FIX: useAnimation controls + isPaused state
  //    - paused  -> animationControls.stop()  (freezes at the current x)
  //    - playing -> animationControls.start() resumes from the CURRENT x, then
  //                 continues with the infinite 0% -> -50% loop (no jump)
  // =========================================================================
  const animationControls = useAnimation();
  const x = useMotionValue<string>("0%");
  const runTokenRef = useRef<number>(0);

  const startMarquee = useCallback(
    (speed: number) => {
      const token = ++runTokenRef.current;
      const loopDuration = MARQUEE_LOOP_SECONDS / speed;
      const current = Math.min(0, Math.max(-50, parseFloat(String(x.get())) || 0));
      const remainingFraction = (50 + current) / 50;

      // Finish the current pass from where we are...
      animationControls
        .start({
          x: [`${current}%`, "-50%"],
          transition: { duration: Math.max(0.05, loopDuration * remainingFraction), ease: "linear" },
        })
        .then(() => {
          if (runTokenRef.current !== token) return; // interrupted (paused / speed change)
          // ...then loop forever with a seamless wrap
          x.set("0%");
          animationControls.start({
            x: ["0%", "-50%"],
            transition: { duration: loopDuration, ease: "linear", repeat: Infinity, repeatType: "loop" },
          });
        })
        .catch(() => { });
    },
    [animationControls, x]
  );

  useEffect(() => {
    if (isPaused) {
      runTokenRef.current++; // invalidate pending continuation
      animationControls.stop();
    } else {
      startMarquee(isHovered ? HOVER_SPEED : 1);
    }
  }, [isPaused, isHovered, animationControls, startMarquee]);

  useEffect(() => {
    return () => {
      // runTokenRef is a plain counter (not a DOM node), so reading .current here is intentional.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      runTokenRef.current++;
      animationControls.stop();
    };
  }, [animationControls]);

  const togglePause = () => setIsPaused((prev) => !prev);

  // =========================================================================
  // 2. DYNAMIC AUDIO: when Section 2 is in view, crossfade the previous
  //    (synth) track out and fade the Pharaonic MP3 in. Fades out on leave.
  // =========================================================================
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onAudioStartRef = useRef(onAudioStart);
  useEffect(() => {
    onAudioStartRef.current = onAudioStart;
  }, [onAudioStart]);
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!audioRef.current) {
      const audio = new Audio(PHARAONIC_TRACK_SRC);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0;
      audioRef.current = audio;
    }
    const audio = audioRef.current;
    const shouldPlay = isInView && isMusicEnabled && autoPlayAudio;

    if (!shouldPlay) {
      if (!audio.paused) fadeAudio(audio, 0, 1200, () => audio.pause());
      return;
    }

    // Fade out the previous section's audio (Track A)
    sceneAudio?.transitionToScene(1, true);

    let retry: (() => void) | null = null;
    const onStarted = () => {
      fadeAudio(audio, TRACK_VOLUME, 2200); // smooth fade-in
      onAudioStartRef.current?.();
    };
    audio
      .play()
      .then(onStarted)
      .catch((error) => {
        console.log("Audio play blocked until interaction", error);
        // Autoplay blocked: start on the first user gesture instead
        retry = () => {
          audio.play().then(onStarted).catch(() => {});
        };
        window.addEventListener("pointerdown", retry, { once: true });
      });

    return () => {
      if (retry) window.removeEventListener("pointerdown", retry);
    };
  }, [isInView, isMusicEnabled, autoPlayAudio]);

  // Fade out and release on unmount (leaving the section)
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) fadeAudio(audio, 0, 900, () => audio.pause());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full flex flex-col py-6 sm:py-8 bg-gradient-to-b from-[#FFF5F7] via-[#FDECEF] to-[#FCE4EC] text-romantic-charcoal select-none overflow-hidden"
    >
      {/* ===================== LAYER 1 (z-0): BACKGROUND ===================== */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04] text-[#D4AF37] z-0"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="pharaonic-temple-wall-pattern" width="170" height="170" patternUnits="userSpaceOnUse">
            <path d="M85,6 L164,85 L85,164 L6,85 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M85,20 L150,85 L85,150 L20,85 Z" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
            <path d="M85,28 C80,38 70,48 64,52 C76,52 82,44 85,36 C88,44 94,52 106,52 C100,48 90,38 85,28 Z" fill="currentColor" />
            <g transform="translate(25, 20)">
              <path d="M48,70 Q60,56 72,70 Q60,84 48,70 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="60" cy="70" r="3.5" fill="currentColor" />
              <path d="M44,62 Q60,52 76,62" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </g>
            <g transform="translate(85, 88)">
              <circle cx="0" cy="-6" r="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <line x1="0" y1="-1" x2="0" y2="15" stroke="currentColor" strokeWidth="1.2" />
              <line x1="-7" y1="4" x2="7" y2="4" stroke="currentColor" strokeWidth="1.2" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pharaonic-temple-wall-pattern)" />
      </svg>

      {/* Faint Ankh / Eye of Horus motifs in the empty space (z-0, #D4AF37) */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-[30%] left-[19%] z-0 pointer-events-none opacity-15 text-[#D4AF37]"
      >
        <AnkhIcon className="w-12 h-12 lg:w-16 lg:h-16" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-[20%] left-[22%] z-0 pointer-events-none opacity-15 text-[#D4AF37]"
      >
        <EyeOfHorusIcon className="w-14 h-9 lg:w-20 lg:h-12" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 6.6, ease: "easeInOut", delay: 0.3 }}
        className="absolute top-[34%] right-[21%] z-0 pointer-events-none opacity-15 text-[#D4AF37]"
      >
        <AnkhIcon className="w-12 h-12 lg:w-16 lg:h-16" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 7.4, ease: "easeInOut", delay: 0.8 }}
        className="absolute bottom-[18%] right-[24%] z-0 pointer-events-none opacity-15 text-[#D4AF37]"
      >
        <EyeOfHorusIcon className="w-14 h-9 lg:w-20 lg:h-12" />
      </motion.div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-10 text-[#D4AF37]">
        <AnkhIcon className="w-32 h-32 lg:w-44 lg:h-44" />
      </div>
      {/* Edge motifs like the reference */}
      <div className="absolute left-3 top-[42%] z-0 pointer-events-none opacity-30 text-[#D4AF37]">
        <EyeOfHorusIcon className="w-8 h-5" />
      </div>
      <div className="absolute right-3 top-[42%] z-0 pointer-events-none opacity-30 text-[#D4AF37]">
        <EyeOfHorusIcon className="w-8 h-5" />
      </div>

      {/* ===================== LAYER 2 (z-10): HEADER ===================== */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-start justify-between gap-5 px-6 sm:px-12 mt-4 mb-10 pb-4 lg:mt-8 lg:mb-24 lg:pb-12 shrink-0">
        <div className="text-center md:text-left max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-[#D4AF37]/40 text-xs font-semibold text-romantic-charcoal mb-3 shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Chapter 02 • The Timeless Journey</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl font-bold text-romantic-charcoal tracking-tight leading-[1.15]"
          >
            Through the Ages: <span className="text-romantic-roseGoldDark">A Timeless Bond</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-sm sm:text-base text-romantic-roseGoldDark italic mt-2 font-medium max-w-lg"
          >
            Across every lifetime and every horizon, our hearts always find their way together.
          </motion.p>
        </div>

        <div className="flex items-center justify-center gap-3 shrink-0">
          <button
            type="button"
            onClick={togglePause}
            aria-pressed={isPaused}
            className="px-4 py-2 rounded-full bg-white/90 hover:bg-white border border-[#D4AF37]/40 text-romantic-charcoal text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                <span>Play</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onNext}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-romantic-roseGoldLight text-romantic-charcoal font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Scene 03: Physics Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ===================== LAYER 3 (z-20): SCROLLING MARQUEE =====================
          Supporting act: compact cards (~15vw, max 230px) so the 35vw statues dominate. */}
      <div
        className="relative z-20 w-full flex-1 min-h-0 flex items-center overflow-hidden py-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          style={{ x, gap: "clamp(14px, 1.6vw, 24px)", paddingLeft: "clamp(14px, 1.6vw, 24px)", paddingRight: "clamp(14px, 1.6vw, 24px)" }}
          animate={animationControls}
          className="flex items-center w-max shrink-0 will-change-transform"
        >
          {duplicatedCards.map((card, idx) => (
            <PharaonicKotsheenaCard key={`${card.id}-${idx}`} card={card} index={idx} />
          ))}
        </motion.div>
      </div>

      {/* ===================== LAYER 4 (z-50): FOREGROUND STATUES =====================
          100% opaque, overlap the far left/right edges of the cards, never block hover. */}
      <div
        className="absolute left-0 bottom-0 z-50 pointer-events-none select-none -translate-x-[10%] lg:translate-x-0"
      >
        <motion.div
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", mass: 2.2, stiffness: 70, damping: 16, delay: 0.2 }}
          className="pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, -10, 0], x: mouseX * -6 }}
            transition={{
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              x: { duration: 0.3, ease: "easeOut" },
            }}
            className="relative pointer-events-none w-[35vw] max-w-[400px] h-[80vh]"
          >
            <Image
              src={leftGuardianUrl}
              alt={leftGuardianName}
              fill
              priority
              sizes="400px"
              className="object-contain object-bottom pointer-events-none drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </div>

      <div
        className="absolute right-0 bottom-0 z-50 pointer-events-none select-none translate-x-[10%] lg:translate-x-0"
      >
        <motion.div
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", mass: 2.2, stiffness: 70, damping: 16, delay: 0.35 }}
          className="pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, -10, 0], x: mouseX * 6 }}
            transition={{
              y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 },
              x: { duration: 0.3, ease: "easeOut" },
            }}
            className="relative pointer-events-none w-[35vw] max-w-[400px] h-[80vh]"
          >
            <Image
              src={rightGuardianUrl}
              alt={rightGuardianName}
              fill
              priority
              sizes="400px"
              className="object-contain object-bottom pointer-events-none drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Soft base gradient so the statues blend into the layout */}
      <div className="absolute inset-x-0 bottom-0 h-40 z-[55] pointer-events-none bg-gradient-to-t from-pink-100/50 to-transparent" />

      {/* FOOTER */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs text-romantic-muted pt-4 border-t border-[#D4AF37]/25 gap-2 px-6 sm:px-12 shrink-0">
        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Hover over any photo card to softly glide and view cherished memories.</span>
        </span>
        <div className="flex items-center gap-3 font-medium text-romantic-charcoal">
          <span>24 Moments • Infinite Auto-Marquee</span>
          <span className="text-[#D4AF37]/50">|</span>
          <span className="text-romantic-roseGoldDark font-serif italic">A Timeless Bond</span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// "KOTSHEENA" CARD: white border, golden hieroglyph trim, alternating tilt
// =========================================================================
interface PharaonicKotsheenaCardProps {
  card: TimelessPharaonicCard;
  index: number;
}

const PharaonicKotsheenaCard: React.FC<PharaonicKotsheenaCardProps> = ({ card, index }) => {
  // Alternating tilt (rotate-2 / -rotate-3). The deck has an even length, so the
  // pattern also stays consistent across the duplicated half of the loop.
  const baseRotation = index % 2 === 0 ? 2 : -3;

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      style={{
        rotate: baseRotation,
        width: "min(clamp(170px, 15vw, 230px), 26vh)",
        aspectRatio: "280 / 380",
      }}
      className="relative shrink-0 bg-[#FFFDF9] rounded-2xl p-3 border-2 border-white ring-1 ring-[#D4AF37]/40 shadow-[0_16px_36px_-6px_rgba(51,39,42,0.16),0_8px_24px_-4px_rgba(212,175,55,0.25)] hover:shadow-[0_24px_48px_-6px_rgba(51,39,42,0.24),0_12px_28px_rgba(212,175,55,0.4)] transition-shadow duration-300 group cursor-pointer flex flex-col justify-between"
    >
      {/* Golden hieroglyph trim: inner border + corner brackets */}
      <div className="absolute inset-1.5 rounded-xl border border-[#D4AF37]/35 pointer-events-none" />
      <span className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]/70 rounded-tl-lg pointer-events-none" />
      <span className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]/70 rounded-tr-lg pointer-events-none" />
      <span className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]/70 rounded-bl-lg pointer-events-none" />
      <span className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]/70 rounded-br-lg pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-1 mb-1.5 select-none relative z-10">
        <span className="text-romantic-charcoal text-[11px] font-bold font-mono tracking-tight">{card.rank}</span>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[9px] text-romantic-charcoal font-semibold">
          <span className="text-[#D4AF37] text-xs font-serif leading-none">{card.hieroglyphsTop}</span>
          <span className="tracking-wider font-sans whitespace-nowrap">
            CARD #{((index % 12) + 1).toString().padStart(2, "0")}
          </span>
        </div>
        <Heart className="w-3 h-3 fill-rose-500/80 text-rose-500" />
      </div>

      {/* Photo */}
      <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-stone-900 border border-[#D4AF37]/35 shadow-inner">
        <Image
          src={card.imageUrl}
          alt={card.title}
          fill
          sizes="280px"
          className="object-cover select-none pointer-events-none brightness-105 contrast-105 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
          <p className="font-serif text-sm font-bold truncate leading-tight drop-shadow">{card.title}</p>
          <div className="flex items-center justify-between text-[9px] text-romantic-blushLight mt-1 font-sans">
            <span className="flex items-center gap-0.5 truncate max-w-[55%]">
              <MapPin className="w-2.5 h-2.5 text-[#D4AF37] shrink-0" />
              {card.location}
            </span>
            <span className="flex items-center gap-0.5 shrink-0">
              <Calendar className="w-2.5 h-2.5 text-[#D4AF37] shrink-0" />
              {card.date}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-1 mt-1.5 text-[10px] select-none relative z-10">
        <span className="font-serif italic text-romantic-charcoal font-medium">A Timeless Bond</span>
        <span className="text-romantic-roseGoldDark text-xs font-serif tracking-widest">{card.hieroglyphsBottom}</span>
        <span className="font-mono font-bold text-romantic-charcoal text-[10px]">{card.footerIndex}</span>
      </div>
    </motion.div>
  );
};

export const EgyptianHeritageInfiniteMarquee = Scene2DraggableFilmstrip;
export const TimelessJourneyMarquee = Scene2DraggableFilmstrip;
