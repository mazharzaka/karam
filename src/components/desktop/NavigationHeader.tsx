"use client";

import React, { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Heart, Volume2, VolumeX, Sparkles } from "lucide-react";
import { romanticAudio } from "@/utils/audioSynthesizer";

const CHAPTERS = [
  { id: "hero", label: "01 The Numbers" },
  { id: "adventures", label: "02 Adventures Parallax" },
  { id: "desk", label: "03 Scattered Desk" },
  { id: "big-day", label: "04 The Big Day" },
  { id: "forever-wall", label: "05 The Forever Wall" },
];

export const NavigationHeader: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const toggleSound = () => {
    if (romanticAudio) {
      const active = romanticAudio.toggle();
      setIsPlaying(active);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-xl border-b border-romantic-roseGold/25 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Monogram */}
        <div
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-romantic-roseGoldLight to-romantic-roseGold flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-tight text-romantic-charcoal">
                Sophia &amp; Julian
              </span>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-romantic-roseGold/20 text-romantic-roseGoldDark font-semibold">
                Wrapped 2025
              </span>
            </div>
            <p className="text-[11px] text-romantic-muted flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-romantic-roseGold" /> 80 Curated Memories
            </p>
          </div>
        </div>

        {/* Chapter Jump Links for Desktop */}
        <nav className="hidden lg:flex items-center gap-1 bg-romantic-charcoal/5 p-1 rounded-full border border-romantic-roseGold/15">
          {CHAPTERS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => scrollTo(ch.id)}
              className="px-4 py-1.5 rounded-full text-xs font-medium text-romantic-charcoalSoft hover:text-romantic-charcoal hover:bg-white/80 transition-all focus:outline-none"
            >
              {ch.label}
            </button>
          ))}
        </nav>

        {/* Soundtrack Audio Control */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            aria-label={isPlaying ? "Mute soundtrack" : "Play romantic soundtrack"}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white border border-romantic-roseGold/35 shadow-sm hover:shadow transition-all group"
          >
            {/* Visualizer bars */}
            <div className="flex items-end gap-0.5 h-4 w-3.5">
              {[40, 95, 65].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-0.5 bg-romantic-roseGold rounded-full"
                  animate={
                    isPlaying
                      ? { height: [`${h * 0.3}%`, `${h}%`, `${h * 0.2}%`] }
                      : { height: "25%" }
                  }
                  transition={{
                    repeat: Infinity,
                    duration: 0.8 + i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <span className="text-xs font-semibold text-romantic-charcoal tracking-wide">
              {isPlaying ? "Waltz Playing" : "Play Music"}
            </span>

            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-romantic-roseGoldDark group-hover:scale-110 transition-transform" />
            ) : (
              <VolumeX className="w-4 h-4 text-romantic-muted" />
            )}
          </button>
        </div>
      </div>

      {/* Real-time Global Scroll Progress Bar */}
      <motion.div
        className="h-[2px] bg-gradient-to-r from-romantic-roseGold to-romantic-roseGoldDark origin-left"
        style={{ scaleX }}
      />
    </header>
  );
};

