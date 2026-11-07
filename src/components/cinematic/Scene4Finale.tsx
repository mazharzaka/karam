"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Share2, Check, RotateCcw } from "lucide-react";

interface Scene4FinaleProps {
  onReplay: () => void;
}

export const Scene4Finale: React.FC<Scene4FinaleProps> = ({ onReplay }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const fireConfetti = () => {
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.62 },
      colors: ["#D4AF37", "#F8BBD0", "#FDECEF", "#E57399", "#FAFAFA"],
    });
  };

  useEffect(() => {
    // Automatic celebration blast upon entering the finale
    const timer = setTimeout(() => {
      fireConfetti();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    fireConfetti();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        "Sophia & Julian — Our Cinematic Romantic Wrapped 2025: 1,245 Days of Love!"
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <motion.div
      key="scene-4-finale"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.6 } }}
      className="relative w-full h-full max-w-4xl mx-auto flex flex-col items-center justify-center p-6 text-center select-none"
    >
      {/* Ambient Glow */}
      <div className="absolute w-[34rem] h-[34rem] rounded-full bg-gradient-to-tr from-romantic-blush/50 via-romantic-roseGold/30 to-romantic-blush/40 blur-3xl pointer-events-none -z-10" />

      {/* Centerpiece Glassmorphism Love Certificate */}
      <div className="relative w-full bg-white/85 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border-2 border-romantic-roseGold/50 shadow-2xl">
        {/* Decorative corner florets */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-romantic-roseGold/40 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-romantic-roseGold/40 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-romantic-roseGold/40 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-romantic-roseGold/40 rounded-br-lg pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-romantic-roseGold/15 border border-romantic-roseGold/40 text-xs font-bold text-romantic-roseGoldDark mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Scene 04 • The Love Certificate • Finale</span>
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-romantic-charcoal leading-tight">
          Sophia &amp; Julian
        </h2>

        <p className="font-serif text-2xl text-romantic-roseGoldDark italic mt-1">
          عهدٌ أبدي لا ينتهي
        </p>

        {/* Persona Pill */}
        <div className="my-6 p-4 rounded-2xl bg-white/80 border border-romantic-roseGold/30 max-w-md mx-auto shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-widest text-romantic-roseGoldDark block">
            Your 2025 Romantic Persona
          </span>
          <p className="font-serif text-xl font-bold text-romantic-charcoal mt-1">
            Golden Hour Soulmates
          </p>
          <p className="text-xs text-romantic-muted mt-1 leading-relaxed">
            Your love energy resonated at 100% devotion with zero skipped tracks. Spanning 1,245 days and endless joy.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-8">
          <div className="p-3 rounded-2xl bg-white/70 border border-romantic-roseGold/20">
            <span className="text-[10px] text-romantic-muted uppercase tracking-wider block">
              Days Loved
            </span>
            <p className="font-serif text-xl font-bold text-romantic-charcoal mt-0.5">
              1,245
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 border border-romantic-roseGold/20">
            <span className="text-[10px] text-romantic-muted uppercase tracking-wider block">
              Memories Logged
            </span>
            <p className="font-serif text-xl font-bold text-romantic-charcoal mt-0.5">
              30 / 30
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/70 border border-romantic-roseGold/20">
            <span className="text-[10px] text-romantic-muted uppercase tracking-wider block">
              Forever Score
            </span>
            <p className="font-serif text-xl font-bold text-romantic-charcoal mt-0.5">
              &infin;
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-romantic-roseGold to-romantic-roseGoldLight text-romantic-charcoal font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-800" />
                <span>Love Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Our Film Card</span>
              </>
            )}
          </button>

          <button
            onClick={fireConfetti}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-romantic-blushLight border border-romantic-roseGold/40 text-romantic-charcoal font-semibold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-romantic-roseGold" />
            <span>Shower Confetti</span>
          </button>

          <button
            onClick={onReplay}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-stone-50 border border-romantic-roseGold/30 text-romantic-charcoal font-semibold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-romantic-charcoalSoft" />
            <span>Replay Film (إعادة الرحلة)</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

