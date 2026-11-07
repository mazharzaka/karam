"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { romanticAudio } from "@/utils/audioSynthesizer";

interface StoryHeaderProps {
  partner1: string;
  partner2: string;
  year?: string;
}

export const StoryHeader: React.FC<StoryHeaderProps> = ({
  partner1,
  partner2,
  year = "2025",
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const toggleSound = () => {
    if (romanticAudio) {
      const active = romanticAudio.toggle();
      setIsPlaying(active);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <header className="absolute top-8 left-0 right-0 z-40 px-4 sm:px-6 w-full max-w-lg mx-auto flex items-center justify-between text-romantic-charcoal">
      {/* Brand / Couple Tag */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-romantic-creamy/90 backdrop-blur-md border border-romantic-roseGold/30 flex items-center justify-center shadow-sm">
          <Heart className="w-4 h-4 text-romantic-blushDeep fill-romantic-blushDeep" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-sm font-semibold tracking-wide">
              {partner1} &amp; {partner2}
            </span>
            <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-romantic-roseGold/15 text-romantic-roseGoldDark font-medium">
              {year}
            </span>
          </div>
          <span className="text-[11px] text-romantic-muted flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-romantic-roseGold" /> Our Romantic Wrapped
          </span>
        </div>
      </div>

      {/* Romantic Music Player Pill */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSound}
          aria-label={isPlaying ? "Mute romantic soundtrack" : "Play romantic soundtrack"}
          className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-romantic-creamy/90 backdrop-blur-md border border-romantic-roseGold/30 shadow-sm hover:border-romantic-roseGold/50 transition-all text-xs font-medium text-romantic-charcoalSoft group"
        >
          {/* Animated sound equalizer bars */}
          <div className="flex items-end gap-0.5 h-3.5 w-3">
            {[40, 90, 60].map((h, i) => (
              <motion.span
                key={i}
                className="w-0.5 bg-romantic-roseGold rounded-full"
                animate={
                  isPlaying
                    ? {
                        height: [`${h * 0.4}%`, `${h}%`, `${h * 0.3}%`],
                      }
                    : { height: "20%" }
                }
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <span className="text-[11px] text-romantic-charcoalSoft font-normal">
            {isPlaying ? "Music On" : "Play Soundtrack"}
          </span>

          {isPlaying ? (
            <Volume2 className="w-3.5 h-3.5 text-romantic-roseGoldDark group-hover:scale-110 transition-transform" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-romantic-muted" />
          )}
        </button>
      </div>
    </header>
  );
};

