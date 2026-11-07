"use client";

import React from "react";
import { motion } from "framer-motion";

interface StoryProgressProps {
  total: number;
  currentIndex: number;
  durationMs?: number;
  isPaused?: boolean;
  onSelectStory?: (index: number) => void;
}

export const StoryProgress: React.FC<StoryProgressProps> = ({
  total,
  currentIndex,
  onSelectStory,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-6 w-full max-w-lg mx-auto pointer-events-auto">
      <div className="flex items-center gap-1.5 sm:gap-2">
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <button
              key={index}
              onClick={() => onSelectStory?.(index)}
              className="relative flex-1 h-1 sm:h-1.5 rounded-full overflow-hidden bg-romantic-charcoal/15 backdrop-blur-sm transition-all duration-200 hover:h-2 group focus:outline-none focus:ring-1 focus:ring-romantic-roseGold"
              aria-label={`Jump to story slide ${index + 1}`}
            >
              {/* Completed bar */}
              {isCompleted && (
                <div className="w-full h-full bg-romantic-roseGold shadow-sm" />
              )}

              {/* Active animated progress bar */}
              {isActive && (
                <motion.div
                  className="h-full bg-gradient-to-r from-romantic-roseGold to-romantic-roseGoldLight rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 8,
                    ease: "linear",
                  }}
                />
              )}

              {/* Hover indicator for inactive bars */}
              {!isCompleted && !isActive && (
                <div className="w-full h-full opacity-0 group-hover:opacity-40 bg-romantic-roseGold transition-opacity duration-150" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

