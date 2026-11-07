"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Heart,
  Camera,
  MapPin,
  Sparkles,
} from "lucide-react";
import { PolaroidPhoto } from "@/types/wrapped";

interface PolaroidStackSectionProps {
  photos: PolaroidPhoto[];
  isActive: boolean;
  totalLogCount?: number;
  onNextSection?: () => void;
}

export const PolaroidStackSection: React.FC<PolaroidStackSectionProps> = ({
  photos,
  isActive,
  totalLogCount = 64,
  onNextSection,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const total = photos.length;
  const currentPhoto = photos[currentIndex];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const toggleHeart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      data-active={isActive}
      className="w-full h-full flex flex-col justify-between py-2 text-romantic-charcoal select-none"
    >
      {/* Top Header */}
      <div className="text-center w-full pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm border border-romantic-roseGold/30 text-xs text-romantic-charcoalSoft shadow-sm mb-1">
          <Camera className="w-3.5 h-3.5 text-romantic-roseGold" />
          <span>Scattered Memories Stack</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-romantic-charcoal">
          Captured in Love
        </h2>
        <p className="text-xs text-romantic-muted">
          Showing Memory <span className="font-bold text-romantic-charcoal">{currentIndex + 1}</span> of{" "}
          <span className="font-semibold text-romantic-roseGoldDark">{totalLogCount} Captured</span>
        </p>
      </div>

      {/* The Central Polaroid Stack */}
      <div className="relative flex-1 w-full max-w-xs sm:max-w-sm mx-auto flex items-center justify-center py-4">
        {/* Ambient warm glow under the stack */}
        <div className="absolute w-64 h-64 bg-romantic-blush/40 blur-3xl rounded-full pointer-events-none" />

        {/* Stack Layers (Render bottom cards with slight scale/offset to simulate thick physical pile) */}
        {[3, 2, 1].map((offset) => {
          const stackPhotoIndex = (currentIndex + offset) % total;
          const stackPhoto = photos[stackPhotoIndex];
          const rotationAngle = (offset % 2 === 0 ? 1 : -1) * (offset * 4);

          return (
            <div
              key={`stack-under-${offset}`}
              className="absolute w-[260px] sm:w-[280px] bg-romantic-polaroid rounded-2xl p-3 pb-8 polaroid-shadow border border-romantic-roseGold/20 pointer-events-none transition-transform duration-300"
              style={{
                transform: `scale(${1 - offset * 0.05}) translateY(${
                  offset * 10
                }px) rotate(${rotationAngle}deg)`,
                opacity: 0.65 - offset * 0.18,
                zIndex: 10 - offset,
              }}
            >
              {/* Dummy photo preview */}
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-romantic-blush/20">
                <Image
                  src={stackPhoto.imageUrl}
                  alt={stackPhoto.caption}
                  fill
                  sizes="280px"
                  className="object-cover filter contrast-95"
                />
              </div>
              <div className="mt-3 h-4 bg-romantic-charcoal/10 rounded w-2/3" />
            </div>
          );
        })}

        {/* Top Active Interactive Card (Draggable with swipe discard & flip physics) */}
        <AnimatePresence mode="popLayout" custom={direction}>
          <PolaroidCard
            key={currentPhoto.id}
            photo={currentPhoto}
            onSwipe={handleNext}
            isLiked={!!likedMap[currentPhoto.id]}
            onToggleLike={(e) => toggleHeart(currentPhoto.id, e)}
          />
        </AnimatePresence>
      </div>

      {/* Interactive Controls & Swipe Guidance */}
      <div className="flex flex-col items-center gap-2 pt-1 pb-2">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            aria-label="Previous polaroid memory"
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-romantic-charcoal shadow-sm border border-romantic-roseGold/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-romantic-charcoalSoft" />
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-romantic-roseGold to-romantic-roseGoldLight text-romantic-charcoal font-semibold text-xs shadow-md border border-romantic-roseGoldDark/20 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next Polaroid</span>
          </button>

          <button
            onClick={handleNext}
            aria-label="Next polaroid memory"
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-romantic-charcoal shadow-sm border border-romantic-roseGold/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-romantic-charcoalSoft" />
          </button>
        </div>

        <div className="flex items-center justify-between w-full max-w-xs px-2 text-[11px] text-romantic-muted">
          <span className="flex items-center gap-1">
            <RotateCcw className="w-3 h-3 text-romantic-roseGold" /> Drag card left or right
          </span>
          {onNextSection && (
            <button
              onClick={onNextSection}
              className="text-romantic-roseGoldDark font-semibold hover:underline"
            >
              See Love Certificate &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component for individual draggable Polaroid Card
interface PolaroidCardProps {
  photo: PolaroidPhoto;
  onSwipe: () => void;
  isLiked: boolean;
  onToggleLike: (e: React.MouseEvent) => void;
}

const PolaroidCard: React.FC<PolaroidCardProps> = ({
  photo,
  onSwipe,
  isLiked,
  onToggleLike,
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-18, photo.rotation, 18]);
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 400) {
      onSwipe();
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0, transition: { duration: 0.25 } }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.02 }}
      className="absolute z-20 w-[265px] sm:w-[285px] bg-romantic-polaroid rounded-2xl p-3 sm:p-3.5 pb-6 polaroid-shadow border-2 border-white cursor-grab active:cursor-grabbing touch-pan-y"
    >
      {/* Decorative Washi Tape on top edge */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-100/80 backdrop-blur-sm border border-amber-200/50 -rotate-2 rounded-sm shadow-sm pointer-events-none" />

      {/* Main Image Frame */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 shadow-inner group">
        <Image
          src={photo.imageUrl}
          alt={photo.caption}
          fill
          priority
          sizes="(max-width: 640px) 265px, 285px"
          className="object-cover pointer-events-none select-none transition-transform duration-500 group-hover:scale-105"
        />

        {/* Vintage film photo gloss shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20 pointer-events-none" />

        {/* Interactive Floating Heart Like button */}
        <button
          onClick={onToggleLike}
          aria-label={isLiked ? "Unlike memory" : "Like memory"}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md border border-romantic-roseGold/20 hover:scale-110 active:scale-95 transition-all z-30"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked
                ? "text-rose-500 fill-rose-500"
                : "text-romantic-charcoalSoft hover:text-rose-500"
            }`}
          />
        </button>
      </div>

      {/* Romantic Handwritten Caption on bottom margin of polaroid */}
      <div className="pt-3 px-1 text-center">
        <p className="font-handwriting text-xl sm:text-2xl text-romantic-charcoal font-semibold leading-tight tracking-wide">
          &ldquo;{photo.caption}&rdquo;
        </p>

        <div className="flex items-center justify-between text-[10px] text-romantic-muted mt-2 pt-1 border-t border-romantic-charcoal/10 font-sans">
          <span className="flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5 text-romantic-roseGold" /> {photo.location}
          </span>
          <span className="font-medium tracking-wide">{photo.date}</span>
        </div>
      </div>
    </motion.div>
  );
};

