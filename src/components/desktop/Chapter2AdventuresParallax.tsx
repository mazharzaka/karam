"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Compass, Sparkles, Heart } from "lucide-react";
import { ADVENTURES_20_IMAGES } from "@/data/romanticImages";

export const Chapter2AdventuresParallax: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scroll tracking bound to this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // 3 columns moving vertically at 3 distinctly different speeds
  const yColumn1 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const yColumn2 = useTransform(scrollYProgress, [0, 1], [80, -280]);
  const yColumn3 = useTransform(scrollYProgress, [0, 1], [-40, -120]);

  // Distribute 20 images across 3 columns:
  // Column 1: 7 images
  // Column 2: 7 images
  // Column 3: 6 images
  const col1Images = ADVENTURES_20_IMAGES.slice(0, 7);
  const col2Images = ADVENTURES_20_IMAGES.slice(7, 14);
  const col3Images = ADVENTURES_20_IMAGES.slice(14, 20);

  return (
    <section
      id="adventures"
      ref={containerRef}
      className="relative w-full py-28 px-6 lg:px-12 bg-gradient-to-b from-[#FCE4EC] via-[#FDECEF] to-[#FFF5F7] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        
        {/* Left Side: Sticky Editorial Spotify-Wrapped Story Text */}
        <div className="w-full lg:w-5/12 lg:sticky lg:top-28 flex flex-col items-start text-left z-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-romantic-roseGold/30 shadow-sm text-xs font-semibold text-romantic-charcoal mb-4">
            <Compass className="w-4 h-4 text-romantic-roseGold" />
            <span>Chapter 02 • Images 01 — 20</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-romantic-charcoal leading-tight">
            Our Crazy Adventures
          </h2>

          <p className="font-serif text-xl sm:text-2xl text-romantic-roseGoldDark italic mt-2">
            &ldquo;We didn&apos;t just travel the globe; we found home in every horizon.&rdquo;
          </p>

          <p className="text-sm sm:text-base text-romantic-muted mt-5 leading-relaxed">
            From sudden torrential downpours in Positano where we ate gelato under a church doorway, to renting motorbikes through lavender hills — you were always my favorite view.
          </p>

          {/* Spotify Wrapped Milestone List Card */}
          <div className="w-full mt-8 p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-romantic-roseGold/30 shadow-polaroid">
            <div className="flex items-center justify-between border-b border-romantic-roseGold/20 pb-3 mb-4">
              <span className="text-xs uppercase tracking-widest font-bold text-romantic-roseGoldDark">
                Top Travel Genres
              </span>
              <span className="text-[11px] font-semibold text-romantic-muted">
                20 Moments Logged
              </span>
            </div>

            <div className="space-y-3">
              {[
                { title: "Coastal Sunsets & Cliffside Dinners", count: "38 Visits", tag: "#1 Genre" },
                { title: "Old European Alleys & Café Mornings", count: "24 Visits", tag: "Heavy Repeat" },
                { title: "Late Night Spontaneous Roadtrips", count: "16 Visits", tag: "Fan Favorite" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-romantic-roseGoldDark">
                      0{idx + 1}.
                    </span>
                    <span className="font-medium text-romantic-charcoal">{item.title}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-romantic-blush/30 text-romantic-charcoal text-[10px] font-semibold">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-romantic-roseGold/15 flex items-center justify-between text-xs text-romantic-muted">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-romantic-roseGold" /> 3-Speed Parallax Active
              </span>
              <span className="font-semibold text-romantic-charcoal">Images 1 – 20</span>
            </div>
          </div>
        </div>

        {/* Right Side: 3-Column Masonry with Parallax */}
        <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
          
          {/* Column 1 (Speed 1) */}
          <motion.div style={{ y: yColumn1 }} className="flex flex-col gap-6">
            {col1Images.map((img) => (
              <ParallaxPhotoCard key={img.id} image={img} />
            ))}
          </motion.div>

          {/* Column 2 (Speed 2 - Faster) */}
          <motion.div style={{ y: yColumn2 }} className="flex flex-col gap-6 sm:mt-12">
            {col2Images.map((img) => (
              <ParallaxPhotoCard key={img.id} image={img} />
            ))}
          </motion.div>

          {/* Column 3 (Speed 3 - Counter-offset) */}
          <motion.div style={{ y: yColumn3 }} className="flex flex-col gap-6">
            {col3Images.map((img) => (
              <ParallaxPhotoCard key={img.id} image={img} />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

// Sub-component for individual Parallax Cards
const ParallaxPhotoCard: React.FC<{ image: (typeof ADVENTURES_20_IMAGES)[0] }> = ({ image }) => {
  return (
    <div className="relative group bg-romantic-creamy rounded-2xl p-3 pb-4 polaroid-shadow border border-romantic-roseGold/25 hover:border-romantic-roseGold/60 transition-all duration-300 hover:-translate-y-1">
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-romantic-blush/20">
        <Image
          src={image.url}
          alt={image.caption}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm">
          <Heart className="w-3.5 h-3.5 text-romantic-blushDeep fill-romantic-blushDeep" />
        </div>
      </div>

      <div className="pt-3 px-1 text-left">
        <p className="font-serif text-sm font-bold text-romantic-charcoal truncate">
          {image.caption}
        </p>
        <div className="flex items-center justify-between text-[11px] text-romantic-muted mt-1">
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 text-romantic-roseGold shrink-0" />
            <span className="truncate">{image.location}</span>
          </span>
          <span className="font-semibold text-romantic-roseGoldDark shrink-0">
            #{image.id}
          </span>
        </div>
      </div>
    </div>
  );
};

