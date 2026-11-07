"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, Heart, Calendar } from "lucide-react";
import { BIG_DAY_20_IMAGES } from "@/data/romanticImages";

export const Chapter4BigDayCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll =
        direction === "left"
          ? Math.max(0, scrollLeft - scrollAmount)
          : scrollLeft + scrollAmount;

      carouselRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
      setScrollPosition(targetScroll);
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft);
    }
  };

  return (
    <section
      id="big-day"
      className="relative w-full py-28 px-6 lg:px-12 bg-gradient-to-b from-[#FCE4EC] via-[#FDECEF] to-[#FFF5F7] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-romantic-roseGold/30 shadow-sm text-xs font-semibold text-romantic-charcoal mb-4">
          <Sparkles className="w-4 h-4 text-romantic-roseGold" />
          <span>Chapter 04 • Images 51 — 70</span>
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-romantic-charcoal">
          The Big Day: Forever Begins
        </h2>

        <p className="font-serif text-xl sm:text-2xl text-romantic-roseGoldDark italic mt-2">
          Twenty cinematic frames from the most sacred day of our lives.
        </p>

        <p className="text-sm sm:text-base text-romantic-muted max-w-2xl mt-3">
          Our vows whispered in the villa gardens, our first dance to our sacred song, and the joy of everyone we cherish under one sky.
        </p>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-romantic-charcoal shadow-md border border-romantic-roseGold/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-romantic-charcoalSoft" />
          </button>

          <span className="text-xs uppercase tracking-widest font-semibold text-romantic-muted px-2">
            Swipe horizontally or use arrows
          </span>

          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-romantic-charcoal shadow-md border border-romantic-roseGold/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-romantic-charcoalSoft" />
          </button>
        </div>
      </div>

      {/* Full-bleed Horizontal Scroll / Drag Track */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth px-6 lg:px-16 pb-8 pt-2 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {BIG_DAY_20_IMAGES.map((item, index) => {
          const isFeatured = index % 4 === 0;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 5) * 0.08 }}
              className={`shrink-0 rounded-3xl p-4 bg-white/85 backdrop-blur-md border border-romantic-roseGold/35 shadow-polaroid hover:shadow-polaroid-hover transition-all duration-300 hover:-translate-y-2 group ${
                isFeatured
                  ? "w-[340px] sm:w-[420px] ring-2 ring-romantic-roseGold/40 bg-gradient-to-b from-white to-romantic-blushLight/40"
                  : "w-[280px] sm:w-[320px]"
              }`}
              style={{ scrollSnapAlign: "center" }}
            >
              {/* Photo Container */}
              <div
                className={`relative w-full rounded-2xl overflow-hidden bg-romantic-blush/20 ${
                  isFeatured ? "aspect-[16/11]" : "aspect-[3/4]"
                }`}
              >
                <Image
                  src={item.url}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 768px) 300px, 420px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                <div className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm">
                  <Heart className="w-4 h-4 text-romantic-blushDeep fill-romantic-blushDeep" />
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase tracking-wider font-semibold bg-romantic-roseGold/80 px-2 py-0.5 rounded-full text-romantic-charcoal">
                    {isFeatured ? "Highlight Vow" : `Wedding Moment #${item.id}`}
                  </span>
                  <p className="font-serif text-lg font-bold truncate mt-1 drop-shadow-md">
                    {item.caption}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 px-1 flex items-center justify-between text-xs text-romantic-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-romantic-roseGold" /> {item.date}
                </span>
                <span className="font-semibold text-romantic-roseGoldDark">
                  {item.location.split(",")[0]}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Track Indicator Bar */}
      <div className="max-w-xs mx-auto mt-4 h-1 bg-romantic-charcoal/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-romantic-roseGold rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(100, Math.max(15, (scrollPosition / 3500) * 100))}%`,
          }}
        />
      </div>
    </section>
  );
};

