"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useGlobalAudio } from "@/utils/globalAudioCoordinator";
import {
  useWeddingConfig,
  DEFAULT_PUNISHMENTS_GROOM,
  DEFAULT_PUNISHMENTS_BRIDE,
} from "@/context/WeddingConfigContext";

/* -------------------------------------------------------------------------- */
/* 1. MEDIA CONSTANTS (AT THE TOP FOR EASY REPLACEMENT)                       */
/* -------------------------------------------------------------------------- */
export const GROOM_KART_SRC = "/race/groom-kart.png";
export const BRIDE_KART_SRC = "/race/bride-kart.png";
export const GROOM_AVATAR_SRC = "/race/groom-avatar.png"; // Full body cartoon
export const BRIDE_AVATAR_SRC = "/race/bride-avatar.png"; // Full body cartoon
export const RACE_AUDIO_SRC = "/race/race-theme.mp3";
export const VAR_VIDEO_SRC = "/var-fight-scene.mp4";

const GAME_DURATION = 30; // 30 seconds countdown
const STEP = 2; // +2% per keystroke (pure raw mashing speed)
const FINISH = 100;
const SPIN_DURATION_MS = 4000; // Strict 4-second spin
const VAR_VIDEO_DURATION_MS = 4000; // Strict 4-second VAR video scene

const REVERSE_UNO_TEXT = "براءة.. العقاب يترد للكسبان!";

const WHEEL_COLORS = [
  { bg: "#E3001B", text: "#FFFFFF" },
  { bg: "#2B1D24", text: "#FFFFFF" },
  { bg: "#E91E63", text: "#FFFFFF" },
  { bg: "#1976D2", text: "#FFFFFF" },
  { bg: "#2E7D32", text: "#FFFFFF" },
  { bg: "#6D28D9", text: "#FFFFFF" },
];

