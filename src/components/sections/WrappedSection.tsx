"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WrappedSectionProps {
  id: string;
  isActive: boolean;
  children: React.ReactNode;
  gradientVariant?: "subtle" | "warm" | "blush" | "champagne";
  className?: string;
}

export const WrappedSection: React.FC<WrappedSectionProps> = ({
  id,
  isActive,
  children,
  gradientVariant = "subtle",
  className = "",
}) => {
  const getGradient = () => {
    switch (gradientVariant) {
      case "warm":
        return "bg-gradient-to-b from-[#FFF5F7] via-[#FDECEF] to-[#FCE4EC]";
      case "blush":
        return "bg-gradient-to-b from-[#FDECEF] via-[#FCE4EC] to-[#F8BBD0]/30";
      case "champagne":
        return "bg-gradient-to-b from-[#FFFDF9] via-[#FDECEF] to-[#FCE4EC]";
      case "subtle":
      default:
        return "bg-gradient-to-b from-[#FDECEF] to-[#FCE4EC]";
    }
  };

  return (
    <section
      id={id}
      className={`relative w-full h-[100dvh] min-h-[600px] snap-start shrink-0 flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pt-20 pb-16 ${getGradient()} ${className}`}
    >
      {/* Decorative Scrapbook Paper subtle grain & vignette */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay bg-[radial-gradient(#33272A_0.75px,transparent_0.75px)] [background-size:16px_16px]" />

      {/* Soft romantic corner glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-romantic-blush/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-romantic-roseGold/20 blur-3xl pointer-events-none" />

      {/* Content wrapper with entrance transitions */}
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
            className="w-full max-w-md mx-auto h-full flex flex-col justify-center items-center relative z-20"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

