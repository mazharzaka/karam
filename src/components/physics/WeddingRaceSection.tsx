"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */
const GROOM_KART_SRC = "/race/groom-kart.png";
const BRIDE_KART_SRC = "/race/bride-kart.png";
const GAME_DURATION = 30;
const STEP = 2;
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

  const [groomImgError, setGroomImgError] = useState<boolean>(false);
  const [brideImgError, setBrideImgError] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Timer interval: counts down every 1000ms while isPlaying is true
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

  // Keyboard controls: attached only while isPlaying is true
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
    : { type: "spring" as const, stiffness: 120, damping: 18 };

  return (
    <section className="relative w-full min-h-[640px] flex flex-col items-center justify-center py-12 px-4 bg-[#FCEBF0]/30 select-none overflow-hidden">
      {/* Top Header: Instructions and Large Centered Timer */}
      <div className="flex flex-col items-center text-center gap-2 mb-6 z-10">
        <p className="text-xs sm:text-sm md:text-base font-semibold text-[#7A6A5A] tracking-wide select-none">
          {"Groom: Mash 'K' 🏁 | Bride: Mash 'H' 🏁"}
        </p>

        <div
          aria-live="polite"
          className="font-mono font-black text-3xl sm:text-4xl md:text-5xl text-[#2B1D24] tracking-wider select-none drop-shadow-sm"
        >
          {formatTime(timeLeft)}
        </div>

        <div className="mt-2">
          <button
            type="button"
            onClick={startRace}
            disabled={isPlaying}
            className={`px-8 py-3.5 rounded-full font-bold text-base md:text-lg tracking-wide uppercase transition-all select-none ${
              isPlaying
                ? "bg-[#7A6A5A]/50 text-white/80 cursor-not-allowed shadow-none"
                : "bg-[#C9A227] text-[#2B1D24] shadow-[0_6px_0_#9E7E1C,0_10px_20px_rgba(43,29,36,0.15)] active:translate-y-1 active:shadow-[0_2px_0_#9E7E1C] hover:bg-[#d8b02e] cursor-pointer"
            }`}
          >
            {isPlaying ? "RACING..." : "START RACE"}
          </button>
        </div>
      </div>

      {/* 3D Track Wrapper */}
      <div
        style={{ perspective: "900px" }}
        className="w-full max-w-4xl mx-auto px-2 sm:px-4"
      >
        <div
          style={{
            transform: "rotateX(18deg)",
            transformStyle: "preserve-3d",
          }}
          className="relative w-full rounded-3xl border-8 border-white bg-gradient-to-b from-[#FAF4EB] via-[#F3E7DC] to-[#E9DACB] p-3 sm:p-5 shadow-[0_20px_40px_rgba(43,29,36,0.18),inset_0_-8px_0_rgba(0,0,0,0.15)]"
        >
          {/* Lanes Container */}
          <div className="relative w-full overflow-hidden rounded-2xl border border-[#2B1D24]/10 bg-white/40 shadow-inner">
            {/* Lane 1: Groom (Warm Pastel) */}
            <div className="relative flex items-center h-24 md:h-32 bg-[#FCEBF0]/50 border-b border-[#2B1D24]/15 px-3 md:px-5">
              {/* START Line */}
              <div className="flex items-center gap-2 shrink-0 z-10 select-none">
                <span className="font-black text-xs md:text-sm text-[#7A6A5A] tracking-wider uppercase">
                  START
                </span>
                <div
                  className="w-4 md:w-6 h-16 md:h-20 rounded border border-[#2B1D24]/20"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #2B1D24 25%, transparent 25%), 
                      linear-gradient(-45deg, #2B1D24 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #2B1D24 75%), 
                      linear-gradient(-45deg, transparent 75%, #2B1D24 75%)
                    `,
                    backgroundSize: "8px 8px",
                    backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                    backgroundColor: "#FAFAFA",
                  }}
                />
              </div>

              {/* Lane Runway */}
              <div className="relative flex-1 h-full mx-6 md:mx-10">
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 border-b-2 border-dashed border-[#7A6A5A]/20" />

                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 z-20 w-16 md:w-24 flex items-center justify-center pointer-events-none select-none"
                  animate={{ left: `${groomProgress}%` }}
                  transition={kartTransition}
                  style={{ translateX: "-50%" }}
                >
                  {groomImgError ? (
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-[#2B1D24] text-white flex items-center justify-center text-3xl shadow-md border-2 border-[#C9A227]">
                      🤵
                    </div>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={GROOM_KART_SRC}
                      alt=""
                      aria-hidden="true"
                      onError={() => setGroomImgError(true)}
                      className="w-16 md:w-24 h-auto pointer-events-none object-contain drop-shadow-md"
                    />
                  )}
                </motion.div>
              </div>

              {/* FINISH Line */}
              <div className="flex items-center gap-2 shrink-0 z-10 select-none">
                <div
                  className="w-4 md:w-6 h-16 md:h-20 rounded border border-[#2B1D24]/20"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #2B1D24 25%, transparent 25%), 
                      linear-gradient(-45deg, #2B1D24 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #2B1D24 75%), 
                      linear-gradient(-45deg, transparent 75%, #2B1D24 75%)
                    `,
                    backgroundSize: "8px 8px",
                    backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                    backgroundColor: "#FAFAFA",
                  }}
                />
                <span className="text-lg md:text-2xl" aria-hidden="true">
                  🏁
                </span>
              </div>
            </div>

            {/* Lane 2: Bride (Cool Pastel) */}
            <div className="relative flex items-center h-24 md:h-32 bg-[#EAF2F6]/60 px-3 md:px-5">
              {/* START Line */}
              <div className="flex items-center gap-2 shrink-0 z-10 select-none">
                <span className="font-black text-xs md:text-sm text-[#7A6A5A] tracking-wider uppercase">
                  START
                </span>
                <div
                  className="w-4 md:w-6 h-16 md:h-20 rounded border border-[#2B1D24]/20"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #2B1D24 25%, transparent 25%), 
                      linear-gradient(-45deg, #2B1D24 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #2B1D24 75%), 
                      linear-gradient(-45deg, transparent 75%, #2B1D24 75%)
                    `,
                    backgroundSize: "8px 8px",
                    backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                    backgroundColor: "#FAFAFA",
                  }}
                />
              </div>

              {/* Lane Runway */}
              <div className="relative flex-1 h-full mx-6 md:mx-10">
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 border-b-2 border-dashed border-[#7A6A5A]/20" />

                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 z-20 w-16 md:w-24 flex items-center justify-center pointer-events-none select-none"
                  animate={{ left: `${brideProgress}%` }}
                  transition={kartTransition}
                  style={{ translateX: "-50%" }}
                >
                  {brideImgError ? (
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-[#FCEBF0] text-white flex items-center justify-center text-3xl shadow-md border-2 border-[#C9A227]">
                      👰
                    </div>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={BRIDE_KART_SRC}
                      alt=""
                      aria-hidden="true"
                      onError={() => setBrideImgError(true)}
                      className="w-16 md:w-24 h-auto pointer-events-none object-contain drop-shadow-md"
                    />
                  )}
                </motion.div>
              </div>

              {/* FINISH Line */}
              <div className="flex items-center gap-2 shrink-0 z-10 select-none">
                <div
                  className="w-4 md:w-6 h-16 md:h-20 rounded border border-[#2B1D24]/20"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #2B1D24 25%, transparent 25%), 
                      linear-gradient(-45deg, #2B1D24 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #2B1D24 75%), 
                      linear-gradient(-45deg, transparent 75%, #2B1D24 75%)
                    `,
                    backgroundSize: "8px 8px",
                    backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                    backgroundColor: "#FAFAFA",
                  }}
                />
                <span className="text-lg md:text-2xl" aria-hidden="true">
                  🏁
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Touch Fallback: Mobile / Phone Tap Buttons */}
      {isPlaying && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 w-full max-w-4xl px-4 z-10">
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              setGroomProgress((p) => Math.min(FINISH, p + STEP));
            }}
            className="w-full sm:w-1/2 py-4 px-6 rounded-2xl font-bold text-lg md:text-xl text-[#2B1D24] bg-[#FCEBF0] border-2 border-[#C9A227]/40 shadow-[0_6px_0_#C9A227,0_10px_20px_rgba(43,29,36,0.15)] active:translate-y-1 active:shadow-[0_2px_0_#C9A227] transition-all cursor-pointer select-none touch-manipulation"
          >
            🏁 Groom Tap
          </button>
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              setBrideProgress((p) => Math.min(FINISH, p + STEP));
            }}
            className="w-full sm:w-1/2 py-4 px-6 rounded-2xl font-bold text-lg md:text-xl text-[#2B1D24] bg-[#EAF2F6] border-2 border-[#C9A227]/40 shadow-[0_6px_0_#C9A227,0_10px_20px_rgba(43,29,36,0.15)] active:translate-y-1 active:shadow-[0_2px_0_#C9A227] transition-all cursor-pointer select-none touch-manipulation"
          >
            🏁 Bride Tap
          </button>
        </div>
      )}

      {/* Winner Overlay (Section-scoped, no position: fixed) */}
      {winner && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#2B1D24]/85 backdrop-blur-md p-6 text-center select-none"
        >
          <motion.h2
            aria-live="polite"
            initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 200, damping: 15 }
            }
            className="font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight drop-shadow-lg mb-8"
          >
            {winner === "groom" && "GROOM WINS! 🎉"}
            {winner === "bride" && "BRIDE WINS! 🎉"}
            {winner === "tie" && "IT'S A TIE! 💞"}
          </motion.h2>

          <button
            type="button"
            onClick={startRace}
            className="px-8 py-3.5 rounded-full font-bold text-base md:text-lg tracking-wide uppercase bg-[#C9A227] text-[#2B1D24] shadow-[0_6px_0_#9E7E1C,0_10px_25px_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-[0_2px_0_#9E7E1C] hover:bg-[#d8b02e] cursor-pointer transition-all"
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </section>
  );
}

