"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
/* Component: WeddingRaceSection (Section 6)                                  */
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

  const audioRef = useRef<HTMLAudioElement>(null);

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

  // End conditions check
  useEffect(() => {
    if (!isPlaying) return;

    if (groomProgress >= FINISH || brideProgress >= FINISH) {
      setIsPlaying(false);
      if (groomProgress >= FINISH && brideProgress < FINISH) {
        setWinner("groom");
      } else if (brideProgress >= FINISH && groomProgress < FINISH) {
        setWinner("bride");
      } else {
        setWinner("tie");
      }
    } else if (timeLeft <= 0) {
      setIsPlaying(false);
      if (groomProgress > brideProgress) {
        setWinner("groom");
      } else if (brideProgress > groomProgress) {
        setWinner("bride");
      } else {
        setWinner("tie");
      }
    }
  }, [groomProgress, brideProgress, timeLeft, isPlaying]);

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
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const kartTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 140, damping: 16 };

  return (
    <section
      id="section-6-race"
      className="relative w-full min-h-[720px] flex flex-col items-center justify-center py-10 px-4 bg-gradient-to-b from-[#FCEBF0]/40 via-white to-[#FCEBF0]/30 select-none overflow-hidden"
    >
      {/* Background 8-bit / Arcade Racing Soundtrack */}
      <audio ref={audioRef} src={RACE_AUDIO_SRC} loop preload="auto" className="hidden" />

      {/* -------------------------------------------------------------------- */}
      {/* 2. PRE-GAME "VS" SCREEN (Shown before race starts)                    */}
      {/* -------------------------------------------------------------------- */}
      {!isPlaying && !winner && (
        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center animate-fadeIn py-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 bg-white/90 px-4 py-1.5 text-xs md:text-sm font-bold text-[#C9A227] shadow-sm mb-4">
            <span>🏁</span>
            <span className="uppercase tracking-widest">Chapter 06 • The Wedding Race</span>
            <span>🏁</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-[#2B1D24] tracking-tight mb-2">
            CHOOSE YOUR RACER
          </h2>
          <p className="font-sans text-sm md:text-base font-semibold text-[#7A6A5A] mb-8">
            Mash your keys as fast as you can to cross the finish line first!
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
                <h3 className="font-serif text-2xl font-black text-[#2B1D24]">GROOM</h3>
              </div>

              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2B1D24] text-white font-mono font-bold text-sm shadow-md">
                <span>Key:</span>
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

              <span className="text-xs text-[#7A6A5A] font-medium mt-3">
                30 Seconds Countdown • Sudden Death
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
                <h3 className="font-serif text-2xl font-black text-[#2B1D24]">BRIDE</h3>
              </div>

              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2B1D24] text-white font-mono font-bold text-sm shadow-md">
                <span>Key:</span>
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
      {/* 3. ACTIVE RACE SCREEN (When isPlaying is true)                         */}
      {/* -------------------------------------------------------------------- */}
      {isPlaying && (
        <div className="w-full flex flex-col items-center z-10 animate-fadeIn">
          {/* Header Dashboard: Instructions & Big Timer */}
          <div className="flex flex-col items-center text-center gap-2 mb-4 w-full max-w-4xl px-4">
            <div className="flex items-center justify-between w-full">
              {/* Groom Progress Gauge */}
              <div className="flex items-center gap-2 bg-white/90 px-3.5 py-1.5 rounded-full border border-[#2B1D24]/15 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E3001B]" />
                <span className="font-bold text-xs sm:text-sm text-[#2B1D24]">Groom:</span>
                <span className="font-mono font-black text-sm text-[#C9A227]">
                  {groomProgress}%
                </span>
              </div>

              {/* Large Centered Timer */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#7A6A5A] uppercase tracking-wider">
                    Time Remaining
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAudioMuted((prev) => !prev)}
                    className="text-xs p-1 rounded-full hover:bg-black/5 cursor-pointer"
                    title={isAudioMuted ? "Unmute Music" : "Mute Music"}
                    aria-label={isAudioMuted ? "Unmute Music" : "Mute Music"}
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
                <span className="font-bold text-xs sm:text-sm text-[#2B1D24]">Bride:</span>
                <span className="font-mono font-black text-sm text-[#C9A227]">
                  {brideProgress}%
                </span>
              </div>
            </div>

            {/* Instruction Banner */}
            <p className="mt-1 text-xs sm:text-sm md:text-base font-bold text-[#7A6A5A] tracking-wide select-none">
              {"Groom: Mash 'K' 🏁 | Bride: Mash 'H' 🏁"}
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
      {/* 4. THE WINNER OVERLAY (CRITICAL MODAL WITH WINNING CHARACTER AVATAR)   */}
      {/* -------------------------------------------------------------------- */}
      <AnimatePresence>
        {winner && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#2B1D24]/90 backdrop-blur-md p-6 text-center select-none"
          >
            {/* Massive Winning Character Avatar */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.5, y: 30 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
              className="relative h-[280px] sm:h-[350px] md:h-[420px] w-auto max-w-[85vw] flex items-center justify-center mb-6"
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

            <p className="font-sans text-sm md:text-base text-white/90 mb-8 font-semibold">
              {winner === "groom" && "Unstoppable speed! Congratulations to the Groom!"}
              {winner === "bride" && "Flawless victory! Congratulations to the Bride!"}
              {winner === "tie" && "Two hearts racing together as one!"}
            </p>

            {/* Play Again Button */}
            <button
              type="button"
              onClick={startRace}
              className="px-10 py-4 rounded-full font-black text-lg md:text-xl tracking-wide uppercase bg-gradient-to-r from-[#E5C158] to-[#C9A227] text-[#2B1D24] shadow-[0_6px_0_#9E7E1C,0_15px_30px_rgba(0,0,0,0.4)] active:translate-y-1 active:shadow-[0_2px_0_#9E7E1C] hover:brightness-105 cursor-pointer transition-all"
            >
              PLAY AGAIN 🏁
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
