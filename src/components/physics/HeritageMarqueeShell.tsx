"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  useAnimation,
  useInView,
  useMotionValue,
} from "framer-motion";
import { useGlobalAudio } from "@/utils/globalAudioCoordinator";
import {
  useWeddingConfig,
  mergeGalleryIntoCards,
} from "@/context/WeddingConfigContext";

export interface ThemeMomentCard {
  num: string;
  corner: string;
  title: string;
  place: string;
  time: string;
  badge: string;
  photo: string;
}

const ROTATIONS = [
  "rotate-[-3deg]",
  "rotate-[2deg]",
  "rotate-[-1.5deg]",
  "rotate-[3deg]",
];
const SPEED = 45;

export interface HeritageMarqueeShellProps {
  id: string;
  chapterBadge: string;
  title: string;
  subtitle: string;
  footerLabel: string;
  backgroundClassName: string;
  titleClassName: string;
  subtitleClassName: string;
  badgeClassName: string;
  accentColor: string;
  footerTextClassName?: string;
  audioSrc: string;
  groomImageSrc: string;
  brideImageSrc: string;
  defaultCards: ThemeMomentCard[];
  galleryOffset?: number;
  backgroundDecorations?: React.ReactNode;
  onNext?: () => void;
  scrollContainerRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
}

