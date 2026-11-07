"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Share2, Check, RotateCcw } from "lucide-react";
import { FOREVER_WALL_ALL_IMAGES } from "@/data/romanticImages";

export const Chapter5ForeverWall: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#D4AF37", "#F8BBD0", "#FDECEF", "#E57399", "#FAFAFA"],
    });
  };

  const handleShare = () => {
    triggerConfetti();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        "Sophia & Julian • Romantic Wrapped 2025: 1,245 Days, 80 Cherished Memories, 100% Devotion!"
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="forever-wall"
      className="relative w-full min-h-screen py-28 px-6 lg:px-12 bg-gradient-to-b from-[#FFF5F7] via-[#FDECEF] to-[#FCE4EC] overflow-hidden flex items-center justify-center"
    >
      {/* 
        BACKGROUND: Dense Mosaic of ALL 80 Images 
        Rendered at low opacity (20%) with gentle hover highlight
      */}
      <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 p-3 opacity-20 pointer-events-auto overflow-hidden select-none">
        {FOREVER_WALL_ALL_IMAGES.map((img) => (
          <div
            key={img.id}
            className="relative aspect-square rounded-lg overflow-hidden bg-romantic-blush/20 filter contrast-90 hover:opacity-100 hover:scale-110 hover:z-30 transition-all duration-300"
            title={`Memory #${img.id}: ${img.caption}`}
          >
            <Image
              src={img.url}
              alt={img.caption}
              fill
              sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12vw, 8vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Radiant ambient glow behind center card */}
      <div className="absolute w-[36rem] h-[36rem] rounded-full bg-gradient-to-r from-romantic-blush/50 via-romantic-roseGold/30 to-romantic-blush/50 blur-3xl pointer-events-none -z-0" />

      {/* CENTER FOREVER CARD (Glowing Glassmorphism) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl w-full mx-auto bg-white/85 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border-2 border-romantic-roseGold/50 shadow-2xl text-center"
      >
        {/* Decorative corner brackets */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-romantic-roseGold/40 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-romantic-roseGold/40 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-romantic-roseGold/40 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-romantic-roseGold/40 rounded-br-lg pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-romantic-roseGold/15 border border-romantic-roseGold/40 text-xs font-bold text-romantic-roseGoldDark mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Chapter 05 • The Forever Wall (80 of 80 Memories)</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-romantic-charcoal leading-tight">
          To Eternity &amp; Beyond
        </h2>

        <p className="font-serif text-xl sm:text-2xl text-romantic-roseGoldDark italic mt-2">
          &ldquo;Our story doesn&apos;t end at 80 photos — it only begins.&rdquo;
        </p>

        <p className="text-sm sm:text-base text-romantic-muted max-w-lg mx-auto mt-4 leading-relaxed">
          Through every laughter-filled road trip, quiet Sunday morning, and sacred vow whispered under golden chandeliers, you remain my forever home.
        </p>

        {/* The Romantic Spotify-Style Receipt Certificate */}
        <div className="grid grid-cols-3 gap-3 my-8 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/80 border border-romantic-roseGold/20 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-romantic-roseGoldDark tracking-wider block">
              Romantic Genre
            </span>
            <p className="font-serif text-base sm:text-lg font-bold text-romantic-charcoal mt-0.5">
              Golden Hour
            </p>
            <p className="text-[10px] text-romantic-muted">Soulmate Sync</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-romantic-roseGold/20 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-romantic-roseGoldDark tracking-wider block">
              Moments Logged
            </span>
            <p className="font-serif text-base sm:text-lg font-bold text-romantic-charcoal mt-0.5">
              80 / 80
            </p>
            <p className="text-[10px] text-romantic-muted">100% Unforgettable</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-romantic-roseGold/20 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-romantic-roseGoldDark tracking-wider block">
              Love Score
            </span>
            <p className="font-serif text-base sm:text-lg font-bold text-romantic-charcoal mt-0.5">
              &infin;
            </p>
            <p className="text-[10px] text-romantic-muted">Off the charts</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-romantic-roseGold to-romantic-roseGoldLight text-romantic-charcoal font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-800" />
                <span>Love Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Romantic Wrapped</span>
              </>
            )}
          </button>

          <button
            onClick={triggerConfetti}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-romantic-blushLight border border-romantic-roseGold/40 text-romantic-charcoal font-semibold text-sm shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-romantic-roseGold" />
            <span>Celebrate with Confetti</span>
          </button>

          <button
            onClick={scrollToTop}
            aria-label="Replay from beginning"
            className="w-12 h-12 rounded-full bg-white hover:bg-stone-50 border border-romantic-roseGold/30 text-romantic-charcoal flex items-center justify-center hover:scale-105 active:scale-95 shadow-sm transition-all"
            title="Replay from start"
          >
            <RotateCcw className="w-4 h-4 text-romantic-charcoalSoft" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

