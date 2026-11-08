"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

/* -------------------------------------------------------------------------- */
/* 1. MEDIA CONSTANTS (AT THE TOP FOR EASY REPLACEMENT)                       */
/* -------------------------------------------------------------------------- */
export const GROOM_KART_SRC = "/race/groom-kart.png";
export const BRIDE_KART_SRC = "/race/bride-kart.png";
export const GROOM_AVATAR_SRC = "/race/groom-avatar.png"; // Full body cartoon
export const BRIDE_AVATAR_SRC = "/race/bride-avatar.png"; // Full body cartoon
export const RACE_AUDIO_SRC = "/race/race-theme.mp3";

const GAME_DURATION = 30; // 30 seconds countdown
const STEP = 2; // +2% per keystroke
const FINISH = 100;

/* -------------------------------------------------------------------------- */
/* 2. THE 6 PUNISHMENTS FOR THE LOSER'S WHEEL (عجلة العقاب)                   */
/* -------------------------------------------------------------------------- */
const PUNISHMENTS = [
  { id: 1, text: "غسيل المواعين 🍽️", color: "#E3001B", textColor: "#FFFFFF" },
  { id: 2, text: "عزومة أكل من برة 🍔", color: "#C9A227", textColor: "#2B1D24" },
  { id: 3, text: "ممنوع نطق حرف الميم ساعة 🤐", color: "#2B1D24", textColor: "#FFFFFF" },
  { id: 4, text: "10 ضغط 💪", color: "#E91E63", textColor: "#FFFFFF" },
  { id: 5, text: "تنويم ليان النهاردة 👶", color: "#1976D2", textColor: "#FFFFFF" },
  { id: 6, text: "عمل كوباية شاي بالنعناع ☕", color: "#2E7D32", textColor: "#FFFFFF" },
];

/* Helper for SVG Pie Slices */
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return ["M", x, y, "L", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y, "Z"].join(" ");
}

