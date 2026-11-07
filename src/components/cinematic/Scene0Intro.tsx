"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Maximize2, Heart } from "lucide-react";
import { romanticAudio } from "@/utils/audioSynthesizer";

interface Scene0IntroProps {
  onEnter: () => void;
}

export const Scene0Intro: React.FC<Scene0IntroProps> = ({ onEnter }) => {
  const handleStart = () => {
    // Attempt fullscreen API
    if (typeof document !== "undefined") {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          // Fullscreen might be blocked by browser policy without user gesture
        });
      }
    }

    // Initialize the romantic audio player
    if (romanticAudio) {
      romanticAudio.start();
    }

    onEnter();
  };

  return (
    <motion.div
      key="scene-0-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center select-none"
    >
      {/* Soft ambient lighting halos */}
      <div className="absolute w-[32rem] h-[32rem] rounded-full bg-romantic-blush/35 blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute w-[24rem] h-[24rem] rounded-full bg-romantic-roseGold/20 blur-3xl pointer-events-none -z-10" />

      {/* Decorative monogram emblem */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-md border border-romantic-roseGold/40 shadow-sm flex items-center justify-center mb-6"
      >
        <Heart className="w-7 h-7 text-romantic-blushDeep fill-romantic-blushDeep" />
      </motion.div>

      {/* Editorial Title */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="space-y-2 mb-8 max-w-2xl"
      >
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-romantic-roseGoldDark">
          Sophia &amp; Julian • Cinematic Wrapped 2025
        </span>

        <h1 className="font-serif text-5xl sm:text-7xl font-bold tracking-tight text-romantic-charcoal leading-tight">
          Our Love In Motion
        </h1>

        <p className="font-serif text-2xl text-romantic-roseGoldDark italic">
          قصة حب في مشاهد سينمائية
        </p>

        <p className="text-sm sm:text-base text-romantic-muted max-w-lg mx-auto mt-3">
          A bespoke interactive film celebrating our days, our adventures, and our forever. Best experienced with sound and full screen.
        </p>
      </motion.div>

      {/* Glassmorphic Call To Action Button */}
      <motion.button
        onClick={handleStart}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="group relative px-10 py-5 rounded-full bg-white/70 hover:bg-white/95 backdrop-blur-xl border-2 border-romantic-roseGold/50 shadow-polaroid hover:shadow-glow transition-all duration-300 flex items-center gap-4 text-romantic-charcoal cursor-pointer"
      >
        <div className="p-2 rounded-full bg-romantic-roseGold/20 group-hover:bg-romantic-roseGold transition-colors text-romantic-roseGoldDark group-hover:text-white">
          <Maximize2 className="w-5 h-5" />
        </div>

        <div className="flex flex-col text-left">
          <span className="font-serif text-lg font-bold tracking-wide">
            Enter the Experience
          </span>
          <span className="text-xs text-romantic-muted font-medium">
            ابدأ الرحلة السينمائية
          </span>
        </div>

        <Sparkles className="w-5 h-5 text-romantic-roseGold group-hover:rotate-12 transition-transform ml-2" />
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-[11px] uppercase tracking-widest text-romantic-muted mt-8"
      >
        Desktop Cinema Mode • Audio Synth Enabled
      </motion.p>
    </motion.div>
  );
};

