"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Camera, RotateCcw, ArrowRight, Heart } from "lucide-react";
import { DESK_POLAROIDS } from "@/data/cinematicData";

interface Scene3DeskProps {
  droppedCount: number; // 0 to 12
  onNext?: () => void;
  onDropNext?: () => void;
}

export const Scene3Desk: React.FC<Scene3DeskProps> = ({
  droppedCount,
  onNext,
  onDropNext,
}) => {
  const deskRef = useRef<HTMLDivElement>(null);

  // Active polaroids currently dropped on the virtual desk
  const droppedPolaroids = DESK_POLAROIDS.slice(0, droppedCount);
  const totalToDrop = DESK_POLAROIDS.length;
  const isAllDropped = droppedCount >= totalToDrop;

  return (
    <motion.div
      key="scene-3-desk"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.6 } }}
      className="relative w-full h-full flex flex-col justify-between py-6 px-6 lg:px-12 select-none overflow-hidden"
    >
      {/* Linen Desk Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay bg-[radial-gradient(#33272A_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Bar Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-30">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/85 backdrop-blur-md border border-romantic-roseGold/30 text-xs font-semibold text-romantic-charcoal mb-1">
            <Camera className="w-3.5 h-3.5 text-romantic-roseGold" />
            <span>Scene 03 • The Dynamic Polaroid Desk</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-romantic-charcoal">
            Our Scattered Memories Table
          </h2>
          <p className="font-serif text-base text-romantic-roseGoldDark italic">
            كل ضغطة تُسقط ذكرى جديدة بحركة فيزيائية واقعية
          </p>
        </div>

        {/* Dynamic Dropped Status & Advance Button */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white/85 backdrop-blur-md border border-romantic-roseGold/35 shadow-sm text-right">
            <div className="text-xs font-bold text-romantic-charcoal flex items-center gap-1.5">
              <span className="text-romantic-roseGoldDark font-serif text-base">
                {droppedCount}
              </span>
              <span>/ {totalToDrop} Dropped</span>
            </div>
            <p className="text-[10px] text-romantic-muted">
              {isAllDropped ? "All memories landed" : "Press Arrow to drop another"}
            </p>
          </div>

          <button
            onClick={isAllDropped ? onNext : onDropNext}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-romantic-roseGold to-romantic-roseGoldLight text-romantic-charcoal font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isAllDropped ? "Finale Certificate" : "Drop Next Polaroid"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The Virtual Canvas / Desk Area */}
      <div
        ref={deskRef}
        className="relative flex-1 w-full max-w-7xl mx-auto my-4 rounded-3xl bg-white/30 backdrop-blur-sm border-2 border-dashed border-romantic-roseGold/25 overflow-hidden flex items-center justify-center"
      >
        {/* Subtle desk guidelines / instructions */}
        {droppedCount === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 bg-white/70 backdrop-blur-md rounded-3xl border border-romantic-roseGold/30 max-w-md shadow-sm"
          >
            <Sparkles className="w-8 h-8 text-romantic-roseGold mx-auto mb-2 animate-bounce" />
            <h3 className="font-serif text-2xl font-bold text-romantic-charcoal">
              The Desk Is Ready
            </h3>
            <p className="text-xs text-romantic-muted mt-2">
              Press the <kbd className="px-2 py-0.5 rounded bg-white font-mono text-romantic-charcoal border">Right &rarr;</kbd> or <kbd className="px-2 py-0.5 rounded bg-white font-mono text-romantic-charcoal border">Down &darr;</kbd> arrow to drop your first polaroid onto the table.
            </p>
            <p className="text-xs text-romantic-roseGoldDark font-serif mt-1">
              (اضغط السهم لإنزال الصور واحدة تلو الأخرى)
            </p>
          </motion.div>
        )}

        {/* The Animated Dropping Polaroids */}
        <AnimatePresence>
          {droppedPolaroids.map((photo, index) => {
            return (
              <motion.div
                key={photo.id}
                drag
                dragConstraints={deskRef}
                dragElastic={0.3}
                initial={{
                  y: -800,
                  x: photo.dropX * 12,
                  rotate: photo.rotation * 3,
                  scale: 0.6,
                  opacity: 0,
                }}
                animate={{
                  y: photo.dropY * 6,
                  x: photo.dropX * 10,
                  rotate: photo.rotation,
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 14,
                  mass: 1.1,
                }}
                whileHover={{
                  scale: 1.22,
                  rotate: 0,
                  zIndex: 999,
                  transition: { duration: 0.2 },
                }}
                className="absolute w-[210px] sm:w-[240px] bg-romantic-polaroid rounded-xl p-3 pb-5 polaroid-shadow border-2 border-white cursor-grab active:cursor-grabbing hover:shadow-polaroid-hover transition-shadow"
                style={{
                  zIndex: index + 10,
                }}
              >
                {/* Washi tape accent on top edge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-100/90 backdrop-blur-sm border border-amber-200/50 -rotate-2 rounded-sm shadow-sm pointer-events-none" />

                {/* Photo frame */}
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 shadow-inner">
                  <Image
                    src={photo.url}
                    alt={photo.titleEn}
                    fill
                    sizes="240px"
                    className="object-cover pointer-events-none select-none"
                  />
                  <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 shadow-sm">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                  </div>
                </div>

                {/* Handwritten note */}
                <div className="pt-2 px-1 text-center">
                  <p className="font-handwriting text-lg text-romantic-charcoal font-semibold leading-tight truncate">
                    &ldquo;{photo.titleEn}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-romantic-muted mt-1 font-sans">
                    <span className="truncate">{photo.location.split(",")[0]}</span>
                    <span className="font-bold text-romantic-roseGoldDark">
                      #{photo.id}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Bottom Hint */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs text-romantic-muted pt-1 z-30">
        <span className="flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5 text-romantic-roseGold" />
          Polaroids are interactive: Click and drag them anywhere on the desk to build your collage.
        </span>
        <span className="font-medium text-romantic-charcoal">
          Scene 03 of 04
        </span>
      </div>
    </motion.div>
  );
};

