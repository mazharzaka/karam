"use client";

import React, { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Heart,
  Shuffle,
  Layers,
  Sparkles,
  X,
  MapPin,
  Calendar,
  ZoomIn,
} from "lucide-react";
import { RomanceImage } from "@/data/romanticImages";
import { romanticAudio } from "@/utils/audioSynthesizer";
import {
  useWeddingConfig,
  buildDynamicRomanceImages,
} from "@/context/WeddingConfigContext";

interface Scene3PhysicsDeskProps {
  onNext?: () => void;
}

// 4 distinct decorative washi tape styles
const WASHI_TAPES = [
  "bg-amber-100/90 border-amber-200/60 text-amber-800 -rotate-2",
  "bg-rose-100/90 border-rose-200/60 text-rose-800 rotate-3",
  "bg-emerald-100/90 border-emerald-200/60 text-emerald-800 -rotate-1",
  "bg-purple-100/90 border-purple-200/60 text-purple-800 rotate-2",
];

export const Scene3PhysicsDesk: React.FC<Scene3PhysicsDeskProps> = () => {
  const { config } = useWeddingConfig();
  const deskImages = useMemo(
    () => buildDynamicRomanceImages(config.gallery).slice(0, 30),
    [config.gallery]
  );
  const deskRef = useRef<HTMLDivElement>(null);
  const [activeZ, setActiveZ] = useState<number>(100);
  const [layoutMode, setLayoutMode] = useState<"scatter" | "stack">("scatter");
  const [scatterSeed, setScatterSeed] = useState<number>(0);
  const [selectedPhoto, setSelectedPhoto] = useState<RomanceImage | null>(null);

  // Toggle layout mode between "Scatter" and "Tidy Stack"
  const handleToggleMode = (mode: "scatter" | "stack") => {
    romanticAudio?.playGlideSfx();
    setLayoutMode(mode);
  };

  const handleScatterAgain = () => {
    romanticAudio?.playDropSfx();
    setLayoutMode("scatter");
    setScatterSeed((prev) => prev + 1);
  };

  return (
    <div
      ref={deskRef}
      className="relative w-full h-full flex flex-col justify-between py-6 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-[#FFF5F7] via-[#FDECEF] to-[#FCE4EC] select-none overflow-hidden"
    >
      {/* Linen Desk Grain & Subtle Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay bg-[radial-gradient(#33272A_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Decorative Scattered Pressed Flower Petals & Gold Pins on Desk */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <span className="absolute top-20 left-12 w-6 h-6 rounded-full bg-rose-200/40 blur-[1px] rotate-12" />
        <span className="absolute top-1/3 right-16 w-8 h-8 rounded-full bg-amber-200/40 blur-[1px] -rotate-45" />
        <span className="absolute bottom-24 left-1/4 w-7 h-7 rounded-full bg-rose-300/30 blur-[1px] rotate-45" />
        <span className="absolute bottom-16 right-1/3 w-6 h-6 rounded-full bg-amber-300/30 blur-[1px] -rotate-12" />
      </div>

      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 z-30 shrink-0">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-romantic-roseGold/30 text-xs font-semibold text-romantic-charcoal mb-1 shadow-sm">
            <Camera className="w-3.5 h-3.5 text-romantic-roseGold" />
            <span>Scene 03 • The Physics Scrapbook Desk (30 Interactive Polaroids)</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-romantic-charcoal tracking-tight">
            The Physics Scrapbook Desk
          </h2>
          <p className="font-serif text-sm sm:text-base text-romantic-roseGoldDark italic mt-0.5">
            Toss, stack, and inspect our moments across the virtual mahogany table.
          </p>
        </div>

        {/* Controls: Mode Switcher & Navigation */}
        <div className="flex items-center gap-2.5">
          {/* Mode Switcher */}
          <div className="flex items-center bg-white/85 backdrop-blur-md p-1 rounded-full border border-romantic-roseGold/30 shadow-sm">
            <button
              onClick={() => handleToggleMode("scatter")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                layoutMode === "scatter"
                  ? "bg-romantic-roseGold text-white shadow-sm"
                  : "text-romantic-charcoal hover:bg-black/5"
              }`}
            >
              <Shuffle className="w-3 h-3" />
              <span>Scatter</span>
            </button>
            <button
              onClick={() => handleToggleMode("stack")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                layoutMode === "stack"
                  ? "bg-romantic-roseGold text-white shadow-sm"
                  : "text-romantic-charcoal hover:bg-black/5"
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Tidy Stack</span>
            </button>
          </div>

          {layoutMode === "scatter" && (
            <button
              onClick={handleScatterAgain}
              title="Reshuffle Positions"
              className="p-2 rounded-full bg-white/80 hover:bg-white border border-romantic-roseGold/30 text-romantic-charcoal shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Shuffle className="w-4 h-4 text-romantic-roseGold" />
            </button>
          )}
        </div>
      </div>

      {/* Virtual Table Top with 30 Draggable Polaroids */}
      <div
        className="relative flex-1 w-full max-w-7xl mx-auto my-3 rounded-3xl bg-white/30 backdrop-blur-sm border-2 border-dashed border-romantic-roseGold/30 overflow-hidden flex items-center justify-center min-h-[460px]"
      >
        {deskImages.map((photo, index) => (
          <DraggableScrapbookPolaroid
            key={`${photo.id}-${scatterSeed}`}
            photo={photo}
            index={index}
            deskRef={deskRef}
            layoutMode={layoutMode}
            totalCount={deskImages.length}
            onDragStart={() => {
              setActiveZ((prev) => prev + 1);
              romanticAudio?.playGlideSfx();
            }}
            onDragEnd={() => {
              romanticAudio?.playDropSfx();
            }}
            onInspect={() => {
              romanticAudio?.playGlideSfx();
              setSelectedPhoto(photo);
            }}
            currentZ={activeZ}
          />
        ))}
      </div>

      {/* Bottom Footer Hint */}
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs text-romantic-muted pt-2 border-t border-romantic-roseGold/25 z-30 gap-2 shrink-0">
        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-romantic-roseGold" />
          <span>
            Click to zoom into any memory. Drag and toss freely with momentum inertia and spring physics.
          </span>
        </span>
        <div className="flex items-center gap-3 font-semibold text-romantic-charcoal">
          <span>Mode: {layoutMode === "scatter" ? "Free Scatter" : "Tidy Stack"}</span>
          <span className="text-romantic-roseGold/40">•</span>
          <span>{deskImages.length} Physics Polaroids</span>
        </div>
      </div>

      {/* Lightbox Zoom Inspection Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20, rotate: -2 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-[#FFFDF9] rounded-2xl p-5 pb-6 shadow-2xl border-4 border-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-romantic-charcoal transition-colors z-20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Decorative Wax Seal / Stamp */}
              <div className="absolute -top-3 left-6 px-3 py-1 bg-amber-100 border border-amber-300 rounded shadow text-[10px] font-mono uppercase tracking-wider text-amber-900 font-bold -rotate-2">
                Certified Memory #{selectedPhoto.id}
              </div>

              {/* Large Image Frame */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-900 shadow-inner mt-2">
                <Image
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  fill
                  unoptimized
                  sizes="600px"
                  className="object-cover"
                />
              </div>

              {/* Memory Details */}
              <div className="pt-4 text-center">
                <p className="font-handwriting text-2xl sm:text-3xl text-romantic-charcoal font-bold leading-snug">
                  &ldquo;{selectedPhoto.caption}&rdquo;
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-romantic-muted mt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-romantic-roseGold" />
                    {selectedPhoto.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-romantic-roseGold" />
                    {selectedPhoto.date}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// =========================================================================
// SUBCOMPONENT: Draggable Scrapbook Polaroid with Momentum Inertia
// =========================================================================
interface DraggableScrapbookPolaroidProps {
  photo: RomanceImage;
  index: number;
  deskRef: React.RefObject<HTMLDivElement>;
  layoutMode: "scatter" | "stack";
  totalCount: number;
  onDragStart: () => void;
  onDragEnd: () => void;
  onInspect: () => void;
  currentZ: number;
}

const DraggableScrapbookPolaroid: React.FC<DraggableScrapbookPolaroidProps> = ({
  photo,
  index,
  deskRef,
  layoutMode,
  totalCount,
  onDragStart,
  onDragEnd,
  onInspect,
  currentZ,
}) => {
  const [zIndex, setZIndex] = useState<number>(index + 10);
  const washiStyle = useMemo(() => WASHI_TAPES[index % WASHI_TAPES.length], [index]);

  // Target coordinates depending on layout mode:
  // "scatter": spread naturally across desk
  // "stack": stacked in center like a deck of cards with subtle fan offsets
  const targetX = layoutMode === "scatter" ? photo.deskX : (index - totalCount / 2) * 1.5;
  const targetY = layoutMode === "scatter" ? photo.deskY : (index - totalCount / 2) * 0.8;
  const targetRotation = layoutMode === "scatter" ? photo.rotation : ((index % 7) - 3) * 1.5;

  const handleDragStart = () => {
    setZIndex(currentZ + 100);
    onDragStart();
  };

  return (
    <motion.div
      drag
      dragConstraints={deskRef}
      dragElastic={0.15}
      dragTransition={{
        bounceStiffness: 450,
        bounceDamping: 25,
        power: 0.25,
        timeConstant: 220,
      }}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      animate={{
        x: targetX,
        y: targetY,
        rotate: targetRotation,
        scale: 0.95,
      }}
      whileHover={{
        scale: 1.08,
        rotate: 0,
        zIndex: zIndex + 50,
        transition: { type: "spring", stiffness: 400, damping: 20 },
      }}
      whileDrag={{
        scale: 1.14,
        rotate: targetRotation * 0.4,
        cursor: "grabbing",
        boxShadow:
          "0 30px 60px -12px rgba(51, 39, 42, 0.4), 0 18px 25px -10px rgba(212, 175, 55, 0.25)",
      }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 24,
        mass: 0.8,
      }}
      className="absolute w-[185px] sm:w-[210px] bg-[#FFFDF9] rounded-xl p-2.5 pb-4 border-2 border-white shadow-[0_12px_28px_-6px_rgba(51,39,42,0.18)] cursor-grab active:cursor-grabbing hover:shadow-[0_20px_40px_-6px_rgba(51,39,42,0.26)] transition-shadow group"
      style={{
        zIndex,
      }}
    >
      {/* Decorative Washi Tape */}
      <div
        className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-4 backdrop-blur-sm border rounded-sm shadow-sm pointer-events-none ${washiStyle}`}
      />

      {/* Photo Frame */}
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 shadow-inner group">
        <Image
          src={photo.url}
          alt={photo.caption}
          fill
          unoptimized
          sizes="210px"
          className="object-cover pointer-events-none select-none transition-transform duration-500 group-hover:scale-105"
        />

        {/* Zoom inspection overlay pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInspect();
          }}
          title="Zoom & Inspect"
          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/85 hover:bg-white text-romantic-charcoal shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
        >
          <ZoomIn className="w-3 h-3 text-romantic-roseGold" />
        </button>

        <div className="absolute bottom-1.5 left-1.5 p-0.5 px-1 rounded-full bg-black/40 backdrop-blur-xs text-[8px] text-white font-mono">
          #{photo.id}
        </div>
      </div>

      {/* Handwritten Memory Note */}
      <div className="pt-2 px-1 text-center">
        <p className="font-handwriting text-base sm:text-lg text-romantic-charcoal font-semibold leading-tight truncate">
          &ldquo;{photo.caption}&rdquo;
        </p>
        <div className="flex items-center justify-between text-[9px] text-romantic-muted mt-1 font-sans">
          <span className="truncate max-w-[120px]">{photo.location.split(",")[0]}</span>
          <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400 shrink-0" />
        </div>
      </div>
    </motion.div>
  );
};
