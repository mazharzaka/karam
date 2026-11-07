"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useVelocity,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { Sparkles, ArrowRight, Film, Heart, MapPin } from "lucide-react";
import { SCENE2_FILMSTRIP_IMAGES, RomanceImage } from "@/data/romanticImages";

interface Scene2DraggableFilmstripProps {
  onNext?: () => void;
}

export const Scene2DraggableFilmstrip: React.FC<Scene2DraggableFilmstripProps> = ({
  onNext,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion value for horizontal drag
  const x = useMotionValue(0);

  // Velocity of the drag
  const xVelocity = useVelocity(x);

  // Map velocity (-1500 to 1500) to dynamic skew (-15 to 15 deg)
  const skewRaw = useTransform(xVelocity, [-1500, 0, 1500], [-14, 0, 14]);
  const skew = useSpring(skewRaw, { stiffness: 350, damping: 25 });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col justify-between py-10 px-6 lg:px-12 bg-gradient-to-b from-[#FDECEF] via-[#FFF5F7] to-[#FCE4EC] select-none overflow-hidden"
    >
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-20">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-romantic-roseGold/30 text-xs font-semibold text-romantic-charcoal mb-1">
            <Film className="w-3.5 h-3.5 text-romantic-roseGold" />
            <span>Scene 02 • Images 03 — 20 (18 Filmstrip Frames)</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-romantic-charcoal">
            The 35mm Memory Reel
          </h2>
          <p className="font-serif text-base text-romantic-roseGoldDark italic">
            Drag left or right with physics inertia &amp; velocity skew
          </p>
        </div>

        <button
          onClick={onNext}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-romantic-roseGold to-romantic-roseGoldLight text-romantic-charcoal font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Next: Physics Desk</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Central Filmstrip Viewport */}
      <div className="relative flex-1 w-full flex items-center overflow-hidden py-8">
        {/* Continuous 35mm Filmstrip Track */}
        <motion.div
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -3400, right: 100 }}
          dragElastic={0.2}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 35, power: 0.3 }}
          className="flex items-center gap-6 cursor-grab active:cursor-grabbing px-12"
        >
          {SCENE2_FILMSTRIP_IMAGES.map((img) => (
            <FilmstripFrame key={img.id} image={img} skew={skew} />
          ))}
        </motion.div>
      </div>

      {/* Bottom Guidance Hint */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs text-romantic-muted pt-2 border-t border-romantic-roseGold/20 z-20">
        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-romantic-roseGold" />
          Grab and fling horizontally. The film dynamically tilts based on drag velocity.
        </span>
        <span className="font-semibold text-romantic-charcoal">
          18 Frames • High Inertia Physics
        </span>
      </div>
    </div>
  );
};

// Subcomponent for each film frame
const FilmstripFrame: React.FC<{
  image: RomanceImage;
  skew: MotionValue<number>;
}> = ({ image, skew }) => {
  return (
    <motion.div
      style={{ skewX: skew }}
      whileHover={{ scale: 1.05, y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative shrink-0 w-[280px] sm:w-[320px] bg-[#1C1617] rounded-2xl p-3 pt-6 pb-6 shadow-2xl border-2 border-romantic-charcoal"
    >
      {/* 35mm Film Sprocket Holes (Top) */}
      <div className="absolute top-2 left-0 right-0 flex justify-between px-3 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-2 rounded-[2px] bg-[#FDECEF]/80 border border-black/50"
          />
        ))}
      </div>

      {/* Film Photo */}
      <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-stone-900 shadow-inner group mt-2 mb-2">
        <Image
          src={image.url}
          alt={image.caption}
          fill
          sizes="320px"
          className="object-cover select-none pointer-events-none filter contrast-105 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Film Frame Number & Badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono font-bold text-romantic-roseGoldLight">
          KODAK #{image.id}
        </div>

        <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 shadow-sm">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
          <p className="font-serif text-sm font-bold truncate">{image.caption}</p>
          <div className="flex items-center justify-between text-[10px] text-romantic-blushLight mt-0.5">
            <span className="flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5 text-romantic-roseGold" /> {image.location.split(",")[0]}
            </span>
            <span>{image.date}</span>
          </div>
        </div>
      </div>

      {/* 35mm Film Sprocket Holes (Bottom) */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-between px-3 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-2 rounded-[2px] bg-[#FDECEF]/80 border border-black/50"
          />
        ))}
      </div>
    </motion.div>
  );
};

