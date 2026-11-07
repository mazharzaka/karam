"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform, Variants } from "framer-motion";
import { Sparkles, Clock, Heart, Compass, ChevronDown } from "lucide-react";

interface Scene1StatsProps {
  daysTogether?: number;
  startDate?: string;
  onNext?: () => void;
}

export const Scene1Stats: React.FC<Scene1StatsProps> = ({
  daysTogether = 1245,
  startDate = "June 12, 2021",
  onNext,
}) => {
  const springValue = useSpring(0, {
    stiffness: 40,
    damping: 18,
    mass: 0.9,
  });

  const [counterText, setCounterText] = useState<string>("0");
  const formatted = useTransform(springValue, (val) =>
    Math.floor(val).toLocaleString()
  );

  useEffect(() => {
    springValue.set(daysTogether);
    return formatted.on("change", (latest) => {
      setCounterText(latest);
    });
  }, [daysTogether, formatted, springValue]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      key="scene-1-stats"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -40, transition: { duration: 0.6 } }}
      className="relative w-full h-full max-w-6xl mx-auto flex flex-col justify-between items-center py-10 px-6 text-center select-none"
    >
      {/* Top Scene Badge */}
      <motion.div
        variants={itemVariants}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-romantic-roseGold/35 shadow-sm text-xs font-semibold text-romantic-charcoal"
      >
        <Sparkles className="w-3.5 h-3.5 text-romantic-roseGold" />
        <span>Scene 01 • The Romance Index • Since {startDate}</span>
      </motion.div>

      {/* Hero Typography Centerpiece */}
      <div className="flex flex-col items-center my-auto">
        <motion.p
          variants={itemVariants}
          className="font-serif text-2xl sm:text-3xl text-romantic-charcoalSoft font-light italic"
        >
          We&apos;ve shared every sunrise and dream...
        </motion.p>

        {/* Dramatic Massive Counter */}
        <motion.div
          variants={itemVariants}
          className="relative py-2 my-2 select-none"
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-romantic-roseGold/20 blur-3xl rounded-full scale-125 pointer-events-none" />

          <h2 className="font-serif text-8xl sm:text-9xl md:text-[11rem] font-bold tracking-tight text-romantic-charcoal leading-none">
            <span className="text-gold-shimmer drop-shadow-sm">
              {counterText}
            </span>
          </h2>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="font-serif text-3xl sm:text-4xl text-romantic-charcoal font-medium tracking-wide mt-1"
        >
          Days of Pure Joy &amp; Devotion
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-xs sm:text-sm text-romantic-muted max-w-md mx-auto mt-2"
        >
          أيامٌ من الفرح الخالص، وكل ثانيةٍ كانت بدايةً لعشقٍ أعمق.
        </motion.p>

        {/* Row of 3 Glassy Stat Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-8"
        >
          <div className="p-5 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-polaroid hover:shadow-polaroid-hover transition-all duration-300">
            <Clock className="w-5 h-5 text-romantic-roseGold mx-auto mb-2" />
            <p className="font-serif text-2xl font-bold text-romantic-charcoal">
              29,880
            </p>
            <p className="text-[10px] uppercase tracking-widest text-romantic-roseGoldDark font-semibold mt-0.5">
              Hours Loved
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-br from-white/90 to-romantic-blushLight/70 backdrop-blur-xl border-2 border-romantic-roseGold/40 shadow-polaroid ring-2 ring-romantic-roseGold/15">
            <Heart className="w-5 h-5 text-romantic-blushDeep fill-romantic-blushDeep mx-auto mb-2" />
            <p className="font-serif text-2xl font-bold text-romantic-charcoal">
              100%
            </p>
            <p className="text-[10px] uppercase tracking-widest text-romantic-blushDeep font-semibold mt-0.5">
              Devotion Score
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-polaroid hover:shadow-polaroid-hover transition-all duration-300">
            <Compass className="w-5 h-5 text-romantic-roseGoldDark mx-auto mb-2" />
            <p className="font-serif text-2xl font-bold text-romantic-charcoal">
              Infinite
            </p>
            <p className="text-[10px] uppercase tracking-widest text-romantic-roseGoldDark font-semibold mt-0.5">
              Adventures Shared
            </p>
          </div>
        </motion.div>
      </div>

      {/* Pulsing Navigation Hint at Bottom */}
      <motion.button
        onClick={onNext}
        variants={itemVariants}
        className="flex flex-col items-center gap-1 group text-romantic-muted hover:text-romantic-charcoal transition-colors cursor-pointer pt-4"
      >
        <span className="text-xs font-semibold tracking-wider text-romantic-charcoalSoft">
          Press Down Arrow or Scroll
        </span>
        <span className="text-[11px] text-romantic-roseGoldDark font-medium">
          (اضغط السهم للأسفل للمتابعة)
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-romantic-roseGold" />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

