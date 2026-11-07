"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowDown, Eye } from "lucide-react";
import { SCENE1_SPOTLIGHT_IMAGES } from "@/data/romanticImages";

interface Scene1HeroSpotlightProps {
  onNext?: () => void;
}

export const Scene1HeroSpotlight: React.FC<Scene1HeroSpotlightProps> = ({ onNext }) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 400,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const hiddenImage = SCENE1_SPOTLIGHT_IMAGES[0];
  const accentImage = SCENE1_SPOTLIGHT_IMAGES[1];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full h-full flex flex-col justify-between items-center py-12 px-6 bg-[#24181B] text-[#FDECEF] overflow-hidden select-none"
    >
      {/* 
        HIDDEN BACKGROUND IMAGE: 
        Revealed strictly inside the mouse spotlight mask 
      */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          maskImage: `radial-gradient(circle 260px at ${mousePos.x}px ${mousePos.y}px, black 25%, rgba(0,0,0,0.5) 50%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(circle 260px at ${mousePos.x}px ${mousePos.y}px, black 25%, rgba(0,0,0,0.5) 50%, transparent 80%)`,
        }}
      >
        <Image
          src={hiddenImage.url}
          alt={hiddenImage.caption}
          fill
          priority
          className="object-cover filter brightness-110 contrast-105 scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#24181B]/80 via-transparent to-[#24181B]/40" />

        {/* Floating Spotlight Label */}
        <div
          className="absolute z-20 pointer-events-none transition-transform duration-75"
          style={{
            left: `${mousePos.x + 30}px`,
            top: `${mousePos.y - 40}px`,
          }}
        >
          <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-romantic-roseGold/60 text-[11px] text-romantic-roseGoldLight font-serif shadow-lg whitespace-nowrap flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-romantic-roseGold" />
            <span>{hiddenImage.caption}</span>
          </div>
        </div>
      </div>

      {/* Spotlight Cursor Ring Highlight */}
      <div
        className="absolute pointer-events-none rounded-full border border-romantic-roseGold/40 shadow-glow transition-transform duration-75 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          width: "360px",
          height: "360px",
        }}
      />

      {/* Top Editorial Monogram */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-romantic-roseGold/35 shadow-sm text-xs font-semibold text-romantic-roseGoldLight tracking-wider"
      >
        <Sparkles className="w-3.5 h-3.5 text-romantic-roseGold" />
        <span>Scene 01 • The Hero Spotlight (Images 01 &amp; 02)</span>
      </motion.div>

      {/* Main Massive Gold Numbers Typography */}
      <div className="relative z-20 flex flex-col items-center my-auto text-center max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-2xl sm:text-3xl text-romantic-blushLight font-light italic"
        >
          In a world of billions, our time belongs together...
        </motion.p>

        {/* Massive Screen-Filling Typography */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative py-2 my-1"
        >
          <h1 className="font-serif text-8xl sm:text-9xl md:text-[13rem] font-bold tracking-tight text-white leading-none drop-shadow-2xl">
            <span className="text-gold-shimmer">1,245</span>
          </h1>

          <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-wide text-romantic-roseGoldLight mt-1">
            Days of Sacred Love
          </p>
        </motion.div>

        {/* Two Mini Thumbnail Floating Cards */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex items-center gap-4 mt-6 p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-romantic-roseGold/20"
        >
          <div className="flex items-center gap-3 px-3 py-1.5">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-romantic-roseGold/40 shrink-0">
              <Image src={accentImage.url} alt="Memory 2" fill className="object-cover" />
            </div>
            <div className="text-left text-xs">
              <p className="font-serif font-bold text-white">Interactive Spotlight Active</p>
              <p className="text-[10px] text-romantic-blush font-light">
                Hover anywhere on screen to illuminate hidden memories
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Hint */}
      <motion.button
        onClick={onNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-20 flex flex-col items-center gap-1 group text-romantic-blush hover:text-white transition-colors cursor-pointer"
      >
        <span className="text-xs font-medium tracking-widest uppercase">
          Proceed to Scene 02: The Draggable Filmstrip
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4 text-romantic-roseGold" />
        </motion.div>
      </motion.button>
    </div>
  );
};