/* -------------------------------------------------------------------------- */
/* Component: WeddingRaceSection (تحدي الأزواج)                                */
/* -------------------------------------------------------------------------- */
export default function WeddingRaceSection() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION);
  const [groomProgress, setGroomProgress] = useState<number>(0);
  const [brideProgress, setBrideProgress] = useState<number>(0);
  const [winner, setWinner] = useState<null | "groom" | "bride" | "tie">(null);

  const [groomKartError, setGroomKartError] = useState<boolean>(false);
  const [brideKartError, setBrideKartError] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  /* Punishment Wheel States */
  const [isWheelOpen, setIsWheelOpen] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [selectedPunishment, setSelectedPunishment] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const totalRotationsRef = useRef<number>(0);

  // Screen-wide Confetti Explosion
  const fireConfetti = useCallback(() => {
    if (typeof window === "undefined") return;

    const count = 220;
    const defaults = {
      origin: { y: 0.6 },
      colors: ["#C9A227", "#E3001B", "#F48FB1", "#FFFFFF", "#2B1D24", "#FFD700"],
    };

    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    };

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Audio playback during race
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !isAudioMuted) {
      audio.currentTime = 0;
      audio.volume = 0.55;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, isAudioMuted]);

  // Timer interval: 30-second countdown every 1000ms while isPlaying is true
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // End conditions check & Confetti trigger
  useEffect(() => {
    if (!isPlaying) return;

    const concludeRace = (finalWinner: "groom" | "bride" | "tie") => {
      setIsPlaying(false);
      setWinner(finalWinner);
      fireConfetti();
      setTimeout(fireConfetti, 450);
      setTimeout(fireConfetti, 900);
    };

    if (groomProgress >= FINISH || brideProgress >= FINISH) {
      if (groomProgress >= FINISH && brideProgress < FINISH) {
        concludeRace("groom");
      } else if (brideProgress >= FINISH && groomProgress < FINISH) {
        concludeRace("bride");
      } else {
        concludeRace("tie");
      }
    } else if (timeLeft <= 0) {
      if (groomProgress > brideProgress) {
        concludeRace("groom");
      } else if (brideProgress > groomProgress) {
        concludeRace("bride");
      } else {
        concludeRace("tie");
      }
    }
  }, [groomProgress, brideProgress, timeLeft, isPlaying, fireConfetti]);

  // Keyboard controls: 'k'/'K' for Groom, 'h'/'H' for Bride
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "k" || e.key === "K") {
        setGroomProgress((p) => Math.min(FINISH, p + STEP));
      } else if (e.key === "h" || e.key === "H") {
        setBrideProgress((p) => Math.min(FINISH, p + STEP));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying]);

  const startRace = () => {
    setGroomProgress(0);
    setBrideProgress(0);
    setTimeLeft(GAME_DURATION);
    setWinner(null);
    setIsWheelOpen(false);
    setShowResultModal(false);
    setSelectedPunishment(null);
    setIsPlaying(true);
  };

  /* ------------------------------------------------------------------------ */
  /* Spin Wheel Mechanics                                                     */
  /* ------------------------------------------------------------------------ */
  const spinTheWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResultModal(false);
    setSelectedPunishment(null);

    // Pick random winning slice: 0 to 5
    const randomIndex = Math.floor(Math.random() * PUNISHMENTS.length);
    const chosen = PUNISHMENTS[randomIndex];

    // Geometry: Slice k is centered at k * 60 degrees.
    // To land under top needle (0 deg), rotation angle = (360 - k * 60) mod 360
    const targetSliceDegree = (360 - randomIndex * 60) % 360;

    // Add 5 full rotations (1800 deg) + alignment + natural jitter
    const fullSpins = 5 * 360;
    const jitter = Math.floor((Math.random() - 0.5) * 20); // +/- 10 deg natural feel

    // Accumulate total rotations so it always spins forward clockwise
    const currentBase = Math.ceil(totalRotationsRef.current / 360) * 360;
    const finalDegree = currentBase + fullSpins + targetSliceDegree + jitter;
    totalRotationsRef.current = finalDegree;

    setWheelRotation(finalDegree);

    // Conclude spin after 4.6 seconds smoothly
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedPunishment(chosen.text);
      setShowResultModal(true);
      fireConfetti();
    }, 4600);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const kartTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 140, damping: 16 };

  const loserTitle =
    winner === "groom" ? "العروسة 👰" : winner === "bride" ? "العريس 🤵" : "الخاسرين الاثنين معاً 💞";

  return (
    <section
      id="section-6-race"
      className="relative w-full min-h-[720px] flex flex-col items-center justify-center py-10 px-4 bg-gradient-to-b from-[#FCEBF0]/40 via-white to-[#FCEBF0]/30 select-none overflow-hidden"
    >
      {/* Background 8-bit / Arcade Racing Soundtrack */}
      <audio ref={audioRef} src={RACE_AUDIO_SRC} loop preload="auto" className="hidden" />

      {/* -------------------------------------------------------------------- */}
      {/* 1. PRE-GAME "VS" SCREEN: تحدي الأزواج (The Couples Challenge)        */}
      {/* -------------------------------------------------------------------- */}
      {!isPlaying && !winner && (
        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center animate-fadeIn py-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 bg-white/90 px-4 py-1.5 text-xs md:text-sm font-bold text-[#C9A227] shadow-sm mb-4">
            <span>🏁</span>
            <span className="uppercase tracking-widest font-serif font-black">
              الفصل السادس • تحدي الأزواج
            </span>
            <span>🏁</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-[#2B1D24] tracking-tight mb-2">
            تحدي الأزواج 🏎️💨
          </h2>
          <p className="font-sans text-sm md:text-base font-semibold text-[#7A6A5A] mb-8">
            اضغط زر الحرف بأقصى سرعة للفوز.. والخاسر هيلف عجلة العقاب!
          </p>

          {/* VS Card Showdown */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-6 mb-10">
            {/* Left: Groom Racer Card */}
            <div className="flex flex-col items-center bg-white/90 rounded-3xl p-6 border-3 border-[#2B1D24]/10 shadow-[0_15px_30px_rgba(43,29,36,0.12)]">
              <div className="relative h-[250px] sm:h-[300px] w-full flex items-end justify-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={GROOM_AVATAR_SRC}
                  alt="Groom Racer Avatar"
                  className="h-full w-auto object-contain drop-shadow-xl select-none"
                />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-[#E3001B]" />
                <h3 className="font-serif text-2xl font-black text-[#2B1D24]">العريس (Groom)</h3>
              </div>

              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2B1D24] text-white font-mono font-bold text-sm shadow-md">
                <span>الزر:</span>
                <span className="px-2 py-0.5 rounded bg-[#C9A227] text-[#2B1D24] font-black text-base">
                  K
                </span>
                <span className="text-xs text-white/80">(Mash K)</span>
              </div>
            </div>

            {/* Center: VS Emblem & START Button */}
            <div className="flex flex-col items-center justify-center order-first md:order-none my-2 md:my-0">
              <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#C9A227] to-[#E5C158] text-[#2B1D24] font-black text-2xl sm:text-3xl shadow-[0_10px_25px_rgba(201,162,39,0.45)] border-4 border-white mb-6 animate-pulse">
                VS
              </div>

              <button
                type="button"
                onClick={startRace}
                className="group relative px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl md:text-2xl tracking-wider uppercase text-[#2B1D24] bg-gradient-to-b from-[#E5C158] to-[#C9A227] border-2 border-white shadow-[0_8px_0_#9E7E1C,0_15px_30px_rgba(43,29,36,0.25)] active:translate-y-1.5 active:shadow-[0_2px_0_#9E7E1C] hover:brightness-105 cursor-pointer transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <span>🏁</span>
                  <span>START 30s RACE</span>
                  <span>🏁</span>
                </span>
              </button>

              <span className="text-xs text-[#7A6A5A] font-bold mt-3">
                30 ثانية حماسية • الفائز يختار عقاب الخاسر
              </span>
            </div>

            {/* Right: Bride Racer Card */}
            <div className="flex flex-col items-center bg-white/90 rounded-3xl p-6 border-3 border-[#2B1D24]/10 shadow-[0_15px_30px_rgba(43,29,36,0.12)]">
              <div className="relative h-[250px] sm:h-[300px] w-full flex items-end justify-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={BRIDE_AVATAR_SRC}
                  alt="Bride Racer Avatar"
                  className="h-full w-auto object-contain drop-shadow-xl select-none"
                />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-[#F48FB1]" />
                <h3 className="font-serif text-2xl font-black text-[#2B1D24]">العروسة (Bride)</h3>
              </div>

              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2B1D24] text-white font-mono font-bold text-sm shadow-md">
                <span>الزر:</span>
                <span className="px-2 py-0.5 rounded bg-[#C9A227] text-[#2B1D24] font-black text-base">
                  H
                </span>
                <span className="text-xs text-white/80">(Mash H)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 2. ACTIVE RACE SCREEN (When isPlaying is true)                         */}
      {/* -------------------------------------------------------------------- */}
      {isPlaying && (
        <div className="w-full flex flex-col items-center z-10 animate-fadeIn">
          {/* Header Dashboard: Instructions & Big Timer */}
          <div className="flex flex-col items-center text-center gap-2 mb-4 w-full max-w-4xl px-4">
            <div className="flex items-center justify-between w-full">
              {/* Groom Progress Gauge */}
              <div className="flex items-center gap-2 bg-white/90 px-3.5 py-1.5 rounded-full border border-[#2B1D24]/15 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E3001B]" />
                <span className="font-bold text-xs sm:text-sm text-[#2B1D24]">العريس:</span>
                <span className="font-mono font-black text-sm text-[#C9A227]">
                  {groomProgress}%
                </span>
              </div>

              {/* Large Centered Timer */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#7A6A5A] uppercase tracking-wider">
                    الوقت المتبقي
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAudioMuted((prev) => !prev)}
                    className="text-xs p-1 rounded-full hover:bg-black/5 cursor-pointer"
                    title={isAudioMuted ? "تشغيل الموسيقى" : "كتم الموسيقى"}
                    aria-label={isAudioMuted ? "تشغيل الموسيقى" : "كتم الموسيقى"}
                  >
                    {isAudioMuted ? "🔇" : "🔊"}
                  </button>
                </div>
                <div
                  aria-live="polite"
                  className={`font-mono font-black text-3xl sm:text-5xl tracking-wider select-none ${
                    timeLeft <= 5 ? "text-[#E3001B] animate-pulse" : "text-[#2B1D24]"
                  }`}
                >
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Bride Progress Gauge */}
              <div className="flex items-center gap-2 bg-white/90 px-3.5 py-1.5 rounded-full border border-[#2B1D24]/15 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F48FB1]" />
                <span className="font-bold text-xs sm:text-sm text-[#2B1D24]">العروسة:</span>
                <span className="font-mono font-black text-sm text-[#C9A227]">
                  {brideProgress}%
                </span>
              </div>
            </div>

            {/* Instruction Banner */}
            <p className="mt-1 text-xs sm:text-sm md:text-base font-bold text-[#7A6A5A] tracking-wide select-none">
              {"العريس: اضغط 'K' 🏁 | العروسة: اضغطي 'H' 🏁"}
            </p>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* 3D CARTOON TRACK WITH MASSIVE KARTS                                */}
          {/* ------------------------------------------------------------------ */}
          <div
            style={{ perspective: "1000px" }}
            className="w-full max-w-5xl mx-auto px-2 sm:px-4 my-2"
          >
            <div
              style={{
                transform: "rotateX(16deg)",
                transformStyle: "preserve-3d",
              }}
              className="relative w-full rounded-3xl border-8 border-white bg-gradient-to-b from-[#FAF4EB] via-[#F3E7DC] to-[#E9DACB] p-4 sm:p-6 shadow-[0_25px_50px_rgba(43,29,36,0.22),inset_0_-8px_0_rgba(0,0,0,0.15)]"
            >
              <div className="relative w-full overflow-hidden rounded-2xl border-2 border-[#2B1D24]/15 bg-white/50 shadow-inner">
                {/* Lane 1: Groom (Warm Pastel - Red Kart) */}
                <div className="relative flex items-center h-[130px] sm:h-[160px] md:h-[190px] bg-[#FCEBF0]/60 border-b-2 border-dashed border-[#2B1D24]/20 px-3 md:px-6">
                  {/* START Line */}
                  <div className="flex items-center gap-2 shrink-0 z-20 select-none">
                    <span className="font-black text-xs md:text-sm text-[#7A6A5A] tracking-wider uppercase">
                      START
                    </span>
                    <div
                      className="w-4 sm:w-6 h-24 sm:h-32 rounded border border-[#2B1D24]/20"
                      style={{
                        backgroundImage: `
                          linear-gradient(45deg, #2B1D24 25%, transparent 25%), 
                          linear-gradient(-45deg, #2B1D24 25%, transparent 25%), 
                          linear-gradient(45deg, transparent 75%, #2B1D24 75%), 
                          linear-gradient(-45deg, transparent 75%, #2B1D24 75%)
                        `,
                        backgroundSize: "10px 10px",
                        backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
                        backgroundColor: "#FAFAFA",
                      }}
                    />
                  </div>

                  {/* Groom Runway */}
                  <div className="relative flex-1 h-full mx-8 md:mx-14">
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 border-b-2 border-dashed border-[#7A6A5A]/25" />

                    {/* MASSIVE Groom Kart */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none select-none will-change-transform"
                      animate={{ left: `${groomProgress}%` }}
                      transition={kartTransition}
                      style={{ translateX: "-50%" }}
                    >
                      {groomKartError ? (
                        <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl bg-[#2B1D24] text-white flex items-center justify-center text-4xl shadow-md border-2 border-[#C9A227]">
                          🤵🏎️
                        </div>
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={GROOM_KART_SRC}
                          alt="Groom Racing Kart"
                          onError={() => setGroomKartError(true)}
                          className="h-[100px] md:h-[150px] w-auto object-contain drop-shadow-2xl"
                        />
                      )}
                    </motion.div>
                  </div>

                  {/* FINISH Line */}
                  <div className="flex items-center gap-2 shrink-0 z-20 select-none">
                    <div
                      className="w-4 sm:w-6 h-24 sm:h-32 rounded border border-[#2B1D24]/20"
                      style={{
                        backgroundImage: `
                          linear-gradient(45deg, #2B1D24 25%, transparent 25%), 
                          linear-gradient(-45deg, #2B1D24 25%, transparent 25%), 
                          linear-gradient(45deg, transparent 75%, #2B1D24 75%), 
                          linear-gradient(-45deg, transparent 75%, #2B1D24 75%)
                        `,
                        backgroundSize: "10px 10px",
                        backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
                        backgroundColor: "#FAFAFA",
                      }}
                    />
                    <span className="text-xl sm:text-3xl" aria-hidden="true">
                      🏁
                    </span>
                  </div>
                </div>

                {/* Lane 2: Bride (Cool Pastel - Pink Kart) */}
                <div className="relative flex items-center h-[130px] sm:h-[160px] md:h-[190px] bg-[#EAF2F6]/70 px-3 md:px-6">
                  {/* START Line */}
                  <div className="flex items-center gap-2 shrink-0 z-20 select-none">
                    <span className="font-black text-xs md:text-sm text-[#7A6A5A] tracking-wider uppercase">
                      START
                    </span>
                    <div
                      className="w-4 sm:w-6 h-24 sm:h-32 rounded border border-[#2B1D24]/20"
                      style={{
                        backgroundImage: `
                          linear-gradient(45deg, #2B1D24 25%, transparent 25%), 
                          linear-gradient(-45deg, #2B1D24 25%, transparent 25%), 
                          linear-gradient(45deg, transparent 75%, #2B1D24 75%), 
                          linear-gradient(-45deg, transparent 75%, #2B1D24 75%)
                        `,
                        backgroundSize: "10px 10px",
                        backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
                        backgroundColor: "#FAFAFA",
                      }}
                    />
                  </div>

                  {/* Bride Runway */}
                  <div className="relative flex-1 h-full mx-8 md:mx-14">
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 border-b-2 border-dashed border-[#7A6A5A]/25" />

                    {/* MASSIVE Bride Kart */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none select-none will-change-transform"
                      animate={{ left: `${brideProgress}%` }}
                      transition={kartTransition}
                      style={{ translateX: "-50%" }}
                    >
                      {brideKartError ? (
                        <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl bg-[#FCEBF0] text-white flex items-center justify-center text-4xl shadow-md border-2 border-[#C9A227]">
                          👰🏎️
                        </div>
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={BRIDE_KART_SRC}
                          alt="Bride Racing Kart"
                          onError={() => setBrideKartError(true)}
                          className="h-[100px] md:h-[150px] w-auto object-contain drop-shadow-2xl"
                        />
                      )}
                    </motion.div>
                  </div>

                  {/* FINISH Line */}
                  <div className="flex items-center gap-2 shrink-0 z-20 select-none">
                    <div
                      className="w-4 sm:w-6 h-24 sm:h-32 rounded border border-[#2B1D24]/20"
                      style={{
                        backgroundImage: `
                          linear-gradient(45deg, #2B1D24 25%, transparent 25%), 
                          linear-gradient(-45deg, #2B1D24 25%, transparent 25%), 
                          linear-gradient(45deg, transparent 75%, #2B1D24 75%), 
                          linear-gradient(-45deg, transparent 75%, #2B1D24 75%)
                        `,
                        backgroundSize: "10px 10px",
                        backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
                        backgroundColor: "#FAFAFA",
                      }}
                    />
                    <span className="text-xl sm:text-3xl" aria-hidden="true">
                      🏁
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Touch Fallback: Mobile Phone Tap Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 w-full max-w-4xl px-4 z-20">
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setGroomProgress((p) => Math.min(FINISH, p + STEP));
              }}
              className="w-full sm:w-1/2 py-4 px-6 rounded-2xl font-black text-lg md:text-xl text-[#2B1D24] bg-[#FCEBF0] border-3 border-[#C9A227] shadow-[0_6px_0_#C9A227,0_10px_20px_rgba(43,29,36,0.15)] active:translate-y-1 active:shadow-[0_2px_0_#C9A227] transition-all cursor-pointer select-none touch-manipulation"
            >
              🏁 Groom Tap (K)
            </button>
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setBrideProgress((p) => Math.min(FINISH, p + STEP));
              }}
              className="w-full sm:w-1/2 py-4 px-6 rounded-2xl font-black text-lg md:text-xl text-[#2B1D24] bg-[#EAF2F6] border-3 border-[#C9A227] shadow-[0_6px_0_#C9A227,0_10px_20px_rgba(43,29,36,0.15)] active:translate-y-1 active:shadow-[0_2px_0_#C9A227] transition-all cursor-pointer select-none touch-manipulation"
            >
              🏁 Bride Tap (H)
            </button>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 3. THE WINNER OVERLAY (CONFETTI EXPLOSION + LOSER PUNISHMENT BUTTON)   */}
      {/* -------------------------------------------------------------------- */}
      <AnimatePresence>
        {winner && !isWheelOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#2B1D24]/90 backdrop-blur-md p-6 text-center select-none overflow-y-auto"
          >
            {/* Massive Winning Character Avatar */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.5, y: 30 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
              className="relative h-[260px] sm:h-[320px] md:h-[380px] w-auto max-w-[85vw] flex items-center justify-center mb-4"
            >
              {winner === "groom" && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={GROOM_AVATAR_SRC}
                  alt="Groom Victorious Avatar"
                  className="h-full w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] select-none animate-bounce"
                />
              )}

              {winner === "bride" && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={BRIDE_AVATAR_SRC}
                  alt="Bride Victorious Avatar"
                  className="h-full w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] select-none animate-bounce"
                />
              )}

              {winner === "tie" && (
                <div className="flex items-center gap-4 h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={GROOM_AVATAR_SRC}
                    alt="Groom Avatar"
                    className="h-full w-auto object-contain drop-shadow-2xl"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={BRIDE_AVATAR_SRC}
                    alt="Bride Avatar"
                    className="h-full w-auto object-contain drop-shadow-2xl"
                  />
                </div>
              )}
            </motion.div>

            {/* Massive Celebratory Text */}
            <motion.h2
              aria-live="polite"
              initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.7, opacity: 0 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="font-serif font-black text-3xl sm:text-5xl md:text-6xl text-[#C9A227] tracking-tight drop-shadow-lg mb-2"
            >
              {winner === "groom" && "GROOM WINS THE RACE! 🏆"}
              {winner === "bride" && "BRIDE WINS THE RACE! 👑"}
              {winner === "tie" && "IT'S A DEAD HEAT TIE! 💞"}
            </motion.h2>

            <p className="font-sans text-sm md:text-base text-white/95 mb-6 font-semibold">
              {winner === "groom" && "سرعة خارقة من العريس! مبروك الانتصار المستحق!"}
              {winner === "bride" && "فوز ساحق للعروسة! سرعة وأناقة لا مثيل لها!"}
              {winner === "tie" && "تعادل ملحمي بين العروسين في سباق القلوب!"}
            </p>

            {/* ACTION BUTTONS: CHOOSE LOSER PUNISHMENT & PLAY AGAIN */}
            <div className="flex flex-col sm:flex-row items-center gap-4 z-20">
              {/* Glowing Punishment Wheel Button */}
              <button
                type="button"
                onClick={() => {
                  setIsWheelOpen(true);
                  setShowResultModal(false);
                }}
                className="group relative px-8 py-4 rounded-2xl font-black text-base sm:text-lg tracking-wide uppercase text-white bg-gradient-to-r from-[#E3001B] via-[#C9A227] to-[#E3001B] bg-[length:200%_auto] hover:bg-right shadow-[0_8px_0_#9E1A1A,0_15px_30px_rgba(227,0,27,0.35)] active:translate-y-1 active:shadow-[0_2px_0_#9E1A1A] cursor-pointer transition-all duration-300 animate-pulse"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">🎡</span>
                  <span>اختار عقاب الخاسر 🎡</span>
                </span>
              </button>

              {/* Play Again */}
              <button
                type="button"
                onClick={startRace}
                className="px-8 py-4 rounded-2xl font-black text-base sm:text-lg tracking-wide uppercase bg-white/15 text-white hover:bg-white/25 border-2 border-white/40 shadow-md active:translate-y-1 cursor-pointer transition-all"
              >
                العب مرة تانية 🏁
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------------- */}
      {/* 4. THE LOSER'S PUNISHMENT WHEEL MODAL (عجلة العقاب)                  */}
      {/* -------------------------------------------------------------------- */}
      <AnimatePresence>
        {isWheelOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#2B1D24]/95 backdrop-blur-xl p-4 sm:p-6 text-center select-none overflow-y-auto"
          >
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-black text-[#C9A227] mb-2 shadow-sm">
              <span>🎡</span>
              <span>عجلة العقاب الرسمية • The Loser&apos;s Wheel</span>
              <span>🎡</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-4xl font-black text-white mb-1">
              عقاب {loserTitle}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-stone-300 mb-5">
              اضغط الزر وشاهد المؤشر يستقر على العقاب الإجباري!
            </p>

            {/* THE ROULETTE WHEEL WRAPPER */}
            <div className="relative my-2 flex items-center justify-center">
              {/* TOP NEEDLE / POINTER ARROW (Pointing down to the landing slice) */}
              <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 z-30 filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.5)]">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <polygon
                    points="22,42 8,6 36,6"
                    fill="#C9A227"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                  />
                  <circle cx="22" cy="14" r="5" fill="#E3001B" />
                </svg>
              </div>

              {/* The Spinning Wheel Canvas/SVG */}
              <motion.div
                className="relative rounded-full p-2 bg-gradient-to-tr from-[#C9A227] via-[#FFF4D4] to-[#C9A227] shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_0_15px_rgba(0,0,0,0.4)] border-4 border-[#2B1D24]"
                animate={{ rotate: wheelRotation }}
                transition={{
                  duration: prefersReducedMotion ? 0.1 : 4.5,
                  ease: [0.12, 0.8, 0.32, 1], // Smooth dramatic deceleration
                }}
              >
                <svg
                  width="340"
                  height="340"
                  viewBox="0 0 360 360"
                  className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[370px] md:h-[370px] rounded-full drop-shadow-inner"
                >
                  <circle cx="180" cy="180" r="176" fill="#2B1D24" />

                  {/* 6 Exactly Defined Slices */}
                  {PUNISHMENTS.map((slice, i) => {
                    const angle = i * 60;
                    const pathData = describeArc(180, 180, 172, angle - 30, angle + 30);

                    return (
                      <g key={slice.id}>
                        {/* Slice Wedge */}
                        <path
                          d={pathData}
                          fill={slice.color}
                          stroke="#FFFFFF"
                          strokeWidth="2.5"
                        />

                        {/* Slice Text with Radial Transform */}
                        <g transform={`rotate(${angle}, 180, 180)`}>
                          <text
                            x="180"
                            y="48"
                            fill={slice.textColor}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="13"
                            fontWeight="900"
                            fontFamily="serif"
                            className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] select-none"
                          >
                            {slice.text}
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {/* Center Bullseye Wheel Cap */}
                  <circle cx="180" cy="180" r="32" fill="#FFFFFF" stroke="#C9A227" strokeWidth="5" />
                  <circle cx="180" cy="180" r="22" fill="#2B1D24" />
                  <text
                    x="180"
                    y="180"
                    fill="#C9A227"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="18"
                    fontWeight="bold"
                  >
                    🎯
                  </text>
                </svg>
              </motion.div>
            </div>

            {/* SPIN BUTTON */}
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={spinTheWheel}
                disabled={isSpinning}
                className={`px-10 py-4 rounded-2xl font-black text-lg md:text-xl tracking-wider uppercase transition-all select-none ${
                  isSpinning
                    ? "bg-[#7A6A5A]/50 text-white/70 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-[#E5C158] to-[#C9A227] text-[#2B1D24] shadow-[0_8px_0_#9E7E1C,0_15px_30px_rgba(201,162,39,0.35)] active:translate-y-1.5 active:shadow-[0_2px_0_#9E7E1C] hover:brightness-105 cursor-pointer"
                }`}
              >
                {isSpinning ? "جارِ الدوران... 🌀" : "لف العجلة الآن! 🎯"}
              </button>

              <button
                type="button"
                onClick={() => setIsWheelOpen(false)}
                disabled={isSpinning}
                className="px-6 py-4 rounded-2xl font-bold text-sm text-stone-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 cursor-pointer transition-all"
              >
                رجوع
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------------- */}
      {/* 5. RESULT MODAL: MANDATED PUNISHMENT DECREE (UNSKIPPABLE POPUP)      */}
      {/* -------------------------------------------------------------------- */}
      <AnimatePresence>
        {showResultModal && selectedPunishment && (
          <motion.div
            role="alertdialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl p-6 text-center select-none"
          >
            {/* Decree Shield Card */}
            <div className="relative max-w-lg w-full bg-gradient-to-b from-white via-[#FAF4EB] to-white rounded-3xl p-6 sm:p-8 border-4 border-[#C9A227] shadow-[0_25px_60px_rgba(0,0,0,0.7)] text-[#2B1D24]">
              {/* Top Seal Badge */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-tr from-[#E3001B] to-[#FF4560] border-3 border-white text-white flex items-center justify-center text-2xl shadow-xl">
                ⚖️
              </div>

              <span className="inline-block mt-3 px-4 py-1 rounded-full bg-[#E3001B]/10 text-[#E3001B] text-xs font-black uppercase tracking-widest border border-[#E3001B]/20">
                قرار محكمة الزواج العاجلة 🏛️
              </span>

              <h4 className="font-serif text-xl sm:text-2xl font-black text-[#2B1D24] mt-3">
                حكم واجب النفاذ على {loserTitle}
              </h4>

              {/* Massive Mandated Punishment Box */}
              <div className="my-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#2B1D24] via-[#3B2530] to-[#2B1D24] border-2 border-[#C9A227] shadow-xl text-center">
                <span className="block text-xs font-bold text-[#C9A227] mb-1">
                  العقاب المختار:
                </span>
                <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
                  {selectedPunishment}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-[#7A6A5A] mb-6">
                لا يجوز الطعن على الحكم، والتنفيذ يبدأ فوراً بعد انتهاء الزفاف! 🤝
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={startRace}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full font-black text-base uppercase bg-gradient-to-r from-[#E5C158] to-[#C9A227] text-[#2B1D24] shadow-[0_6px_0_#9E7E1C,0_10px_20px_rgba(201,162,39,0.3)] active:translate-y-1 active:shadow-[0_2px_0_#9E7E1C] cursor-pointer hover:brightness-105 transition-all"
                >
                  العب جولة ثانية 🏁
                </button>

                <button
                  type="button"
                  onClick={() => setShowResultModal(false)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold text-sm bg-stone-100 hover:bg-stone-200 text-[#2B1D24] border border-stone-300 cursor-pointer transition-all"
                >
                  لف العجلة مرة تانية 🎡
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
