"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface PetalItem {
  id: number;
  startX: number;
  size: number;
  duration: number;
  delay: number;
  rotationStart: number;
  rotationEnd: number;
  swayOffset: number;
  opacity: number;
  type: "petal" | "sparkle" | "ribbon";
}

export const FloatingPetals: React.FC = () => {
  // Generate a deterministic or static set of particles for clean rendering
  const particles: PetalItem[] = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const type: "petal" | "sparkle" | "ribbon" =
        i % 4 === 0 ? "ribbon" : i % 3 === 0 ? "sparkle" : "petal";
      return {
        id: i,
        startX: (i * 4.3 + 2) % 100, // percentage across screen
        size: type === "petal" ? 18 + (i % 14) : type === "ribbon" ? 30 + (i % 10) : 6 + (i % 6),
        duration: 12 + (i % 8) * 1.5,
        delay: (i * 0.7) % 6,
        rotationStart: (i * 35) % 360,
        rotationEnd: (i * 35 + 360) % 720,
        swayOffset: 25 + (i % 35),
        opacity: type === "sparkle" ? 0.7 : 0.45,
        type,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((p) => {
        if (p.type === "sparkle") {
          return (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-romantic-roseGold shadow-glow"
              style={{
                left: `${p.startX}%`,
                top: "-20px",
                width: p.size,
                height: p.size,
                opacity: p.opacity,
              }}
              animate={{
                y: ["0vh", "105vh"],
                x: [0, p.swayOffset * 0.5, -p.swayOffset * 0.5, 0],
                opacity: [0, p.opacity, p.opacity * 0.3, p.opacity, 0],
                scale: [0.6, 1.2, 0.8, 1.1, 0.5],
              }}
              transition={{
                duration: p.duration * 0.9,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear",
              }}
            />
          );
        }

        if (p.type === "ribbon") {
          return (
            <motion.div
              key={p.id}
              className="absolute pointer-events-none"
              style={{
                left: `${p.startX}%`,
                top: "-40px",
                width: p.size,
                height: p.size * 0.4,
              }}
              animate={{
                y: ["0vh", "110vh"],
                x: [0, -p.swayOffset, p.swayOffset, 0],
                rotate: [p.rotationStart, p.rotationEnd],
                opacity: [0, 0.4, 0.3, 0],
              }}
              transition={{
                duration: p.duration * 1.2,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            >
              <svg
                viewBox="0 0 100 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-romantic-blushDeep opacity-50"
              >
                <path
                  d="M0 20 C30 5, 70 35, 100 20 C70 30, 30 15, 0 20 Z"
                  fill="url(#ribbonGradient)"
                />
                <defs>
                  <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F8BBD0" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FDECEF" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          );
        }

        // Petal shape
        return (
          <motion.div
            key={p.id}
            className="absolute pointer-events-none"
            style={{
              left: `${p.startX}%`,
              top: "-30px",
              width: p.size,
              height: p.size * 1.3,
            }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, p.swayOffset, -p.swayOffset * 0.7, p.swayOffset * 0.3, 0],
              rotate: [p.rotationStart, p.rotationEnd],
              rotateY: [0, 180, 360],
              opacity: [0, p.opacity, p.opacity * 0.9, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          >
            <svg
              viewBox="0 0 30 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-sm"
            >
              <path
                d="M15 0 C25 10, 30 25, 15 40 C0 25, 5 10, 15 0 Z"
                fill="url(#petalGradient)"
              />
              <defs>
                <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF0F3" />
                  <stop offset="60%" stopColor="#F8BBD0" />
                  <stop offset="100%" stopColor="#F48FB1" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