const CONFETTI_PIECES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 37) % 100}%`,
  delay: (i % 7) * 0.08,
  duration: 1.6 + (i % 5) * 0.25,
  xOffset: (i % 2 === 0 ? 1 : -1) * (20 + ((i * 13) % 60)),
  rotate: (i % 2 === 0 ? 1 : -1) * (180 + i * 45),
  color: ["#C9A227", "#E3001B", "#F48FB1", "#FFFFFF", "#FFD700", "#22A06B"][
    i % 6
  ],
}));

interface WheelSlice {
  id: string;
  text: string;
  color: string;
  textColor: string;
  isReverseUno: boolean;
}

/* Helper for SVG Pie Slices */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    x,
    y,
    "L",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "Z",
  ].join(" ");
}

/* Zero-bandwidth Web Audio synthesizer fallback for Start Beep & Cheer */
function playSynthesizedCue(type: "start" | "win") {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const playNote = (
      freq: number,
      startOffset: number,
      duration: number,
      wave: OscillatorType = "triangle",
      gainVal = 0.14
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now + startOffset);
      gain.gain.setValueAtTime(gainVal, now + startOffset);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + startOffset + duration
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + duration + 0.02);
    };

    if (type === "start") {
      playNote(523.25, 0, 0.12, "square", 0.1);
      playNote(783.99, 0.14, 0.22, "square", 0.12);
    } else {
      playNote(523.25, 0, 0.14, "triangle", 0.16);
      playNote(659.25, 0.12, 0.14, "triangle", 0.16);
      playNote(783.99, 0.24, 0.16, "triangle", 0.18);
      playNote(1046.5, 0.38, 0.35, "triangle", 0.2);
    }

    setTimeout(() => {
      ctx.close().catch(() => { });
    }, 1000);
  } catch {
    // Ignore if AudioContext is blocked
  }
}

/* Lightweight pure Framer Motion / CSS confetti burst */
function CssConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
    >
      {CONFETTI_PIECES.map((piece) => (
        <motion.span
          key={piece.id}
          initial={{ y: -20, x: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            y: 520,
            x: piece.xOffset,
            opacity: [1, 1, 0],
            rotate: piece.rotate,
            scale: [1, 1.15, 0.8],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeOut",
          }}
          style={{
            left: piece.left,
            backgroundColor: piece.color,
          }}
          className="absolute top-0 w-3 h-3 rounded-sm shadow-sm"
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Component: WeddingRaceSection (تحدي الأزواج)                                */
/* -------------------------------------------------------------------------- */
export default function WeddingRaceSection() {
  const { config } = useWeddingConfig();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION);
  const [groomProgress, setGroomProgress] = useState<number>(0);
  const [brideProgress, setBrideProgress] = useState<number>(0);
  const [winner, setWinner] = useState<null | "groom" | "bride" | "tie">(null);
  const [showWinnerOverlay, setShowWinnerOverlay] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const [groomKartError, setGroomKartError] = useState<boolean>(false);
  const [brideKartError, setBrideKartError] = useState<boolean>(false);
  const {
    isEnabled: isGlobalAudioEnabled,
    toggleAudio,
    playTrack,
    stopTrack,
  } = useGlobalAudio();
  const isAudioMuted = !isGlobalAudioEnabled;
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState<boolean>(false);

  /* Punishment Wheel, Result Modal, & Full-Screen Video VAR States */
  const [isWheelOpen, setIsWheelOpen] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedPunishment, setSelectedPunishment] = useState<string | null>(
    null
  );
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [isVarVideoOpen, setIsVarVideoOpen] = useState<boolean>(false);

  const wheelControls = useAnimation();
  const isSpinningRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const startBeepRef = useRef<HTMLAudioElement>(null);
  const winCheerRef = useRef<HTMLAudioElement>(null);
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const totalRotationsRef = useRef<number>(0);
  const endOverlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const varVideoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getSpinAudio = useCallback(() => {
    if (typeof window === "undefined" || typeof Audio === "undefined") {
      return null;
    }
    if (!spinAudioRef.current) {
      spinAudioRef.current = new Audio("/wheel-spin.mp3");
      spinAudioRef.current.preload = "auto";
    }
    return spinAudioRef.current;
  }, []);

  const stopSpinAudio = useCallback(() => {
    const audio = spinAudioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  /* Role-Specific Punishments Pool based on who lost the race */
  const loserPunishmentPool = useMemo(() => {
    const clean = (arr: string[] | undefined, fallback: string[]) => {
      const filtered = (arr || [])
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
      return filtered.length > 0 ? filtered : fallback;
    };

    const groomPool = clean(
      config.punishmentsGroom,
      DEFAULT_PUNISHMENTS_GROOM
    );
    const bridePool = clean(
      config.punishmentsBride,
      DEFAULT_PUNISHMENTS_BRIDE
    );

    if (winner === "bride") {
      return groomPool;
    }
    if (winner === "groom") {
      return bridePool;
    }
    return Array.from(new Set([...groomPool, ...bridePool]));
  }, [winner, config.punishmentsGroom, config.punishmentsBride]);

  /* Dynamic Wheel Slices + Programmatically Injected Rare "Reverse Uno" Slice */
  const wheelSlices: WheelSlice[] = useMemo(() => {
    const regularSlices: WheelSlice[] = loserPunishmentPool.map(
      (text, idx) => {
        const palette = WHEEL_COLORS[idx % WHEEL_COLORS.length];
        return {
          id: `regular-${idx}-${text}`,
          text,
          color: palette.bg,
          textColor: palette.text,
          isReverseUno: false,
        };
      }
    );

    const reverseUnoSlice: WheelSlice = {
      id: "reverse-uno-golden-slice",
      text: REVERSE_UNO_TEXT,
      color: "url(#reverseUnoGold)",
      textColor: "#2B1D24",
      isReverseUno: true,
    };

    return [...regularSlices, reverseUnoSlice];
  }, [loserPunishmentPool]);

  /* Bulletproof Arabic TTS (ar-SA) with recursive voice polling & 100% Arabic payload */
  const fetchArabicVoice = useCallback(
    (attempt = 0): Promise<SpeechSynthesisVoice | null> => {
      return new Promise((resolve) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
          resolve(null);
          return;
        }
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const match =
            voices.find((v) => v.lang.toLowerCase().startsWith("ar-sa")) ||
            voices.find((v) => v.lang.toLowerCase().startsWith("ar-eg")) ||
            voices.find(
              (v) =>
                v.lang.toLowerCase().includes("ar") ||
                v.name.toLowerCase().includes("arabic")
            ) ||
            null;
          resolve(match);
          return;
        }
        if (attempt >= 15) {
          resolve(null);
          return;
        }
        setTimeout(() => {
          fetchArabicVoice(attempt + 1).then(resolve);
        }, 100);
      });
    },
    []
  );

  const speakEgyptianDecision = useCallback(
    async (
      punishmentText: string,
      raceWinner: "groom" | "bride" | "tie" | null
    ) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }
      try {
        window.speechSynthesis.cancel();

        const loserName =
          raceWinner === "groom"
            ? config.brideName || "Manal"
            : raceWinner === "bride"
              ? config.groomName || "Mohamed"
              : `${config.groomName || "Mohamed"} و ${config.brideName || "Manal"}`;

        const loserNameAr =
          loserName === "Mohamed"
            ? "محمد"
            : loserName === "Manal"
              ? "منال"
              : loserName
                .replace(/\bMohamed\b/gi, "محمد")
                .replace(/\bMohammed\b/gi, "محمد")
                .replace(/\bManal\b/gi, "منال")
                .replace(/[A-Za-z]+/g, "")
                .trim();

        const cleanPunishment = punishmentText.replace(/[A-Za-z]+/g, "").trim();
        const textToSpeak =
          "خسر في السباق " + loserNameAr + ".. والحكم هو.. " + cleanPunishment;

        const arabicVoice = await fetchArabicVoice();
        if (!isMountedRef.current) return;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = "ar-SA";
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        if (arabicVoice) {
          utterance.voice = arabicVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch {
        // Ignore speechSynthesis errors in unsupported browsers
      }
    },
    [config.groomName, config.brideName, fetchArabicVoice]
  );

  const triggerConfetti = useCallback(() => {
    setShowConfetti(false);
    setTimeout(() => setShowConfetti(true), 20);
  }, []);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Pre-warm speechSynthesis voices & cleanup audio/timers on unmount
  useEffect(() => {
    isMountedRef.current = true;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener?.(
        "voiceschanged",
        handleVoicesChanged
      );
      return () => {
        isMountedRef.current = false;
        window.speechSynthesis.removeEventListener?.(
          "voiceschanged",
          handleVoicesChanged
        );
        if (endOverlayTimerRef.current) clearTimeout(endOverlayTimerRef.current);
        if (varVideoTimerRef.current) clearTimeout(varVideoTimerRef.current);
        stopSpinAudio();
        window.speechSynthesis.cancel();
      };
    }

    return () => {
      isMountedRef.current = false;
      if (endOverlayTimerRef.current) clearTimeout(endOverlayTimerRef.current);
      if (varVideoTimerRef.current) clearTimeout(varVideoTimerRef.current);
      stopSpinAudio();
    };
  }, [stopSpinAudio]);

  // Audio playback during race with global coordinator
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !isVarVideoOpen && isGlobalAudioEnabled) {
      audio.currentTime = 0;
      playTrack(audio);
    } else {
      stopTrack(audio, 500);
    }
  }, [isPlaying, isVarVideoOpen, isGlobalAudioEnabled, playTrack, stopTrack]);

  // Timer interval: 30-second countdown every 1000ms while isPlaying is true
  useEffect(() => {
    if (!isPlaying || isVarVideoOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isVarVideoOpen]);

  // Pure key-mashing advancement (no boosts or random modifiers)
  const advancePlayer = useCallback((player: "groom" | "bride") => {
    if (player === "groom") {
      setGroomProgress((p) => Math.min(FINISH, p + STEP));
    } else {
      setBrideProgress((p) => Math.min(FINISH, p + STEP));
    }
  }, []);

  // End conditions check & Victory/Breakdown animations (no early punishment spoilers)
  useEffect(() => {
    if (!isPlaying) return;

    const concludeRace = (finalWinner: "groom" | "bride" | "tie") => {
      setIsPlaying(false);
      setWinner(finalWinner);
      triggerConfetti();

      if (isGlobalAudioEnabled) {
        const cheerEl = winCheerRef.current;
        if (cheerEl && cheerEl.getAttribute("src")) {
          cheerEl.currentTime = 0;
          cheerEl.play().catch(() => playSynthesizedCue("win"));
        } else {
          playSynthesizedCue("win");
        }
      }

      if (endOverlayTimerRef.current) clearTimeout(endOverlayTimerRef.current);
      endOverlayTimerRef.current = setTimeout(() => {
        setShowWinnerOverlay(true);
      }, 1350);
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
  }, [
    groomProgress,
    brideProgress,
    timeLeft,
    isPlaying,
    isGlobalAudioEnabled,
    triggerConfetti,
  ]);

  // Language-agnostic Keyboard controls using event.code ('KeyK' for Groom, 'KeyH' for Bride)
  useEffect(() => {
    if (!isPlaying || isVarVideoOpen) return;

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

      if (e.code === "KeyK") {
        advancePlayer("groom");
      } else if (e.code === "KeyH") {
        advancePlayer("bride");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, isVarVideoOpen, advancePlayer]);

  const startRace = () => {
    if (endOverlayTimerRef.current) clearTimeout(endOverlayTimerRef.current);
    if (varVideoTimerRef.current) clearTimeout(varVideoTimerRef.current);
    stopSpinAudio();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    isSpinningRef.current = false;
    setGroomProgress(0);
    setBrideProgress(0);
    setTimeLeft(GAME_DURATION);
    setWinner(null);
    setShowWinnerOverlay(false);
    setShowResultModal(false);
    setShowConfetti(false);
    setIsWheelOpen(false);
    setIsVarVideoOpen(false);
    setIsSpinning(false);
    setSelectedPunishment(null);
    setIsPlaying(true);

    if (isGlobalAudioEnabled) {
      const beepEl = startBeepRef.current;
      if (beepEl && beepEl.getAttribute("src")) {
        beepEl.currentTime = 0;
        beepEl.play().catch(() => playSynthesizedCue("start"));
      } else {
        playSynthesizedCue("start");
      }
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Imperative 4-Second Framer Motion Wheel Spin + Delayed Arabic TTS        */
  /* ------------------------------------------------------------------------ */
  const spinTheWheel = useCallback(async () => {
    if (isSpinningRef.current || wheelSlices.length === 0) return;

    isSpinningRef.current = true;
    stopSpinAudio();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    // Clear previous punishment before spin & flush this render before starting imperative animation
    setShowResultModal(false);
    setSelectedPunishment(null);
    setIsSpinning(true);

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
    if (!isMountedRef.current) return;

    const spinAudio = getSpinAudio();
    if (spinAudio) {
      spinAudio.currentTime = 0;
      spinAudio.play().catch(() => { });
    }

    const count = wheelSlices.length;
    const sliceAngle = 360 / count;

    // Keep Reverse Uno rare (~10% chance) while distributing the rest evenly
    const regularCount = count - 1;
    let chosenIndex: number;
    if (regularCount > 0 && Math.random() >= 0.1) {
      chosenIndex = Math.floor(Math.random() * regularCount);
    } else {
      chosenIndex = count - 1;
    }

    const chosen = wheelSlices[chosenIndex];
    const targetSliceDegree = (360 - chosenIndex * sliceAngle) % 360;
    const fullSpins = 5 * 360;
    const jitter = Math.floor(
      (Math.random() - 0.5) * Math.min(20, sliceAngle * 0.4)
    );

    const currentBase = Math.ceil(totalRotationsRef.current / 360) * 360;
    const targetDegree = currentBase + fullSpins + targetSliceDegree + jitter;
    totalRotationsRef.current = targetDegree;

    // Zero React state updates occur while wheelControls.start animates for 4s
    await wheelControls.start({
      rotate: targetDegree,
      transition: {
        duration: prefersReducedMotion ? 0.1 : SPIN_DURATION_MS / 1000,
        ease: [0.2, 0.8, 0.2, 1],
      },
    });

    if (!isMountedRef.current) return;

    stopSpinAudio();
    isSpinningRef.current = false;
    setIsSpinning(false);
    setSelectedPunishment(chosen.text);
    setShowResultModal(true);
    triggerConfetti();
    speakEgyptianDecision(chosen.text, winner);
  }, [
    wheelSlices,
    wheelControls,
    prefersReducedMotion,
    winner,
    triggerConfetti,
    speakEgyptianDecision,
    getSpinAudio,
    stopSpinAudio,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Full-Screen 4-Second Video VAR / Fight Scene -> New 4s Wheel Spin        */
  /* ------------------------------------------------------------------------ */
  const handleTriggerVarReview = () => {
    if (varVideoTimerRef.current) clearTimeout(varVideoTimerRef.current);
    stopSpinAudio();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    isSpinningRef.current = false;
    setIsPlaying(false);
    setIsSpinning(false);
    setShowResultModal(false);
    setSelectedPunishment(null);
    setIsVarVideoOpen(true);

    varVideoTimerRef.current = setTimeout(() => {
      setIsVarVideoOpen(false);
      setIsWheelOpen(true);
      setTimeout(() => {
        void spinTheWheel();
      }, 60);
    }, VAR_VIDEO_DURATION_MS);
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
    winner === "groom"
      ? `${config.brideName} 👰`
      : winner === "bride"
        ? `${config.groomName} 🤵`
        : "الخاسرين الاثنين معاً 💞";

  const isReverseUnoResult = selectedPunishment === REVERSE_UNO_TEXT;

  const getKartAnimation = (role: "groom" | "bride", progress: number) => {
    if (!winner || prefersReducedMotion) {
      return { left: `${progress}%`, rotate: 0, y: 0, x: 0, scale: 1 };
    }
    if (winner === role || winner === "tie") {
      return {
        left: `${progress}%`,
        rotate: [0, 360],
        y: [0, -24, 0, -14, 0],
        scale: [1, 1.15, 1.05, 1.12, 1],
      };
    }
    return {
      left: `${progress}%`,
      x: [-5, 5, -5, 5, -3, 3, 0],
      rotate: 12,
      y: 8,
    };
  };

  return (
    <section
      id="section-6-race"
      className="relative w-full min-h-[720px] flex flex-col items-center justify-center py-10 px-4 bg-gradient-to-b from-[#FCEBF0]/40 via-white to-[#FCEBF0]/30 select-none overflow-hidden"
    >
      {/* Background 8-bit / Arcade Racing Soundtrack + Lightweight Cue Audio Elements */}
      <audio
        ref={audioRef}
        src={RACE_AUDIO_SRC}
        loop
        preload="auto"
        className="hidden"
      />
      <audio ref={startBeepRef} preload="none" className="hidden" />
      <audio ref={winCheerRef} preload="none" className="hidden" />

      <CssConfettiBurst active={showConfetti} />

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
            منافسة شريفة 100% بالسرعة فقط (تعمل بالكيبورد عربي وإنجليزي)! الخاسر هيلف عجلة العقاب 🎡
          </p>

          {/* VS Card Showdown */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-6 mb-10">
            {/* Left: Groom Racer Card */}
            <div className="flex flex-col items-center bg-white/90 rounded-3xl p-6 border-3 border-[#2B1D24]/10 shadow-[0_15px_30px_rgba(43,29,36,0.12)]">
              <div className="relative h-[250px] sm:h-[300px] w-full flex items-end justify-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={config.raceGroomAvatarUrl || GROOM_AVATAR_SRC}
                  alt={`${config.groomName} Racer Avatar`}
                  className="h-full w-auto object-contain drop-shadow-xl select-none"
                />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-[#E3001B]" />
                <h3 className="font-serif text-2xl font-black text-[#2B1D24]">
                  {config.groomName}
                </h3>
              </div>

              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2B1D24] text-white font-mono font-bold text-sm shadow-md">
                <span>الزر:</span>
                <span className="px-2 py-0.5 rounded bg-[#C9A227] text-[#2B1D24] font-black text-base">
                  K
                </span>
                <span className="text-xs text-white/80">(KeyK)</span>
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
                30 ثانية حماسية • بدون أي غش أو بوستات!
              </span>
            </div>

            {/* Right: Bride Racer Card */}
            <div className="flex flex-col items-center bg-white/90 rounded-3xl p-6 border-3 border-[#2B1D24]/10 shadow-[0_15px_30px_rgba(43,29,36,0.12)]">
              <div className="relative h-[250px] sm:h-[300px] w-full flex items-end justify-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={config.raceBrideAvatarUrl || BRIDE_AVATAR_SRC}
                  alt={`${config.brideName} Racer Avatar`}
                  className="h-full w-auto object-contain drop-shadow-xl select-none"
                />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-[#F48FB1]" />
                <h3 className="font-serif text-2xl font-black text-[#2B1D24]">
                  {config.brideName}
                </h3>
              </div>

              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2B1D24] text-white font-mono font-bold text-sm shadow-md">
                <span>الزر:</span>
                <span className="px-2 py-0.5 rounded bg-[#C9A227] text-[#2B1D24] font-black text-base">
                  H
                </span>
                <span className="text-xs text-white/80">(KeyH)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 2. ACTIVE RACE TRACK (Also visible during the 1.35s finish anim)     */}
      {/* -------------------------------------------------------------------- */}
      {(isPlaying || (winner && !showWinnerOverlay && !isWheelOpen)) && (
        <div className="w-full flex flex-col items-center z-10 animate-fadeIn">
          {/* Header Dashboard: Instructions & Big Timer */}
          <div className="flex flex-col items-center text-center gap-2 mb-4 w-full max-w-4xl px-4">
            <div className="flex items-center justify-between w-full">
              {/* Groom Progress Gauge */}
              <div className="flex items-center gap-2 bg-white/90 px-3.5 py-1.5 rounded-full border border-[#2B1D24]/15 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E3001B]" />
                <span className="font-bold text-xs sm:text-sm text-[#2B1D24]">
                  {config.groomName}:
                </span>
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
                    onClick={() => toggleAudio()}
                    className="text-xs p-1 rounded-full hover:bg-black/5 cursor-pointer"
                    title={isAudioMuted ? "تشغيل الموسيقى" : "كتم الموسيقى"}
                    aria-label={
                      isAudioMuted ? "تشغيل الموسيقى" : "كتم الموسيقى"
                    }
                  >
                    {isAudioMuted ? "🔇" : "🔊"}
                  </button>
                </div>
                <div
                  aria-live="polite"
                  className={`font-mono font-black text-3xl sm:text-5xl tracking-wider select-none ${timeLeft <= 5
                      ? "text-[#E3001B] animate-pulse"
                      : "text-[#2B1D24]"
                    }`}
                >
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Bride Progress Gauge */}
              <div className="flex items-center gap-2 bg-white/90 px-3.5 py-1.5 rounded-full border border-[#2B1D24]/15 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F48FB1]" />
                <span className="font-bold text-xs sm:text-sm text-[#2B1D24]">
                  {config.brideName}:
                </span>
                <span className="font-mono font-black text-sm text-[#C9A227]">
                  {brideProgress}%
                </span>
              </div>
            </div>

            {/* Instruction Banner */}
            <p className="mt-1 text-xs sm:text-sm md:text-base font-bold text-[#7A6A5A] tracking-wide select-none">
              {`${config.groomName}: اضغط 'K' 🏁 | ${config.brideName}: اضغطي 'H' 🏁`}
            </p>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* 3D CARTOON TRACK WITH MASSIVE KARTS                              */}
          {/* ---------------------------------------------------------------- */}
          <div
            style={{ perspective: "1000px" }}
            className="relative w-full max-w-5xl mx-auto px-2 sm:px-4 my-2"
          >
            <div
              style={{
                transform: "rotateX(16deg)",
                transformStyle: "preserve-3d",
              }}
              className="relative w-full rounded-3xl border-8 border-white bg-gradient-to-b from-[#FAF4EB] via-[#F3E7DC] to-[#E9DACB] p-4 sm:p-6 shadow-[0_25px_50px_rgba(43,29,36,0.22),inset_0_-8px_0_rgba(0,0,0,0.15)]"
            >
              <div className="relative w-full overflow-hidden rounded-2xl border-2 border-[#2B1D24]/15 bg-white/50 shadow-inner">
                {/* Lane 1: Groom */}
                <div className="relative flex items-center h-[130px] sm:h-[160px] md:h-[190px] bg-[#FCEBF0]/60 border-b-2 border-dashed border-[#2B1D24]/20 px-3 md:px-6">
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

                    {/* MASSIVE Groom Kart with Winner / Loser animations */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none select-none will-change-transform"
                      animate={getKartAnimation("groom", groomProgress)}
                      transition={
                        winner
                          ? { duration: 0.9, ease: "easeInOut" }
                          : kartTransition
                      }
                      style={{ translateX: "-50%" }}
                    >
                      {winner && (
                        <motion.span
                          initial={{ scale: 0, y: 10 }}
                          animate={{ scale: 1.2, y: -12 }}
                          className="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl sm:text-4xl drop-shadow"
                        >
                          {winner === "groom" || winner === "tie" ? "🏆" : "😭"}
                        </motion.span>
                      )}

                      {groomKartError ? (
                        <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl bg-[#2B1D24] text-white flex items-center justify-center text-4xl shadow-md border-2 border-[#C9A227]">
                          🤵🏎️
                        </div>
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={config.raceGroomKartUrl || GROOM_KART_SRC}
                          alt={`${config.groomName} Racing Kart`}
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

                {/* Lane 2: Bride */}
                <div className="relative flex items-center h-[130px] sm:h-[160px] md:h-[190px] bg-[#EAF2F6]/70 px-3 md:px-6">
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

                    {/* MASSIVE Bride Kart with Winner / Loser animations */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none select-none will-change-transform"
                      animate={getKartAnimation("bride", brideProgress)}
                      transition={
                        winner
                          ? { duration: 0.9, ease: "easeInOut" }
                          : kartTransition
                      }
                      style={{ translateX: "-50%" }}
                    >
                      {winner && (
                        <motion.span
                          initial={{ scale: 0, y: 10 }}
                          animate={{ scale: 1.2, y: -12 }}
                          className="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl sm:text-4xl drop-shadow"
                        >
                          {winner === "bride" || winner === "tie" ? "🏆" : "😭"}
                        </motion.span>
                      )}

                      {brideKartError ? (
                        <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl bg-[#FCEBF0] text-white flex items-center justify-center text-4xl shadow-md border-2 border-[#C9A227]">
                          👰🏎️
                        </div>
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={config.raceBrideKartUrl || BRIDE_KART_SRC}
                          alt={`${config.brideName} Racing Kart`}
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
          {isPlaying && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 w-full max-w-4xl px-4 z-20">
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  advancePlayer("groom");
                }}
                className="w-full sm:w-1/2 py-4 px-6 rounded-2xl font-black text-lg md:text-xl text-[#2B1D24] bg-[#FCEBF0] border-3 border-[#C9A227] shadow-[0_6px_0_#C9A227,0_10px_20px_rgba(43,29,36,0.15)] active:translate-y-1 active:shadow-[0_2px_0_#C9A227] transition-all cursor-pointer select-none touch-manipulation"
              >
                🏁 {config.groomName} Tap (K)
              </button>
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  advancePlayer("bride");
                }}
                className="w-full sm:w-1/2 py-4 px-6 rounded-2xl font-black text-lg md:text-xl text-[#2B1D24] bg-[#EAF2F6] border-3 border-[#C9A227] shadow-[0_6px_0_#C9A227,0_10px_20px_rgba(43,29,36,0.15)] active:translate-y-1 active:shadow-[0_2px_0_#C9A227] transition-all cursor-pointer select-none touch-manipulation"
              >
                🏁 {config.brideName} Tap (H)
              </button>
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 3. WINNER CELEBRATION OVERLAY (No early punishment spoiler!)          */}
      {/* -------------------------------------------------------------------- */}
      <AnimatePresence>
        {winner && showWinnerOverlay && !isWheelOpen && !showResultModal && !isVarVideoOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#2B1D24]/92 backdrop-blur-md p-5 sm:p-6 text-center select-none overflow-y-auto"
          >
            {/* Winner & Loser Visual Showdown */}
            <div className="flex items-end justify-center gap-6 sm:gap-10 mb-5">
              {winner !== "tie" ? (
                <>
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { scale: 0.6, y: 20 }
                    }
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { scale: 1, y: [0, -14, 0] }
                    }
                    transition={{
                      y: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
                      scale: { type: "spring", stiffness: 180, damping: 14 },
                    }}
                    className="relative h-[200px] sm:h-[260px] flex items-end justify-center"
                  >
                    <span className="absolute -top-6 right-0 text-4xl sm:text-5xl drop-shadow-lg">
                      🏆
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        winner === "groom"
                          ? config.raceGroomAvatarUrl || GROOM_AVATAR_SRC
                          : config.raceBrideAvatarUrl || BRIDE_AVATAR_SRC
                      }
                      alt="Winner Avatar"
                      className="h-full w-auto object-contain drop-shadow-[0_18px_30px_rgba(201,162,39,0.5)]"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={
                      prefersReducedMotion
                        ? { opacity: 0.75 }
                        : { opacity: 0.78, rotate: 10, x: [-3, 3, -3, 0] }
                    }
                    transition={{ duration: 0.6 }}
                    className="relative h-[150px] sm:h-[200px] flex items-end justify-center grayscale-[30%]"
                  >
                    <span className="absolute -top-5 left-0 text-3xl sm:text-4xl drop-shadow">
                      😭
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        winner === "groom"
                          ? config.raceBrideAvatarUrl || BRIDE_AVATAR_SRC
                          : config.raceGroomAvatarUrl || GROOM_AVATAR_SRC
                      }
                      alt="Loser Avatar"
                      className="h-full w-auto object-contain drop-shadow-md"
                    />
                  </motion.div>
                </>
              ) : (
                <div className="flex items-center gap-4 h-[190px] sm:h-[240px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={config.raceGroomAvatarUrl || GROOM_AVATAR_SRC}
                    alt={`${config.groomName} Avatar`}
                    className="h-full w-auto object-contain drop-shadow-2xl"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={config.raceBrideAvatarUrl || BRIDE_AVATAR_SRC}
                    alt={`${config.brideName} Avatar`}
                    className="h-full w-auto object-contain drop-shadow-2xl"
                  />
                </div>
              )}
            </div>

            <motion.h2
              aria-live="polite"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-serif font-black text-3xl sm:text-5xl text-[#C9A227] tracking-tight drop-shadow-lg mb-2"
            >
              {winner === "groom" && `${config.groomName} WINS THE RACE! 🏆`}
              {winner === "bride" && `${config.brideName} WINS THE RACE! 👑`}
              {winner === "tie" && "IT'S A DEAD HEAT TIE! 💞"}
            </motion.h2>

            <p className="font-sans text-sm md:text-base text-white/90 mb-6 font-semibold">
              {`حان الآن وقت الحساب! لف عجلة العقاب الخاصة بـ ${loserTitle}`}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 z-20">
              <button
                type="button"
                onClick={() => setIsWheelOpen(true)}
                className="px-8 py-4 rounded-2xl font-black text-base sm:text-lg tracking-wide uppercase text-white bg-gradient-to-r from-[#E3001B] via-[#C9A227] to-[#E3001B] shadow-[0_8px_0_#9E1A1A,0_15px_30px_rgba(227,0,27,0.35)] active:translate-y-1 cursor-pointer transition-all animate-pulse"
              >
                🎡 لف عجلة العقاب 🎡
              </button>

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
      {/* 4. ROLE-SPECIFIC WHEEL + REVERSE UNO SLICE (Strict 4s Spin)          */}
      {/* -------------------------------------------------------------------- */}
      <AnimatePresence>
        {isWheelOpen && !isVarVideoOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#2B1D24]/95 backdrop-blur-xl p-4 sm:p-6 text-center select-none overflow-y-auto"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-black text-[#C9A227] mb-2 shadow-sm">
              <span>🎡</span>
              <span>عجلة العقاب الرسمية • {loserTitle}</span>
              <span>🎡</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-4xl font-black text-white mb-1">
              عقاب {loserTitle}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-stone-300 mb-5">
              تحتوي العجلة على خانة ذهبية نادرة &quot;براءة.. العقاب يترد للكسبان!&quot; 🃏
            </p>

            {/* THE ROULETTE WHEEL WRAPPER */}
            <div className="relative my-2 flex items-center justify-center">
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

              <motion.div
                animate={wheelControls}
                className="relative rounded-full p-2 bg-gradient-to-tr from-[#C9A227] via-[#FFF4D4] to-[#C9A227] shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_0_15px_rgba(0,0,0,0.4)] border-4 border-[#2B1D24] will-change-transform"
              >
                <svg
                  width="340"
                  height="340"
                  viewBox="0 0 360 360"
                  className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[370px] md:h-[370px] rounded-full drop-shadow-inner"
                >
                  <defs>
                    <linearGradient
                      id="reverseUnoGold"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#FFF3B0" />
                      <stop offset="50%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                  </defs>

                  <circle cx="180" cy="180" r="176" fill="#2B1D24" />

                  {wheelSlices.map((slice, i) => {
                    const sliceAngle = 360 / wheelSlices.length;
                    const angle = i * sliceAngle;
                    const pathData = describeArc(
                      180,
                      180,
                      172,
                      angle - sliceAngle / 2,
                      angle + sliceAngle / 2
                    );

                    return (
                      <g key={slice.id}>
                        <path
                          d={pathData}
                          fill={slice.color}
                          stroke={slice.isReverseUno ? "#E3001B" : "#FFFFFF"}
                          strokeWidth={slice.isReverseUno ? "3.5" : "2.5"}
                        />
                        <g transform={`rotate(${angle}, 180, 180)`}>
                          <text
                            x="180"
                            y="52"
                            fill={slice.textColor}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={
                              slice.isReverseUno
                                ? "10.5"
                                : wheelSlices.length > 6
                                  ? "11"
                                  : "13"
                            }
                            fontWeight="900"
                            fontFamily="serif"
                            className="select-none"
                          >
                            {slice.isReverseUno
                              ? "🃏 براءة! يترد للكسبان"
                              : slice.text.length > 22
                                ? `${slice.text.slice(0, 20)}…`
                                : slice.text}
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  <circle
                    cx="180"
                    cy="180"
                    r="32"
                    fill="#FFFFFF"
                    stroke="#C9A227"
                    strokeWidth="5"
                  />
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

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={spinTheWheel}
                disabled={isSpinning}
                className={`px-8 sm:px-10 py-4 rounded-2xl font-black text-base sm:text-lg tracking-wider uppercase transition-all select-none ${isSpinning
                    ? "bg-[#7A6A5A]/50 text-white/70 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-[#E5C158] to-[#C9A227] text-[#2B1D24] shadow-[0_8px_0_#9E7E1C,0_15px_30px_rgba(201,162,39,0.35)] active:translate-y-1.5 active:shadow-[0_2px_0_#9E7E1C] hover:brightness-105 cursor-pointer"
                  }`}
              >
                {isSpinning ? "جارِ الدوران (4 ثواني)... 🌀" : "لف العجلة الآن! 🎯"}
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
      {/* 5. RESULT MODAL (Shown ONLY after 4s spin finishes) + VAR BUTTON     */}
      {/* -------------------------------------------------------------------- */}
      <AnimatePresence>
        {showResultModal && selectedPunishment && !isVarVideoOpen && (
          <motion.div
            role="alertdialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl p-6 text-center select-none"
          >
            <div
              className={`relative max-w-lg w-full rounded-3xl p-6 sm:p-8 border-4 shadow-[0_25px_60px_rgba(0,0,0,0.75)] text-[#2B1D24] ${isReverseUnoResult
                  ? "bg-gradient-to-b from-[#FFF8DC] via-[#FFE57F] to-[#FFD700] border-[#E3001B]"
                  : "bg-gradient-to-b from-white via-[#FAF4EB] to-white border-[#C9A227]"
                }`}
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-tr from-[#E3001B] to-[#FF4560] border-3 border-white text-white flex items-center justify-center text-2xl shadow-xl">
                {isReverseUnoResult ? "🃏" : "⚖️"}
              </div>

              <span
                className={`inline-block mt-3 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${isReverseUnoResult
                    ? "bg-[#E3001B] text-white border-white animate-pulse"
                    : "bg-[#E3001B]/10 text-[#E3001B] border-[#E3001B]/20"
                  }`}
              >
                {isReverseUnoResult
                  ? "الضربة القاضية • REVERSE UNO!"
                  : "قرار محكمة الزواج العاجلة 🏛️"}
              </span>

              <h4 className="font-serif text-xl sm:text-2xl font-black text-[#2B1D24] mt-3">
                حكم واجب النفاذ على {loserTitle}
              </h4>

              <div className="my-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#2B1D24] via-[#3B2530] to-[#2B1D24] border-2 border-[#C9A227] shadow-xl text-center">
                <span className="block text-xs font-bold text-[#C9A227] mb-1">
                  العقاب المختار:
                </span>
                <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
                  {selectedPunishment}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleTriggerVarReview}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full font-black text-sm sm:text-base bg-[#2B1D24] hover:bg-[#3B2530] text-[#FFD700] border-2 border-[#FFD700] shadow-lg active:translate-y-1 cursor-pointer transition-all"
                >
                  📺 الرجوع للـ VAR
                </button>

                <button
                  type="button"
                  onClick={startRace}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full font-black text-base uppercase bg-gradient-to-r from-[#E5C158] to-[#C9A227] text-[#2B1D24] shadow-[0_6px_0_#9E7E1C,0_10px_20px_rgba(201,162,39,0.3)] active:translate-y-1 active:shadow-[0_2px_0_#9E7E1C] cursor-pointer hover:brightness-105 transition-all"
                >
                  العب جولة ثانية 🏁
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------------- */}
      {/* 6. FULL-SCREEN 4-SECOND VIDEO VAR / FIGHT SCENE OVERLAY              */}
      {/* -------------------------------------------------------------------- */}
      <AnimatePresence>
        {isVarVideoOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black flex items-center justify-center overflow-hidden"
          >
            <video
              src={VAR_VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full bg-black/80 border-2 border-[#FFD700] text-[#FFD700] font-black text-sm sm:text-base tracking-wide shadow-2xl animate-pulse">
              📺 VAR CHECK IN PROGRESS... جاري مراجعة اللقطة!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
