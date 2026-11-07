"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Trophy, Heart, Sparkles, Calendar, ChevronRight } from "lucide-react";
import { Milestone } from "@/types/wrapped";

interface TopMomentsSectionProps {
  milestones: Milestone[];
  isActive: boolean;
  onNext?: () => void;
}

export const TopMomentsSection: React.FC<TopMomentsSectionProps> = ({
  milestones,
  isActive,
  onNext,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    milestones[0] || null
  );

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.25,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 35 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col justify-between py-4 text-romantic-charcoal select-none">
      {/* Header title mimicking Spotify Wrapped Top Artists */}
      <div className="text-left w-full pt-1 pb-2">
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 mb-1"
        >
          <div className="p-1 rounded-md bg-romantic-roseGold/20 text-romantic-roseGoldDark">
            <Trophy className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs uppercase tracking-widest font-semibold text-romantic-muted">
            The Greatest Hits of Us
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-romantic-charcoal"
        >
          Your Top 5 Milestones
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xs text-romantic-muted mt-0.5"
        >
          Out of thousands of moments, these five stole our breath away.
        </motion.p>
      </div>

      {/* The Spotify Wrapped Top 5 List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isActive ? "show" : "hidden"}
        className="flex-1 flex flex-col justify-center gap-2.5 my-1"
      >
        {milestones.slice(0, 5).map((item) => {
          const isTopOne = item.rank === 1;
          const isSelected = selectedMilestone?.id === item.id;

          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.015, x: 2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => setSelectedMilestone(item)}
              className={`relative flex items-center gap-3 p-2.5 rounded-2xl transition-all cursor-pointer ${
                isTopOne
                  ? "bg-gradient-to-r from-white/95 to-romantic-blushLight/80 border-2 border-romantic-roseGold/60 shadow-md"
                  : isSelected
                  ? "bg-white/90 border border-romantic-roseGold/40 shadow-sm"
                  : "bg-white/60 hover:bg-white/80 border border-romantic-roseGold/15"
              }`}
            >
              {/* Rank Number Badge */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-serif text-sm font-bold shrink-0 ${
                  isTopOne
                    ? "bg-gradient-to-br from-romantic-roseGoldLight to-romantic-roseGold text-romantic-charcoal shadow-sm ring-2 ring-romantic-roseGold/30"
                    : "bg-romantic-charcoal/5 text-romantic-charcoalSoft"
                }`}
              >
                {item.rank}
              </div>

              {/* Album Art / Milestone Thumbnail */}
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 border border-romantic-roseGold/30 shadow-inner bg-romantic-blush/20">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
                {isTopOne && (
                  <div className="absolute top-0 right-0 p-0.5 bg-romantic-roseGold rounded-bl-md">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <h3
                    className={`font-serif text-sm sm:text-base font-bold truncate ${
                      isTopOne ? "text-romantic-charcoal" : "text-romantic-charcoalSoft"
                    }`}
                  >
                    {item.title}
                  </h3>
                  {isTopOne && (
                    <span className="text-[9px] bg-romantic-roseGold/20 text-romantic-roseGoldDark px-1.5 py-0.2 rounded-full font-semibold shrink-0">
                      Top 1
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-romantic-muted truncate flex items-center gap-1 mt-0.5">
                  <span>{item.subtitle}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Calendar className="w-2.5 h-2.5 text-romantic-roseGold" /> {item.date}
                  </span>
                </p>
              </div>

              {/* Heart count / Spotify stream equivalent */}
              <div className="text-right shrink-0 pr-1 flex flex-col items-end">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-romantic-blushDeep">
                  <Heart className="w-3 h-3 fill-romantic-blushDeep" />
                  <span>{item.heartCount}</span>
                </div>
                <span className="text-[9px] text-romantic-muted uppercase tracking-wider">
                  Butterflies
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Selected Item Quote / Highlight preview */}
      {selectedMilestone && (
        <motion.div
          key={selectedMilestone.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2.5 rounded-xl bg-romantic-creamy/90 backdrop-blur-sm border border-romantic-roseGold/30 text-xs text-romantic-charcoalSoft shadow-sm flex items-center justify-between mt-1"
        >
          <div className="flex items-center gap-2">
            <span className="text-romantic-roseGold text-base font-serif">“</span>
            <p className="italic text-[11px] font-serif text-romantic-charcoal">
              {selectedMilestone.highlightText}
            </p>
          </div>
          <button
            onClick={onNext}
            className="text-[10px] uppercase tracking-wider font-semibold text-romantic-roseGoldDark hover:underline flex items-center shrink-0 ml-2"
          >
            Photos <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

