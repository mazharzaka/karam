"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, Heart, ChevronLeft, ChevronRight, FastForward } from "lucide-react";
import { SCENE4_TUNNEL_IMAGES } from "@/data/romanticImages";
import { romanticAudio } from "@/utils/audioSynthesizer";

export const Scene4ZTunnel: React.FC = () => {
  // Flight position along the tunnel (0 to 19)
  const [tunnelProgress, setTunnelProgress] = useState<number>(0);
  const total = SCENE4_TUNNEL_IMAGES.length;

  // Keyboard navigation for tunnel flight (ArrowLeft / ArrowRight only)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setTunnelProgress((prev) => Math.min(total - 1, prev + 1));
        romanticAudio?.playGlideSfx();
      } else if (e.key === "ArrowLeft") {
        setTunnelProgress((prev) => Math.max(0, prev - 1));
        romanticAudio?.playGlideSfx();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total]);

  const activeIndex = Math.round(tunnelProgress);
  const activeImage = SCENE4_TUNNEL_IMAGES[activeIndex] || SCENE4_TUNNEL_IMAGES[0];

  return (
    <div className="relative w-full min-h-[750px] flex flex-col justify-between py-8 px-6 lg:px-12 bg-gradient-to-b from-[#1C1518] via-[#24181B] to-[#171012] text-white select-none overflow-hidden">
      {/* Radiant Vanishing Point Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] rounded-full bg-gradient-to-r from-romantic-blush/20 via-romantic-roseGold/25 to-romantic-blush/20 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 z-30">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-romantic-roseGold/40 text-xs font-semibold text-romantic-roseGoldLight mb-1">
            <Eye className="w-3.5 h-3.5 text-romantic-roseGold" />
            <span>Scene 08 • Images 51 — 70 (20 Tunnel Frames)</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            The Z-Axis Memory Tunnel
          </h2>
          <p className="font-serif text-base text-romantic-roseGoldLight italic">
            Apple-style 3D flight: Step through moments in time
          </p>
        </div>

        {/* Interactive Flight Controls */}
        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-romantic-roseGold/30 shadow-sm">
          <button
            type="button"
            onClick={() => {
              setTunnelProgress((p) => Math.max(0, p - 1));
              romanticAudio?.playGlideSfx();
            }}
            disabled={tunnelProgress <= 0}
            className="p-2 rounded-full hover:bg-white/10 text-white disabled:opacity-30 cursor-pointer transition-all"
            aria-label="Previous Frame"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono text-xs font-bold text-romantic-roseGoldLight px-2">
            {activeIndex + 1} / {total}
          </span>

          <button
            type="button"
            onClick={() => {
              setTunnelProgress((p) => Math.min(total - 1, p + 1));
              romanticAudio?.playGlideSfx();
            }}
            disabled={tunnelProgress >= total - 1}
            className="p-2 rounded-full hover:bg-white/10 text-white disabled:opacity-30 cursor-pointer transition-all"
            aria-label="Next Frame"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Flying Viewport Stage */}
      <div
        className="relative flex-1 w-full max-w-4xl mx-auto flex items-center justify-center overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        {SCENE4_TUNNEL_IMAGES.map((img, index) => {
          // Distance from the current flight camera
          const distance = index - tunnelProgress;

          // Render only photos near the camera view (-2 to +5)
          if (distance < -2.2 || distance > 6) return null;

          // Calculate scale and z depth
          // distance = 0 means right in front of camera
          // distance > 0 means deeper into the distance
          // distance < 0 means flying behind the camera
          const scale =
            distance >= 0
              ? Math.max(0.08, 1 - distance * 0.18)
              : 1 + Math.abs(distance) * 1.4;

          const opacity =
            distance > 4
              ? Math.max(0, 1 - (distance - 4) * 0.5)
              : distance < -0.8
              ? Math.max(0, 1 - Math.abs(distance + 0.8) * 1.5)
              : 1;

          const zIndex = Math.round(100 - distance * 10);
          const isFocal = Math.abs(distance) < 0.4;

          return (
            <motion.div
              key={img.id}
              className={`absolute rounded-3xl p-4 bg-white/90 backdrop-blur-xl border-2 border-white shadow-2xl transition-all duration-200 pointer-events-none ${
                isFocal ? "ring-4 ring-romantic-roseGold/60 shadow-glow" : ""
              }`}
              style={{
                width: "360px",
                transform: `scale(${scale}) translateY(${distance * 12}px)`,
                opacity,
                zIndex,
              }}
            >
              {/* Photo */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-inner">
                <Image
                  src={img.url}
                  alt={img.caption}
                  fill
                  sizes="360px"
                  className="object-cover"
                />
                <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-md">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                </div>
              </div>

              {/* Caption */}
              <div className="pt-3 px-1 text-center text-romantic-charcoal">
                <span className="text-[10px] uppercase font-bold tracking-wider text-romantic-roseGoldDark">
                  Flight Memory #{img.id}
                </span>
                <p className="font-serif text-lg font-bold truncate mt-0.5">
                  {img.caption}
                </p>
                <p className="text-[11px] text-romantic-muted">
                  {img.location} • {img.date}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Flight HUD Scrub Controller at Bottom */}
      <div className="max-w-xl mx-auto w-full flex flex-col items-center gap-2 z-30 pt-2">
        <div className="w-full flex items-center justify-between text-xs text-romantic-roseGoldLight">
          <span className="flex items-center gap-1.5">
            <FastForward className="w-3.5 h-3.5" />
            Flight Progress: Memory {activeIndex + 1} of {total}
          </span>
          <span className="font-mono text-xs font-bold text-white">
            {activeImage.location.split(",")[0]}
          </span>
        </div>

        {/* Interactive Scrub Bar */}
        <input
          type="range"
          min="0"
          max={total - 1}
          step="0.05"
          value={tunnelProgress}
          onChange={(e) => setTunnelProgress(parseFloat(e.target.value))}
          className="w-full accent-romantic-roseGold cursor-pointer h-2 bg-white/20 rounded-lg appearance-none"
        />

        <p className="text-[11px] text-stone-400">
          Scroll mouse wheel or drag slider to fly seamlessly through time
        </p>
      </div>
    </div>
  );
};

