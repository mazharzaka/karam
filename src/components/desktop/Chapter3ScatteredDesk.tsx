"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, Sparkles, MapPin, RotateCcw, Heart } from "lucide-react";
import { SCATTERED_30_IMAGES, RomanceImage } from "@/data/romanticImages";

export const Chapter3ScatteredDesk: React.FC = () => {
  const deskRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<RomanceImage | null>(null);

  // Pre-configured CSS rotation classes according to prompt
  const rotationClasses = [
    "rotate-3",
    "-rotate-6",
    "rotate-12",
    "-rotate-3",
    "rotate-6",
    "-rotate-12",
    "rotate-2",
    "-rotate-4",
    "rotate-8",
    "-rotate-8",
  ];

  return (
    <section
      id="desk"
      ref={deskRef}
      className="relative w-full py-28 px-6 lg:px-12 bg-gradient-to-b from-[#FFF5F7] via-[#FDECEF] to-[#FCE4EC] overflow-hidden"
    >
      {/* Desk texture background with linen / desk grain */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay bg-[radial-gradient(#33272A_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-romantic-roseGold/30 shadow-sm text-xs font-semibold text-romantic-charcoal mb-4">
          <Camera className="w-4 h-4 text-romantic-roseGold" />
          <span>Chapter 03 • Images 21 — 50 (Interactive Desk)</span>
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-romantic-charcoal">
          The Scattered Desk
        </h2>

        <p className="font-serif text-xl sm:text-2xl text-romantic-roseGoldDark italic mt-2">
          Thirty physical polaroids scattered across our memory table.
        </p>

        <p className="text-sm sm:text-base text-romantic-muted max-w-2xl mt-3">
          Hover over any polaroid to straighten it out and magnify it. Drag them freely across the desk to curate your own collage!
        </p>

        <div className="flex items-center gap-4 mt-4 text-xs text-romantic-muted">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-romantic-roseGold" /> Hover to Straighten &amp; Zoom
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5 text-romantic-roseGold" /> Free Drag Physics Active
          </span>
        </div>
      </div>

      {/* The Scattered Desk Grid: 30 Polaroids with Random Rotations, Scales, and Hover-Straighten */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8 pt-4 pb-16 relative">
        {SCATTERED_30_IMAGES.map((photo, index) => {
          const rotClass = rotationClasses[index % rotationClasses.length];

          return (
            <motion.div
              key={photo.id}
              drag
              dragConstraints={deskRef}
              dragElastic={0.4}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 6) * 0.08 }}
              onClick={() => setSelectedPhoto(photo)}
              className={`relative group bg-romantic-polaroid rounded-xl p-3 pb-6 polaroid-shadow border-2 border-white cursor-grab active:cursor-grabbing transition-all duration-300 transform ${rotClass} hover:rotate-0 hover:scale-125 hover:z-50 hover:shadow-polaroid-hover`}
              style={{
                zIndex: index + 10,
              }}
            >
              {/* Decorative Washi Tape on top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-amber-100/80 backdrop-blur-sm border border-amber-200/50 -rotate-2 rounded-sm shadow-sm pointer-events-none group-hover:opacity-60 transition-opacity" />

              {/* Photo Frame */}
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 shadow-inner">
                <Image
                  src={photo.url}
                  alt={photo.caption}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                  className="object-cover pointer-events-none select-none filter contrast-[0.98]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20 pointer-events-none" />

                <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                </div>
              </div>

              {/* Handwritten note at bottom */}
              <div className="pt-2 px-0.5 text-center">
                <p className="font-handwriting text-base sm:text-lg text-romantic-charcoal font-semibold leading-tight truncate">
                  &ldquo;{photo.caption}&rdquo;
                </p>
                <div className="flex items-center justify-between text-[9px] text-romantic-muted mt-1 font-sans">
                  <span className="flex items-center gap-0.5 truncate">
                    <MapPin className="w-2.5 h-2.5 text-romantic-roseGold shrink-0" />
                    <span className="truncate">{photo.location.split(",")[0]}</span>
                  </span>
                  <span className="font-bold text-romantic-roseGoldDark shrink-0">
                    #{photo.id}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Polaroid Modal Overlay if clicked */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-romantic-charcoal/60 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-romantic-polaroid rounded-2xl p-6 pb-8 polaroid-shadow border-4 border-white max-w-lg w-full text-center relative"
          >
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 shadow-inner">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                fill
                priority
                className="object-cover"
              />
            </div>
            <p className="font-handwriting text-3xl text-romantic-charcoal font-bold">
              &ldquo;{selectedPhoto.caption}&rdquo;
            </p>
            <p className="text-xs text-romantic-muted mt-2">
              Captured at {selectedPhoto.location} • {selectedPhoto.date}
            </p>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-romantic-roseGold to-romantic-roseGoldLight text-romantic-charcoal font-semibold text-xs shadow-md"
            >
              Close Memory
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
};

