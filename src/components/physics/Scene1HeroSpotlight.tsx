"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowDown,
  Eye,
  PartyPopper,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  intervalToDuration,
} from "date-fns";
import { useWeddingConfig } from "@/context/WeddingConfigContext";

type TimeFormatMode = "hms" | "days" | "years" | "detailed";

interface Scene1HeroSpotlightProps {
  onNext?: () => void;
  startDate?: string | Date;
}

function getSafeDuration(dateInput: string | Date, now: Date) {
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalDays: 0,
      totalHours: 0,
      totalMinutes: 0,
      totalSeconds: 0,
      decimalYears: "0.00",
      isFuture: false,
    };
  }
  const isFuture = parsed.getTime() > now.getTime();
  const start = isFuture ? now : parsed;
  const end = isFuture ? parsed : now;
  const duration = intervalToDuration({ start, end });
  const totalDays = Math.abs(differenceInDays(now, parsed));
  const totalHours = Math.abs(differenceInHours(now, parsed));
  const totalMinutes = Math.abs(differenceInMinutes(now, parsed));
  const totalSeconds = Math.abs(differenceInSeconds(now, parsed));
  return {
    years: duration.years || 0,
    months: duration.months || 0,
    days: duration.days || 0,
    hours: duration.hours || 0,
    minutes: duration.minutes || 0,
    seconds: duration.seconds || 0,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    decimalYears: (totalDays / 365.2425).toFixed(2),
    isFuture,
  };
}

