"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Heart, Sparkles } from "lucide-react";
import { RomanceImage } from "@/data/romanticImages";

interface DarkroomLightboxProps {
  image: RomanceImage | null;
  onClose: () => void;
}

export const DarkroomLightbox: React.FC<DarkroomLightboxProps> = ({
  image,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          key="darkroom-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 select-none"
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 polaroid-shadow border-4 border-white text-romantic-charcoal"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close memory modal"
              className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white hover:bg-stone-100 text-romantic-charcoal shadow-lg border border-romantic-roseGold/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Washi Tape Header */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-100/90 backdrop-blur-sm border border-amber-200/60 -rotate-1 rounded-sm shadow-sm pointer-events-none" />

            {/* Photo Viewport */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-inner group">
              <Image
                src={image.url}
                alt={image.caption}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />

              {/* Heart Badge */}
              <div className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </div>

              {/* Number Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold text-romantic-roseGoldLight shadow-sm">
                Memory #{image.id}
              </div>
            </div>

            {/* Romantic Handwritten Caption */}
            <div className="pt-5 text-center">
              <p className="font-handwriting text-2xl sm:text-3xl font-bold text-romantic-charcoal leading-tight">
                &ldquo;{image.caption}&rdquo;
              </p>

              {/* Metadata Details */}
              <div className="flex items-center justify-between text-xs text-romantic-muted mt-3 pt-3 border-t border-romantic-charcoal/10 font-sans">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-romantic-roseGold" />
                  <span>{image.location}</span>
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-romantic-roseGold" />
                  <span>{image.date}</span>
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-[11px] text-romantic-roseGoldDark font-serif italic flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-romantic-roseGold" /> Forever Bound &bull; Sacred Archive
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

