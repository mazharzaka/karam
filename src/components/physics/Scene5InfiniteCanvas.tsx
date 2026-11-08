"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useGesture } from "@use-gesture/react";
import confetti from "canvas-confetti";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Move,
  Heart,
  Share2,
  Check,
} from "lucide-react";
import { ALL_80_IMAGES } from "@/data/romanticImages";
import { romanticAudio } from "@/utils/audioSynthesizer";

interface Scene5InfiniteCanvasProps {
  onRestart?: () => void;
}

export const Scene5InfiniteCanvas: React.FC<Scene5InfiniteCanvasProps> = ({
  onRestart,
}) => {
  const targetRef = useRef<HTMLDivElement>(null);

  // 2D Pan Coordinates & Zoom Factor
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  // Bind Pan & Pinch / Wheel gestures with @use-gesture/react
  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        setPosition({ x: dx, y: dy });
      },
      onWheel: ({ event, delta: [, dy] }) => {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          setZoom((prev) => Math.min(2.5, Math.max(0.4, prev - dy * 0.002)));
        }
      },
      onPinch: ({ offset: [d] }) => {
        setZoom(Math.min(2.5, Math.max(0.4, 1 + d / 200)));
      },
    },
    {
      target: targetRef,
      drag: {
        from: () => [position.x, position.y],
        filterTaps: true,
      },
    }
  );

  const resetView = () => {
    setPosition({ x: 0, y: 0 });
    setZoom(1);
  };

  const triggerConfetti = () => {
    romanticAudio?.playDropSfx();
    confetti({
      particleCount: 120,
      spread: 85,
      origin: { y: 0.6 },
      colors: ["#D4AF37", "#F8BBD0", "#FDECEF", "#E57399", "#FAFAFA"],
    });
  };

  const handleShare = () => {
    triggerConfetti();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        "Sophia & Julian • Romantic Wrapped 2025: All 80 Moments Explored!"
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="relative w-full min-h-[750px] bg-[#1A1416] text-[#FDECEF] overflow-hidden select-none flex flex-col justify-between">
      {/* Top HUD */}
      <header className="relative z-30 px-6 lg:px-12 py-6 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-romantic-roseGold/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-romantic-roseGold/30 text-xs font-semibold text-romantic-roseGoldLight mb-1">
            <Move className="w-3.5 h-3.5 text-romantic-roseGold" />
            <span>Scene 05 • The Infinite Canvas (Images 71 — 80+)</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            The Infinite Memory Cosmos
          </h2>
        </div>

        {/* Pan & Zoom Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/10 backdrop-blur-md border border-romantic-roseGold/30 shadow-sm">
            <button
              onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
              aria-label="Zoom in"
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold px-2 text-romantic-roseGoldLight">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.max(0.4, z - 0.2))}
              aria-label="Zoom out"
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              aria-label="Reset view"
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={triggerConfetti}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-romantic-roseGold to-romantic-roseGoldLight text-romantic-charcoal font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebrate 80 Photos</span>
          </button>
        </div>
      </header>

      {/* The Draggable Pan & Zoom Interactive Canvas Stage */}
      <div
        ref={targetRef}
        className="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
      >
        <div
          className="relative transition-transform duration-75 origin-center"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
          }}
        >
          {/* CENTERPIECE: Glowing Grand Love Certificate */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-[420px] bg-white/90 backdrop-blur-2xl rounded-3xl p-8 border-2 border-romantic-roseGold/60 shadow-2xl text-center text-romantic-charcoal">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-romantic-roseGold/15 text-xs font-bold text-romantic-roseGoldDark mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>All 80 Memories Complete</span>
            </div>
            <h3 className="font-serif text-3xl font-bold text-romantic-charcoal">
              Sophia &amp; Julian
            </h3>
            <p className="font-serif text-lg text-romantic-roseGoldDark italic mt-0.5">
              Forever &amp; Always Bound
            </p>
            <p className="text-xs text-romantic-muted mt-2 leading-relaxed">
              You&apos;ve navigated through the spotlight, the film reel, the messy polaroids, the 3D tunnel, and the infinite cosmos.
            </p>

            <div className="grid grid-cols-2 gap-2 my-4">
              <div className="p-2.5 rounded-xl bg-romantic-creamy border border-romantic-roseGold/20">
                <span className="text-[10px] text-romantic-muted uppercase">Days Loved</span>
                <p className="font-serif text-lg font-bold">1,245</p>
              </div>
              <div className="p-2.5 rounded-xl bg-romantic-creamy border border-romantic-roseGold/20">
                <span className="text-[10px] text-romantic-muted uppercase">Memories</span>
                <p className="font-serif text-lg font-bold">80 / 80</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleShare}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-romantic-roseGold to-romantic-roseGoldLight text-romantic-charcoal font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Share Love Story"}</span>
              </button>

              <button
                onClick={onRestart}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-stone-50 border border-romantic-roseGold/30 text-romantic-charcoal font-semibold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
            </div>
          </div>

          {/* SPREAD OF CANVAS MEMORY CARDS (Images 71 to 80+ plus ambient halo cards) */}
          {ALL_80_IMAGES.map((img) => {
            return (
              <div
                key={img.id}
                className="absolute rounded-2xl p-3 bg-white/85 backdrop-blur-md border border-white/60 polaroid-shadow hover:scale-115 hover:z-50 hover:shadow-2xl transition-all duration-300"
                style={{
                  left: `${img.canvasX * 1.5}px`,
                  top: `${img.canvasY * 1.5}px`,
                  width: "240px",
                  transform: `rotate(${img.rotation}deg)`,
                }}
              >
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
                  <Image
                    src={img.url}
                    alt={img.caption}
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                  <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 shadow-sm">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                  </div>
                </div>

                <div className="pt-2 px-1 text-romantic-charcoal">
                  <p className="font-handwriting text-base font-bold leading-tight truncate">
                    &ldquo;{img.caption}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-romantic-muted mt-1 font-sans">
                    <span className="truncate">{img.location.split(",")[0]}</span>
                    <span className="font-bold text-romantic-roseGoldDark">
                      #{img.id}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Guidance Bar */}
      <footer className="relative z-30 px-6 py-3 bg-black/40 backdrop-blur-md border-t border-romantic-roseGold/20 flex items-center justify-between text-xs text-romantic-muted">
        <span className="flex items-center gap-1.5">
          <Move className="w-3.5 h-3.5 text-romantic-roseGold" />
          Click &amp; drag anywhere to Pan. Scroll mouse wheel or pinch to Zoom across all 80 memories.
        </span>
        <span className="font-semibold text-romantic-roseGoldLight">
          Awwwards Physics Engine Active • 80/80 Memories
        </span>
      </footer>
    </div>
  );
};