export const Scene1HeroSpotlight: React.FC<Scene1HeroSpotlightProps> = ({
  onNext,
  startDate = "2023-08-10T00:00:00",
}) => {
  const { config } = useWeddingConfig();
  const effectiveStartDate =
    config.engagementDate || config.weddingDate || startDate;

  const [mounted, setMounted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [formatMode, setFormatMode] = useState<TimeFormatMode>("hms");

  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 600,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 400,
  });

  const parsedStartDate = useMemo(() => new Date(effectiveStartDate), [effectiveStartDate]);

  // Hourly Celebration: Track hours passed using useRef
  const hoursPassed = useMemo(() => {
    return differenceInHours(currentTime, parsedStartDate);
  }, [currentTime, parsedStartDate]);

  const prevHoursRef = useRef<number | null>(null);

  // Massive celebration confetti explosion
  const triggerHourlyCelebration = useCallback(() => {
    const romanticColors = [
      "#D4AF37", // Rose gold
      "#F2D98D", // Light gold
      "#F8BBD0", // Soft blush
      "#E57399", // Deep rose
      "#FFFFFF", // Crystal white
      "#B89335", // Deep gold
    ];

    // Center radiant burst
    confetti({
      particleCount: 160,
      spread: 110,
      origin: { x: 0.5, y: 0.55 },
      colors: romanticColors,
      ticks: 350,
      gravity: 0.85,
      scalar: 1.25,
      shapes: ["circle", "square"],
    });

    // Left cannon sweep
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 65,
      origin: { x: 0.12, y: 0.72 },
      colors: romanticColors,
      ticks: 320,
    });

    // Right cannon sweep
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 65,
      origin: { x: 0.88, y: 0.72 },
      colors: romanticColors,
      ticks: 320,
    });
  }, []);

  // Check if hour value has incremented or changed from the last checked state
  useEffect(() => {
    if (mounted) {
      if (prevHoursRef.current !== null && hoursPassed !== prevHoursRef.current) {
        triggerHourlyCelebration();
      }
      prevHoursRef.current = hoursPassed;
    }
  }, [hoursPassed, mounted, triggerHourlyCelebration]);

  // Initialize clock ticker and mount state
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Time calculations via date-fns (Engagement & Wedding)
  const engagementStats = useMemo(
    () => getSafeDuration(config.engagementDate || effectiveStartDate, currentTime),
    [config.engagementDate, effectiveStartDate, currentTime]
  );

  const weddingStats = useMemo(
    () => getSafeDuration(config.weddingDate || effectiveStartDate, currentTime),
    [config.weddingDate, effectiveStartDate, currentTime]
  );

  const timeStats = useMemo(() => {
    const base = getSafeDuration(effectiveStartDate, currentTime);
    return {
      totalYears: base.years,
      totalDays: base.totalDays,
      totalHours: base.totalHours,
      totalMinutes: base.totalMinutes,
      totalSeconds: base.totalSeconds,
      durationYears: base.years,
      durationMonths: base.months,
      durationDays: base.days,
      durationHours: base.hours,
      durationMinutes: base.minutes,
      durationSeconds: base.seconds,
      subMinuteSecs: base.totalSeconds % 60,
      subHourMins: base.totalMinutes % 60,
      decimalYears: base.decimalYears,
    };
  }, [currentTime, effectiveStartDate]);

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full h-full min-h-[92vh] flex flex-col justify-between items-center py-10 px-4 sm:px-8 bg-[#24181B] text-[#FDECEF] overflow-hidden select-none"
    >
      {/* 
        ENHANCED MOUSE SPOTLIGHT (THE REVEAL): 
        Dynamic Main Hero Background Image from Admin Config
      */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          maskImage: `radial-gradient(circle 500px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 48%, rgba(0,0,0,0.65) 75%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 500px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 48%, rgba(0,0,0,0.65) 75%, transparent 100%)`,
        }}
      >
        <Image
          src={config.mainHeroBgUrl}
          alt={`${config.groomName} & ${config.brideName} - Forever Starts Here`}
          fill
          priority
          unoptimized
          className="object-cover filter brightness-115 contrast-105 scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#24181B]/85 via-transparent to-[#24181B]/40" />

        {/* Floating Spotlight Label */}
        <div
          className="absolute z-20 pointer-events-none transition-transform duration-75"
          style={{
            left: `${mousePos.x + 35}px`,
            top: `${mousePos.y - 45}px`,
          }}
        >
          <div className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-romantic-roseGold/70 text-[11px] text-romantic-roseGoldLight font-serif shadow-glow whitespace-nowrap flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-romantic-roseGold animate-pulse" />
            <span className="tracking-wide">
              {config.groomName} &amp; {config.brideName} • The Spotlight
            </span>
          </div>
        </div>
      </div>

      {/* Spotlight Cursor Ring Highlight */}
      <div
        className="absolute pointer-events-none rounded-full border border-romantic-roseGold/40 shadow-[0_0_50px_rgba(212,175,55,0.22)] transition-transform duration-75 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          width: "520px",
          height: "520px",
        }}
      />

      {/* Top Editorial Monogram & Hourly Celebration Indicator */}
      <div className="relative z-20 w-full flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-romantic-roseGold/35 shadow-sm text-xs font-semibold text-romantic-roseGoldLight tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5 text-romantic-roseGold" />
          <span>
            {config.groomName} &amp; {config.brideName} • Forever Story
          </span>
        </motion.div>

        {/* Hourly Celebration Badge / Manual Trigger */}
        <motion.button
          onClick={triggerHourlyCelebration}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Click to celebrate this hour of love with confetti!"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-romantic-roseGold/40 hover:border-romantic-roseGold text-[11px] text-romantic-roseGoldLight hover:text-white transition-all shadow-glow cursor-pointer group"
        >
          <PartyPopper className="w-3.5 h-3.5 text-romantic-roseGold group-hover:rotate-12 transition-transform" />
          <span>Hourly Milestone Active ({mounted ? timeStats.totalHours.toLocaleString() : "..."}h)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </motion.button>
      </div>

      {/* MAIN HERO CONTENT: Central Counter & Floating Childhood Photos */}
      <div className="relative z-20 flex flex-col items-center my-auto text-center w-full max-w-4xl px-2">
        
        {/* Dynamic Couple Title & Subtitle intro */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mb-1 drop-shadow-lg"
        >
          {config.groomName} &amp; {config.brideName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-lg sm:text-xl md:text-2xl text-romantic-blushLight font-light italic tracking-wide mb-3"
        >
          In a world of billions, our time belongs together...
        </motion.p>

        {/* Relative container wrapping the main counter and floating childhood portraits */}
        <div className="relative w-full flex items-center justify-center my-4 py-4">

          {/* 
            CHILDHOOD PHOTO 1: BRIDE (Top-Left Floating Polaroid Avatar) 
          */}
          <motion.div
            initial={{ opacity: 0, x: -40, y: -20, rotate: -8 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -12, 0],
              rotate: [-5, 2, -5],
            }}
            transition={{
              opacity: { duration: 1, delay: 0.5 },
              x: { duration: 1, delay: 0.5 },
              y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 7, ease: "easeInOut" },
            }}
            className="absolute -top-10 -left-2 sm:-left-8 md:-left-16 z-30 pointer-events-auto"
          >
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-romantic-roseGold/40 shadow-polaroid hover:border-romantic-roseGold transition-colors group cursor-default">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border border-romantic-roseGold/50 shadow-inner">
                <Image
                  src={config.brideChildhoodUrl}
                  alt={`${config.brideName} childhood memory`}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="mt-1 text-center">
                <p className="font-serif text-[10px] sm:text-xs text-romantic-roseGoldLight font-semibold">
                  {config.brideName} • Childhood
                </p>
                <p className="text-[8px] sm:text-[9px] text-[#FDECEF]/60 italic">
                  Dreaming of forever
                </p>
              </div>
            </div>
          </motion.div>

          {/* 
            CHILDHOOD PHOTO 2: GROOM (Bottom-Right Floating Polaroid Avatar) 
          */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20, rotate: 8 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, 14, 0],
              rotate: [4, -3, 4],
            }}
            transition={{
              opacity: { duration: 1, delay: 0.7 },
              x: { duration: 1, delay: 0.7 },
              y: { repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 0.5 },
              rotate: { repeat: Infinity, duration: 7.5, ease: "easeInOut", delay: 0.5 },
            }}
            className="absolute -bottom-10 -right-2 sm:-right-8 md:-right-16 z-30 pointer-events-auto"
          >
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-romantic-roseGold/40 shadow-polaroid hover:border-romantic-roseGold transition-colors group cursor-default">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border border-romantic-roseGold/50 shadow-inner">
                <Image
                  src={config.groomChildhoodUrl}
                  alt={`${config.groomName} childhood memory`}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="mt-1 text-center">
                <p className="font-serif text-[10px] sm:text-xs text-romantic-roseGoldLight font-semibold">
                  {config.groomName} • Childhood
                </p>
                <p className="text-[8px] sm:text-[9px] text-[#FDECEF]/60 italic">
                  Destined to meet
                </p>
              </div>
            </div>
          </motion.div>

          {/* 
            CENTRAL DYNAMIC LIVE COUNTER (date-fns driven)
          */}
          <div className="w-full flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {/* DEFAULT VIEW: Hours : Minutes : Seconds */}
              {formatMode === "hms" && (
                <motion.div
                  key="hms"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <div className="flex items-baseline justify-center gap-2 sm:gap-4 md:gap-6 font-serif font-bold text-white tracking-tight drop-shadow-2xl">
                    {/* Hours block */}
                    <div className="flex flex-col items-center">
                      <span className="text-5xl sm:text-7xl md:text-9xl text-gold-shimmer font-serif">
                        {mounted ? timeStats.totalHours.toLocaleString() : "..."}
                      </span>
                      <span className="text-[10px] sm:text-xs md:text-sm font-sans tracking-widest uppercase text-romantic-roseGoldLight/90 mt-1">
                        Hours
                      </span>
                    </div>

                    <span className="text-4xl sm:text-6xl md:text-8xl text-romantic-roseGold/60 select-none pb-4">
                      :
                    </span>

                    {/* Minutes block */}
                    <div className="flex flex-col items-center">
                      <span className="text-5xl sm:text-7xl md:text-9xl text-white font-serif">
                        {mounted ? String(timeStats.subHourMins).padStart(2, "0") : "00"}
                      </span>
                      <span className="text-[10px] sm:text-xs md:text-sm font-sans tracking-widest uppercase text-romantic-roseGoldLight/90 mt-1">
                        Minutes
                      </span>
                    </div>

                    <span className="text-4xl sm:text-6xl md:text-8xl text-romantic-roseGold/60 select-none pb-4">
                      :
                    </span>

                    {/* Seconds block */}
                    <div className="flex flex-col items-center">
                      <span className="text-5xl sm:text-7xl md:text-9xl text-romantic-blushLight font-serif">
                        {mounted ? String(timeStats.subMinuteSecs).padStart(2, "0") : "00"}
                      </span>
                      <span className="text-[10px] sm:text-xs md:text-sm font-sans tracking-widest uppercase text-romantic-roseGoldLight/90 mt-1">
                        Seconds
                      </span>
                    </div>
                  </div>

                  <p className="font-serif text-xl sm:text-2xl md:text-3xl font-medium tracking-wide text-romantic-roseGoldLight mt-3">
                    Hours of Devoted Love
                  </p>
                </motion.div>
              )}

              {/* IN DAYS VIEW */}
              {formatMode === "days" && (
                <motion.div
                  key="days"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <h1 className="font-serif text-7xl sm:text-9xl md:text-[11rem] font-bold tracking-tight text-white leading-none drop-shadow-2xl">
                    <span className="text-gold-shimmer">
                      {mounted ? timeStats.totalDays.toLocaleString() : "..."}
                    </span>
                  </h1>
                  <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-wide text-romantic-roseGoldLight mt-2">
                    Days of Sacred Love
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs sm:text-sm text-romantic-blush font-light font-mono bg-black/30 px-3 py-1 rounded-full border border-romantic-roseGold/30">
                    <span>+{timeStats.durationHours}h</span>
                    <span>:</span>
                    <span>{String(timeStats.durationMinutes).padStart(2, "0")}m</span>
                    <span>:</span>
                    <span>{String(timeStats.durationSeconds).padStart(2, "0")}s</span>
                  </div>
                </motion.div>
              )}

              {/* IN YEARS VIEW */}
              {formatMode === "years" && (
                <motion.div
                  key="years"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <h1 className="font-serif text-7xl sm:text-9xl md:text-[10rem] font-bold tracking-tight text-white leading-none drop-shadow-2xl">
                    <span className="text-gold-shimmer">
                      {mounted ? timeStats.decimalYears : "..."}
                    </span>
                    <span className="text-4xl sm:text-6xl text-romantic-roseGoldLight ml-2 font-normal font-sans">
                      yrs
                    </span>
                  </h1>
                  <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-wide text-romantic-roseGoldLight mt-2">
                    Years Written in the Stars
                  </p>
                  <p className="text-xs sm:text-sm text-romantic-blush font-light mt-1">
                    {timeStats.durationYears} Years, {timeStats.durationMonths} Months, {timeStats.durationDays} Days together
                  </p>
                </motion.div>
              )}

              {/* DETAILED VIEW */}
              {formatMode === "detailed" && (
                <motion.div
                  key="detailed"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center w-full"
                >
                  <div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4 w-full max-w-2xl px-2">
                    {[
                      { label: "Years", val: timeStats.durationYears },
                      { label: "Months", val: timeStats.durationMonths },
                      { label: "Days", val: timeStats.durationDays },
                      { label: "Hours", val: timeStats.durationHours },
                      { label: "Seconds", val: timeStats.durationSeconds },
                    ].map((unit) => (
                      <div
                        key={unit.label}
                        className="flex flex-col items-center p-2 sm:p-3 rounded-xl bg-white/5 backdrop-blur-md border border-romantic-roseGold/30"
                      >
                        <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-white text-gold-shimmer">
                          {mounted ? unit.val : 0}
                        </span>
                        <span className="text-[9px] sm:text-xs font-sans uppercase tracking-widest text-romantic-roseGoldLight mt-1">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="font-serif text-xl sm:text-2xl font-medium tracking-wide text-romantic-roseGoldLight mt-4">
                    Every Second Counted Since Day One
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 
          ELEGANT FORMAT TOGGLE BUTTONS
        */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-1.5 p-1 rounded-full bg-black/40 backdrop-blur-md border border-romantic-roseGold/30 shadow-lg mt-2"
        >
          <button
            onClick={() => setFormatMode("hms")}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
              formatMode === "hms"
                ? "bg-romantic-roseGold/30 text-romantic-roseGoldLight border border-romantic-roseGold/70 shadow-glow font-semibold"
                : "text-[#FDECEF]/70 hover:text-white hover:bg-white/5"
            }`}
          >
            Hours : Min : Sec
          </button>

          <button
            onClick={() => setFormatMode("days")}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
              formatMode === "days"
                ? "bg-romantic-roseGold/30 text-romantic-roseGoldLight border border-romantic-roseGold/70 shadow-glow font-semibold"
                : "text-[#FDECEF]/70 hover:text-white hover:bg-white/5"
            }`}
          >
            In Days
          </button>

          <button
            onClick={() => setFormatMode("years")}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
              formatMode === "years"
                ? "bg-romantic-roseGold/30 text-romantic-roseGoldLight border border-romantic-roseGold/70 shadow-glow font-semibold"
                : "text-[#FDECEF]/70 hover:text-white hover:bg-white/5"
            }`}
          >
            In Years
          </button>

          <button
            onClick={() => setFormatMode("detailed")}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
              formatMode === "detailed"
                ? "bg-romantic-roseGold/30 text-romantic-roseGoldLight border border-romantic-roseGold/70 shadow-glow font-semibold"
                : "text-[#FDECEF]/70 hover:text-white hover:bg-white/5"
            }`}
          >
            Detailed
          </button>
        </motion.div>

        {/* Dual Live Milestone Counter: Engagement & Wedding (Years, Months, Days, Hours) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl"
        >
          <div className="px-4 py-2.5 rounded-2xl bg-black/35 backdrop-blur-md border border-romantic-roseGold/30 text-center">
            <p className="text-[10px] uppercase tracking-widest text-romantic-roseGoldLight/80 font-semibold">
              Since Engagement ({config.engagementDate || "—"})
            </p>
            <p className="font-serif text-sm sm:text-base font-bold text-white mt-0.5">
              {mounted
                ? `${engagementStats.years}y • ${engagementStats.months}m • ${engagementStats.days}d • ${engagementStats.hours}h`
                : "..."}
            </p>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-black/35 backdrop-blur-md border border-romantic-roseGold/30 text-center">
            <p className="text-[10px] uppercase tracking-widest text-romantic-roseGoldLight/80 font-semibold">
              {weddingStats.isFuture ? "Countdown to Wedding" : "Since Wedding"} ({config.weddingDate || "—"})
            </p>
            <p className="font-serif text-sm sm:text-base font-bold text-white mt-0.5">
              {mounted
                ? `${weddingStats.years}y • ${weddingStats.months}m • ${weddingStats.days}d • ${weddingStats.hours}h`
                : "..."}
            </p>
          </div>
        </motion.div>

        {/* Interactive Spotlight Prompt Mini-Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center gap-3 mt-4 px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-md border border-romantic-roseGold/20 text-left text-xs"
        >
          <div className="w-2 h-2 rounded-full bg-romantic-roseGold animate-ping shrink-0" />
          <p className="text-[#FDECEF]/80">
            <span className="font-serif font-bold text-white mr-1.5">Interactive Spotlight:</span>
            Move your cursor across the screen to reveal {config.groomName} &amp; {config.brideName}&apos;s wedding memory.
          </p>
        </motion.div>
      </div>

      {/* Bottom Hint / Scene Navigation */}
      <motion.button
        onClick={onNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-20 flex flex-col items-center gap-1 group text-romantic-blush hover:text-white transition-colors cursor-pointer pt-2"
      >
        <span className="text-xs font-medium tracking-widest uppercase">
          Proceed to Scene 02: Egyptian Heritage
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4 text-romantic-roseGold" />
        </motion.div>
      </motion.button>
    </div>
  );
};
