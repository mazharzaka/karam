"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, ArrowRight, Heart } from "lucide-react";
import { TIMELINE_IMAGES } from "@/data/cinematicData";

interface Scene2TimelineProps {
  revealedCount: number; // 1 to 6
  onNext?: () => void;
  onPrev?: () => void;
}

export const Scene2Timeline: React.FC<Scene2TimelineProps> = ({
  revealedCount,
  onNext,
}) => {
  const visibleImages = TIMELINE_IMAGES.slice(0, Math.max(1, revealedCount));
  const isFinished = revealedCount >= TIMELINE_IMAGES.length;

  return (
    <motion.div
      key="scene-2-timeline"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50, transition: { duration: 0.6 } }}
      className="relative w-full h-full flex flex-col justify-between py-8 px-6 lg:px-12 select-none overflow-hidden"
    >
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-romantic-roseGold/30 text-xs font-semibold text-romantic-charcoal mb-1">
            <Sparkles className="w-3.5 h-3.5 text-romantic-roseGold" />
            <span>Scene 02 • Sequential Timeline Gallery</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-romantic-charcoal">
            The Moments That Defined Us
          </h2>
          <p className="font-serif text-base text-romantic-roseGoldDark italic">
            لحظاتٌ صنعت حكايتنا، تتكشف واحدة تلو الأخرى
          </p>
        </div>

        {/* Dynamic Counter Pill */}
        <div className="text-right">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-romantic-roseGold/30 shadow-sm text-xs font-bold text-romantic-charcoal">
            <span className="text-romantic-roseGoldDark">
              {visibleImages.length}
            </span>
            <span className="text-romantic-muted">/ {TIMELINE_IMAGES.length} Memories</span>
          </div>
          <p className="text-[11px] text-romantic-muted mt-1">
            {isFinished
              ? "All revealed • Press Arrow for Scene 03"
              : "Press Right / Down Arrow to reveal next (اضغط التالي)"}
          </p>
        </div>
      </div>

      {/* Horizontal Sequential Gallery Viewport */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto flex items-center overflow-x-auto no-scrollbar py-6">
        <div className="flex items-center gap-6 min-w-full justify-start sm:justify-center px-4">
          <AnimatePresence>
            {visibleImages.map((item, index) => {
              const isLatest = index === visibleImages.length - 1;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -120, scale: 0.85, rotate: -4 }}
                  animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 24,
                    mass: 0.9,
                  }}
                  className={`shrink-0 w-[280px] sm:w-[320px] rounded-3xl p-4 bg-white/85 backdrop-blur-xl border border-romantic-roseGold/30 shadow-polaroid hover:shadow-polaroid-hover transition-all duration-300 ${
                    isLatest
                      ? "ring-2 ring-romantic-roseGold shadow-glow scale-[1.02]"
                      : "opacity-90"
                  }`}
                >
                  {/* Photo frame */}
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-romantic-blush/20 shadow-inner group">
                    <Image
                      src={item.url}
                      alt={item.titleEn}
                      fill
                      sizes="320px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                    />

                    {/* Step badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-romantic-charcoal uppercase tracking-wider shadow-sm">
                      Chapter 0{item.id}
                    </div>

                    <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm">
                      <Heart className="w-3.5 h-3.5 text-romantic-blushDeep fill-romantic-blushDeep" />
                    </div>

                    {/* Bottom gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75" />

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="font-serif text-lg font-bold leading-tight">
                        {item.titleEn}
                      </p>
                      <p className="text-xs text-romantic-roseGoldLight font-serif">
                        {item.titleAr}
                      </p>
                    </div>
                  </div>

                  {/* Card Editorial Footer */}
                  <div className="pt-3 px-1 text-left">
                    <p className="text-xs text-romantic-charcoalSoft font-medium leading-relaxed truncate">
                      {item.captionEn}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-romantic-muted mt-2 pt-2 border-t border-romantic-charcoal/10">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-romantic-roseGold shrink-0" />
                        <span className="truncate">{item.location.split(",")[0]}</span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-romantic-roseGoldDark shrink-0">
                        <Calendar className="w-3 h-3" /> {item.date.split(",")[0]}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Guidance Navigation Hint */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs text-romantic-muted pt-2 border-t border-romantic-roseGold/20">
        <span className="hidden sm:inline">
          Use Keyboard Arrow &rarr; or Scroll to reveal memories side-by-side
        </span>

        <button
          onClick={onNext}
          className="ml-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 hover:bg-white border border-romantic-roseGold/30 text-romantic-charcoal font-semibold shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>
            {isFinished ? "Proceed to Scene 03 (Scattered Desk)" : "Reveal Next Memory"}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-romantic-roseGold" />
        </button>
      </div>
    </motion.div>
  );
};