const VolumeIcon: React.FC<{ muted?: boolean; className?: string }> = ({
  muted,
  className,
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    {muted ? (
      <>
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </>
    ) : (
      <>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </>
    )}
  </svg>
);

export const HeritageMarqueeShell: React.FC<HeritageMarqueeShellProps> = ({
  id,
  chapterBadge,
  title,
  subtitle,
  footerLabel,
  backgroundClassName,
  titleClassName,
  subtitleClassName,
  badgeClassName,
  accentColor,
  footerTextClassName = "text-white/80",
  audioSrc,
  groomImageSrc,
  brideImageSrc,
  defaultCards,
  galleryOffset = 0,
  backgroundDecorations,
  onNext,
}) => {
  const { config } = useWeddingConfig();
  const dynamicCards = useMemo(
    () => mergeGalleryIntoCards(defaultCards, config.gallery, galleryOffset),
    [defaultCards, config.gallery, galleryOffset]
  );

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const controls = useAnimation();
  const x = useMotionValue(0);

  const halfRef = useRef<number>(0);
  const runIdRef = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);

  const [isPaused, setIsPaused] = useState(false);
  const {
    isEnabled: isGlobalAudioEnabled,
    toggleAudio,
    playTrack,
    stopTrack,
  } = useGlobalAudio();
  const isMuted = !isGlobalAudioEnabled;

  const inView = useInView(sectionRef, { amount: 0.35 });
  const charactersInView = useInView(sectionRef, { amount: 0.12 });

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const first = track.children[0] as HTMLElement | undefined;
      const copy = track.children[dynamicCards.length] as
        | HTMLElement
        | undefined;
      if (first && copy) {
        halfRef.current = copy.offsetLeft - first.offsetLeft;
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [dynamicCards.length]);

  const run = useCallback(() => {
    const halfWidth = halfRef.current;
    if (!halfWidth || pausedRef.current) return;

    const idNum = ++runIdRef.current;
    let start = x.get() % halfWidth;
    if (start > 0) start -= halfWidth;
    x.set(start);

    const remaining = halfWidth + start;
    controls
      .start({
        x: [start, -halfWidth],
        transition: { duration: remaining / SPEED, ease: "linear" },
      })
      .then(() => {
        if (runIdRef.current !== idNum || pausedRef.current) return;
        x.set(0);
        run();
      })
      .catch(() => {});
  }, [controls, x]);

  useEffect(() => {
    run();
    return () => {
      runIdRef.current += 1;
      controls.stop();
    };
  }, [run, controls]);

  const togglePause = () => {
    if (pausedRef.current) {
      pausedRef.current = false;
      setIsPaused(false);
      run();
    } else {
      pausedRef.current = true;
      setIsPaused(true);
      runIdRef.current += 1;
      controls.stop();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (inView && isGlobalAudioEnabled) {
      playTrack(audio, 0.85);
    } else {
      stopTrack(audio, 800);
    }
  }, [inView, isGlobalAudioEnabled, playTrack, stopTrack]);

  const loopedCards = [...dynamicCards, ...dynamicCards];

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative isolate flex h-[82vh] min-h-[640px] max-h-[820px] w-full flex-col overflow-hidden select-none ${backgroundClassName}`}
    >
      <audio ref={audioRef} src={audioSrc} loop preload="auto" className="hidden" />

      {backgroundDecorations}

      {/* Top-Right Controls */}
      <div className="absolute right-6 top-6 z-50 flex items-center gap-2.5">
        <button
          type="button"
          onClick={toggleAudio}
          aria-label={isMuted ? "Unmute music" : "Mute music"}
          className="flex items-center gap-1.5 rounded-full border border-white/40 bg-white/90 px-3 py-2 text-xs font-bold text-[#2B1D24] shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer"
        >
          <VolumeIcon muted={isMuted} className="h-4 w-4" />
          <span className="hidden sm:inline font-sans">
            {isMuted ? "Unmute" : "Music"}
          </span>
        </button>

        <button
          type="button"
          onClick={togglePause}
          aria-pressed={isPaused}
          className="rounded-full border border-white/40 bg-white/90 px-4 py-2 text-sm font-bold text-[#2B1D24] shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer"
        >
          {isPaused ? "▶ Play" : "❚❚ Pause"}
        </button>

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            style={{ backgroundColor: accentColor }}
            className="rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            Next Chapter →
          </button>
        )}
      </div>

      {/* Centered Header */}
      <header className="relative z-30 px-6 pt-8 text-center md:pt-10 mb-20 md:mb-24 pb-10 md:pb-12">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-bold shadow-sm ${badgeClassName}`}
        >
          {chapterBadge}
        </span>

        <h2
          className={`mt-3 font-serif text-3xl font-black md:text-5xl tracking-tight ${titleClassName}`}
        >
          {title}
        </h2>

        <p
          className={`mt-2 font-serif text-sm italic md:text-base ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      </header>

      {/* Kotsheena 3-Card Marquee */}
      <div className="relative z-20 my-auto h-[440px] min-h-[400px] w-full overflow-hidden">
        <motion.div
          ref={trackRef}
          animate={controls}
          style={{ x }}
          className="flex w-max gap-6 will-change-transform"
        >
          {loopedCards.map((card, i) => {
            const rot =
              ROTATIONS[(i % dynamicCards.length) % ROTATIONS.length];
            return (
              <div
                key={`${card.num}-${i}`}
                className={`group flex h-[390px] w-[265px] shrink-0 flex-col rounded-2xl border-2 bg-white p-2.5 shadow-[0_14px_30px_rgba(0,0,0,0.22)] transition-transform duration-300 ease-out hover:-translate-y-2 hover:rotate-0 ${rot}`}
                style={{ borderColor: accentColor }}
              >
                <div className="flex h-7 shrink-0 items-center justify-between px-1 text-[#2B1D24]">
                  <span className="font-serif text-base font-bold leading-none">
                    {card.corner}
                  </span>
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{ color: accentColor }}
                  >
                    {card.num}
                  </span>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-lg bg-[#2B1D24]/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.photo}
                    alt={card.title}
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
                    <div className="font-serif text-sm font-semibold leading-tight line-clamp-1">
                      {card.title}
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-white/85">
                      <span>{card.place}</span>
                      <span>{card.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex h-7 shrink-0 items-center justify-between px-1 text-[#2B1D24]">
                  <span
                    className="font-serif text-[10px] font-bold"
                    style={{ color: accentColor }}
                  >
                    {config.groomName} &amp; {config.brideName}
                  </span>
                  <span className="font-serif text-[10px] font-bold">
                    {card.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Left Character (Standard Clean Bottom-Anchored Framing) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={charactersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 z-50 w-44 md:w-64 lg:w-80 pointer-events-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={groomImageSrc}
          alt={`${config.groomName} ${title}`}
          aria-hidden="true"
          className="w-full h-auto object-contain object-bottom"
        />
      </motion.div>

      {/* Right Character (Standard Clean Bottom-Anchored Framing) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={charactersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 right-0 z-50 w-44 md:w-64 lg:w-80 pointer-events-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brideImageSrc}
          alt={`${config.brideName} ${title}`}
          aria-hidden="true"
          className="w-full h-auto object-contain object-bottom"
        />
      </motion.div>

      {/* Footer */}
      <footer
        className={`relative z-30 flex items-center justify-between px-6 pb-5 text-xs ${footerTextClassName}`}
      >
        <span>
          ✦ {config.groomName} &amp; {config.brideName} • {footerLabel}
        </span>
        <span className="font-serif italic font-bold">{title}</span>
      </footer>
    </section>
  );
};

