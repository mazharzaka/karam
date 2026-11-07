"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, ArrowRight, RotateCcw, Heart, Shuffle } from "lucide-react";
import { SCENE3_DESK_IMAGES, RomanceImage } from "@/data/romanticImages";
import { romanticAudio } from "@/utils/audioSynthesizer";

interface Scene3PhysicsDeskProps {
  onNext?: () => void;
}

export const Scene3PhysicsDesk: React.FC<Scene3PhysicsDeskProps> = ({ onNext }) => {
  const deskRef = useRef<HTMLDivElement>(null);
  const [activeZ, setActiveZ] = useState<number>(50);
  const [scatterKey, setScatterKey] = useState<number>(0);

  const triggerScatter = () => {
    romanticAudio?.playDropSfx();
    setScatterKey((prev) => prev + 1);
  };

  return (
    <div
      ref={deskRef}
      className="relative w-full h-full flex flex-col justify-between py-8 px-6 lg:px-12 bg-gradient-to-b from-[#FFF5F7] via-[#FDECEF] to-[#FCE4EC] select-none overflow-hidden"
    >
      {/* Linen Desk Grain Background */}
      <div className="absolute inset-0 pointer-events-none opacity-35 mix-blend-overlay bg-[radial-gradient(#33272A_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-30">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-romantic-roseGold/30 text-xs font-semibold text-romantic-charcoal mb-1">
            <Camera className="w-3.5 h-3.5 text-romantic-roseGold" />
            <span>Scene 03 • Images 21 — 50 (30 Physics Polaroids)</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-romantic-charcoal">
            The Physics Scrapbook Desk
          </h2>
          <p className="font-serif text-base text-romantic-roseGoldDark italic">
            Pick up, fling, and stack physical polaroids freely with spring dynamics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerScatter}
            className="px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-romantic-roseGold/30 text-romantic-charcoal text-xs font-semibold shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-romantic-roseGold" />
            <span>Scatter Table</span>
          </button>

          <button
            onClick={onNext}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-romantic-roseGold to-romantic-roseGoldLight text-romantic-charcoal font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Next: Z-Axis Tunnel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Virtual Table Top with 30 Draggable Polaroids */}
      <div
        key={scatterKey}
        className="relative flex-1 w-full max-w-7xl mx-auto my-2 rounded-3xl bg-white/20 backdrop-blur-sm border-2 border-dashed border-romantic-roseGold/25 overflow-hidden flex items-center justify-center"
      >
        {SCENE3_DESK_IMAGES.map((photo, index) => {
          return (
            <PhysicsPolaroidCard
              key={`${photo.id}-${scatterKey}`}
              photo={photo}
              index={index}
              deskRef={deskRef}
              onDragStart={() => {
                setActiveZ((prev) => prev + 1);
                romanticAudio?.playDropSfx();
              }}
              currentZ={activeZ}
            />
          );
        })}
      </div>

      {/* Bottom Hint */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs text-romantic-muted pt-2 border-t border-romantic-roseGold/20 z-30">
        <span className="flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5 text-romantic-roseGold" />
          Click and drag any polaroid. Elevation jumps to the top with high spring physics (`scale: 1.1`).
        </span>
        <span className="font-semibold text-romantic-charcoal">
          30 Physics Polaroids Active
        </span>
      </div>
    </div>
  );
};

// Sub-component for individual draggable physics polaroid
interface PhysicsPolaroidCardProps {
  photo: RomanceImage;
  index: number;
  deskRef: React.RefObject<HTMLDivElement>;
  onDragStart: () => void;
  currentZ: number;
}

const PhysicsPolaroidCard: React.FC<PhysicsPolaroidCardProps> = ({
  photo,
  index,
  deskRef,
  onDragStart,
  currentZ,
}) => {
  const [zIndex, setZIndex] = useState<number>(index + 10);

  const handleStart = () => {
    setZIndex(currentZ + 100);
    onDragStart();
  };

  return (
    <motion.div
      drag
      dragConstraints={deskRef}
      dragElastic={0.2}
      onDragStart={handleStart}
      initial={{
        x: photo.deskX,
        y: photo.deskY,
        rotate: photo.rotation,
        scale: 0.95,
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      whileDrag={{
        scale: 1.1,
        rotate: photo.rotation * 0.5,
        cursor: "grabbing",
        boxShadow:
          "0 25px 45px -10px rgba(51, 39, 42, 0.35), 0 15px 20px -10px rgba(212, 175, 55, 0.2)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 22,
        mass: 0.8,
      }}
      className="absolute w-[190px] sm:w-[220px] bg-romantic-polaroid rounded-xl p-3 pb-5 polaroid-shadow border-2 border-white cursor-grab active:cursor-grabbing hover:shadow-polaroid-hover transition-shadow"
      style={{
        zIndex,
      }}
    >
      {/* Decorative Washi Tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-amber-100/90 backdrop-blur-sm border border-amber-200/50 -rotate-2 rounded-sm shadow-sm pointer-events-none" />

      {/* Photo Frame */}
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 shadow-inner">
        <Image
          src={photo.url}
          alt={photo.caption}
          fill
          sizes="220px"
          className="object-cover pointer-events-none select-none"
        />
        <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 shadow-sm">
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
        </div>
      </div>

      {/* Handwritten Note */}
      <div className="pt-2 px-1 text-center">
        <p className="font-handwriting text-base sm:text-lg text-romantic-charcoal font-semibold leading-tight truncate">
          &ldquo;{photo.caption}&rdquo;
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
};

