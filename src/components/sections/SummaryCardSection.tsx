"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Heart,
  Share2,
  RotateCcw,
  Sparkles,
  Music,
  Check,
  Disc,
} from "lucide-react";
import { LoveStats } from "@/types/wrapped";

interface SummaryCardSectionProps {
  stats: LoveStats;
  isActive: boolean;
  onReplay?: () => void;
}

export const SummaryCardSection: React.FC<SummaryCardSectionProps> = ({
  stats,
  isActive,
  onReplay,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const triggerConfetti = () => {
    // Elegant wedding confetti blast: rose gold, blush pink, and creamy white
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#D4AF37", "#F8BBD0", "#FDECEF", "#E57399", "#FAFAFA"],
    });
  };

  const handleShare = () => {
    triggerConfetti();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `Sophia & Julian - Our Romantic Wrapped 2025: ${stats.daysTogether} Days of Love, Top Vibe: ${stats.loveVibeTitle}!`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div
      data-active={isActive}
      className="w-full h-full flex flex-col justify-between py-2 text-romantic-charcoal select-none"
    >
      {/* Title */}
      <div className="text-center w-full pt-1">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-romantic-roseGold/15 border border-romantic-roseGold/40 text-xs font-semibold text-romantic-roseGoldDark mb-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Love Certificate</span>
        </motion.div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-romantic-charcoal">
          Our 2025 Love Wrapped
        </h2>
      </div>

      {/* The Spotify Wrapped Share Card */}
      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative w-full max-w-xs sm:max-w-sm mx-auto bg-gradient-to-b from-[#FFFDF9] via-[#FFF5F7] to-[#FCE4EC] rounded-3xl p-4 sm:p-5 border-2 border-romantic-roseGold/40 shadow-xl overflow-hidden my-auto"
      >
        {/* Subtle decorative border corner florets */}
        <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-romantic-roseGold/30 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-romantic-roseGold/30 rounded-bl-xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-romantic-roseGold/20 pb-3 mb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-romantic-charcoal">
              {stats.partnerNames.partner1} &amp; {stats.partnerNames.partner2}
            </h3>
            <p className="text-[10px] text-romantic-muted uppercase tracking-wider">
              Forever Bound • 2025 Edition
            </p>
          </div>
          <div className="p-2 rounded-full bg-romantic-roseGold/10 border border-romantic-roseGold/30">
            <Heart className="w-4 h-4 text-romantic-blushDeep fill-romantic-blushDeep" />
          </div>
        </div>

        {/* Highlight Persona / Vibe */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-romantic-roseGold/20 shadow-sm mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-romantic-roseGoldDark">
            Your Romantic Persona
          </span>
          <h4 className="font-serif text-base sm:text-lg font-bold text-romantic-charcoal leading-tight mt-0.5">
            {stats.loveVibeTitle}
          </h4>
          <p className="text-[11px] text-romantic-muted leading-relaxed mt-1">
            {stats.loveVibeDescription}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white/60 rounded-xl p-2.5 border border-romantic-roseGold/15">
            <span className="text-[10px] text-romantic-muted uppercase">Days Together</span>
            <p className="font-serif text-xl font-bold text-romantic-charcoal">
              {stats.daysTogether.toLocaleString()}
            </p>
          </div>

          <div className="bg-white/60 rounded-xl p-2.5 border border-romantic-roseGold/15">
            <span className="text-[10px] text-romantic-muted uppercase">Memories Kept</span>
            <p className="font-serif text-xl font-bold text-romantic-charcoal">
              {stats.totalMemoriesLogged}+
            </p>
          </div>
        </div>

        {/* Top Sound / Love Anthem */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-romantic-creamy/90 border border-romantic-roseGold/20">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0">
            <Image
              src={stats.topAudioTrack.coverUrl}
              alt="Track cover"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Disc className="w-4 h-4 text-white animate-spin" style={{ animationDuration: "6s" }} />
            </div>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-romantic-roseGoldDark">
              <Music className="w-3 h-3" /> Top First Dance Anthem
            </div>
            <p className="text-xs font-semibold text-romantic-charcoal truncate">
              {stats.topAudioTrack.title}
            </p>
            <p className="text-[10px] text-romantic-muted truncate">
              {stats.topAudioTrack.artist}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-2 pt-1 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-romantic-roseGold to-romantic-roseGoldLight text-romantic-charcoal font-bold text-xs shadow-md border border-romantic-roseGoldDark/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-700" />
                <span>Link Copied! ✨</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Our Love Story</span>
              </>
            )}
          </button>

          <button
            onClick={onReplay}
            aria-label="Replay love wrapped"
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-romantic-charcoal shadow-sm border border-romantic-roseGold/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4 text-romantic-charcoalSoft" />
          </button>
        </div>

        <button
          onClick={triggerConfetti}
          className="text-[11px] font-medium text-romantic-roseGoldDark hover:underline flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" /> Shower with Rose Petals &amp; Gold
        </button>
      </div>
    </div>
  );
};

