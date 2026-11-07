"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Heart, Sparkles, Clock, Compass, ArrowDown } from "lucide-react";

interface Chapter1HeroStatsProps {
  daysTogether?: number;
  startDate?: string;
}

export const Chapter1HeroStats: React.FC<Chapter1HeroStatsProps> = ({
  daysTogether = 1245,
  startDate = "June 12, 2021",
}) => {
  const springValue = useSpring(0, {
    stiffness: 40,
    damping: 20,
    mass: 1,
  });

  const [counterText, setCounterText] = useState<string>("0");
  const formattedSpring = useTransform(springValue, (val) =>
    Math.floor(val).toLocaleString()
  );

  useEffect(() => {
    springValue.set(daysTogether);
    return formattedSpring.on("change", (latest) => {
      setCounterText(latest);
    });
  }, [daysTogether, formattedSpring, springValue]);

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] w-full flex flex-col items-center justify-center pt-28 pb-20 px-6 overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FDECEF] to-[#FCE4EC]"
    >
      {/* Cinematic subtle grain texture */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay bg-[radial-gradient(#33272A_0.75px,transparent_0.75px)] [background-size:20px_20px]" />

      {/* Radiant ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-romantic-blush/40 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] rounded-full bg-romantic-roseGold/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl w-full mx-auto text-center flex flex-col items-center relative z-10">
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-romantic-roseGold/35 shadow-sm text-xs sm:text-sm font-medium text-romantic-charcoal tracking-wide mb-6"
        >
          <Sparkles className="w-4 h-4 text-romantic-roseGold" />
          <span>Chapter 01 • The Romance Index • Since {startDate}</span>
        </motion.div>

        {/* Cinematic Headline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-serif text-2xl sm:text-3xl md:text-4xl text-romantic-charcoalSoft font-light italic"
        >
          Every love story is beautiful, but ours is our favorite...
        </motion.p>

        {/* Massive Screen-Filling Typography */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative my-4 select-none"
        >
          {/* Subtle gold backglow */}
          <div className="absolute inset-0 bg-romantic-roseGold/25 blur-3xl rounded-full scale-110 pointer-events-none" />

          <h1 className="font-serif text-8xl sm:text-9xl md:text-[13rem] font-bold tracking-tight leading-none">
            <span className="text-gold-shimmer drop-shadow-sm">
              {counterText}
            </span>
          </h1>

          <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-wide text-romantic-charcoal mt-2">
            Days of Pure Devotion
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base sm:text-lg text-romantic-muted max-w-2xl mx-auto mt-2 mb-10"
        >
          From the first spontaneous coffee date in Montmartre to saying our vows under the golden French Riviera sun.
        </motion.p>

        {/* Row of 3 Glassy Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
        >
          {/* Card 1 */}
          <div className="relative group p-6 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-polaroid hover:shadow-polaroid-hover transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-romantic-roseGold/15 border border-romantic-roseGold/30 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-romantic-roseGoldDark" />
            </div>
            <p className="text-3xl font-serif font-bold text-romantic-charcoal">
              29,880
            </p>
            <p className="text-xs uppercase tracking-widest text-romantic-roseGoldDark font-semibold mt-1">
              Hours Logged Together
            </p>
            <p className="text-xs text-romantic-muted mt-2">
              Every hour felt like a single heartbeat of joy.
            </p>
          </div>

          {/* Card 2 (Hero Accent) */}
          <div className="relative group p-6 rounded-3xl bg-gradient-to-br from-white/90 via-white/80 to-romantic-blushLight/80 backdrop-blur-xl border-2 border-romantic-roseGold/50 shadow-polaroid hover:shadow-polaroid-hover transition-all duration-300 hover:-translate-y-1.5 ring-2 ring-romantic-roseGold/15">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-romantic-roseGold to-romantic-roseGoldLight text-romantic-charcoal text-[10px] font-bold tracking-wider uppercase shadow-sm">
              Spotify Vibe: 100%
            </div>
            <div className="w-12 h-12 rounded-2xl bg-romantic-blushDeep/15 border border-romantic-blushDeep/30 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-romantic-blushDeep fill-romantic-blushDeep" />
            </div>
            <p className="text-3xl font-serif font-bold text-romantic-charcoal">
              100% Devotion
            </p>
            <p className="text-xs uppercase tracking-widest text-romantic-blushDeep font-semibold mt-1">
              Zero Skipped Tracks
            </p>
            <p className="text-xs text-romantic-muted mt-2">
              Top 0.001% of worldwide romantic soulmates.
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative group p-6 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-polaroid hover:shadow-polaroid-hover transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-romantic-roseGold/15 border border-romantic-roseGold/30 flex items-center justify-center mx-auto mb-3">
              <Compass className="w-6 h-6 text-romantic-roseGoldDark" />
            </div>
            <p className="text-3xl font-serif font-bold text-romantic-charcoal">
              Infinite
            </p>
            <p className="text-xs uppercase tracking-widest text-romantic-roseGoldDark font-semibold mt-1">
              Adventures &amp; Laughs
            </p>
            <p className="text-xs text-romantic-muted mt-2">
              Spanning 14 cities, 4 continents, and counting.
            </p>
          </div>
        </motion.div>

        {/* Scroll invitation */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="mt-14 flex flex-col items-center gap-1.5 text-romantic-muted"
        >
          <span className="text-xs uppercase tracking-widest font-medium">
            Scroll to Chapter 02: Adventures Parallax
          </span>
          <ArrowDown className="w-4 h-4 text-romantic-roseGold" />
        </motion.div>
      </div>
    </section>
  );
};

