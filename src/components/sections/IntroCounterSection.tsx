"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Heart, Sparkles, Clock, Compass, ChevronDown } from "lucide-react";

interface IntroCounterSectionProps {
  targetDays?: number;
  startDate?: string;
  isActive: boolean;
  onNext?: () => void;
}

export const IntroCounterSection: React.FC<IntroCounterSectionProps> = ({
  targetDays = 1245,
  startDate = "June 12, 2021",
  isActive,
  onNext,
}) => {
  // Spring animation for smooth counting effect
  const springValue = useSpring(0, {
    stiffness: 45,
    damping: 18,
    mass: 0.8,
  });

  const [displayValue, setDisplayValue] = useState<string>("0");

  const formattedValue = useTransform(springValue, (current) =>
    Math.floor(current).toLocaleString()
  );

  useEffect(() => {
    if (isActive) {
      springValue.set(targetDays);
    } else {
      springValue.set(0);
    }
  }, [isActive, springValue, targetDays]);

  useEffect(() => {
    return formattedValue.on("change", (latest) => {
      setDisplayValue(latest);
    });
  }, [formattedValue]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between py-6 text-center select-none">
      {/* Top Tag / Pill */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-romantic-roseGold/30 shadow-sm text-xs font-medium text-romantic-charcoal tracking-wide"
      >
        <Sparkles className="w-3.5 h-3.5 text-romantic-roseGold" />
        <span>Chapter 2025 • Since {startDate}</span>
      </motion.div>

      {/* Main Big Number Hero */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-2">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="font-serif text-lg sm:text-2xl text-romantic-charcoalSoft font-light italic mb-1"
        >
          We&apos;ve shared
        </motion.p>

        {/* Dramatic massive scale number container */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: [0.3, 1.12, 1], opacity: 1 }}
          transition={{
            duration: 1.1,
            times: [0, 0.75, 1],
            ease: [0.34, 1.56, 0.64, 1] as const,
            delay: 0.45,
          }}
          className="relative py-2 my-2"
        >
          {/* Subtle warm glow behind the massive counter */}
          <div className="absolute inset-0 bg-gradient-to-r from-romantic-blush/40 via-romantic-roseGold/20 to-romantic-blush/40 blur-2xl -z-10 rounded-full scale-125" />

          <h1 className="font-serif text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight text-romantic-charcoal leading-none drop-shadow-sm">
            <span className="text-gold-shimmer">{displayValue}</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="space-y-1"
        >
          <p className="font-serif text-2xl sm:text-3xl text-romantic-charcoal font-medium tracking-wide">
            Days of pure joy
          </p>
          <p className="text-xs sm:text-sm text-romantic-muted max-w-xs mx-auto">
            And every single second was spent falling a little deeper in love.
          </p>
        </motion.div>

        {/* Sub-Metrics Cards in Spotify-style micro badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="grid grid-cols-3 gap-2 w-full mt-6 pt-2"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2.5 border border-romantic-roseGold/20 shadow-sm flex flex-col items-center">
            <Clock className="w-4 h-4 text-romantic-roseGold mb-1" />
            <span className="text-xs font-bold text-romantic-charcoal">29,880</span>
            <span className="text-[10px] text-romantic-muted uppercase tracking-wider">Hours</span>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2.5 border border-romantic-roseGold/20 shadow-sm flex flex-col items-center">
            <Heart className="w-4 h-4 text-romantic-blushDeep fill-romantic-blushDeep mb-1" />
            <span className="text-xs font-bold text-romantic-charcoal">100%</span>
            <span className="text-[10px] text-romantic-muted uppercase tracking-wider">Devotion</span>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2.5 border border-romantic-roseGold/20 shadow-sm flex flex-col items-center">
            <Compass className="w-4 h-4 text-romantic-roseGoldDark mb-1" />
            <span className="text-xs font-bold text-romantic-charcoal">Infinite</span>
            <span className="text-[10px] text-romantic-muted uppercase tracking-wider">Adventures</span>
          </div>
        </motion.div>
      </div>

      {/* Swipe up prompt / click prompt */}
      <motion.button
        onClick={onNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="flex flex-col items-center gap-1 group text-romantic-muted hover:text-romantic-charcoal transition-colors cursor-pointer pt-2"
      >
        <span className="text-xs font-medium tracking-wide">
          Swipe or tap for your Top 5 Milestones
        </span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-romantic-roseGold" />
        </motion.div>
      </motion.button>
    </div>
  );
};

