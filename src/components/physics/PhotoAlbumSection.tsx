"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HTMLFlipBook from "react-pageflip";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Pause,
  RefreshCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useWeddingConfig } from "@/context/WeddingConfigContext";
import { globalAudioCoordinator } from "@/utils/globalAudioCoordinator";

interface AlbumPhoto {
  id: string;
  url: string;
  caption?: string;
  date?: string;
}

const FALLBACK_PHOTOS: AlbumPhoto[] = [
  { id: "fb-1", url: "/moments/01.jpg", caption: "أول لحظة جمعتنا", date: "Memory I" },
  { id: "fb-2", url: "/moments/02.jpg", caption: "ضحكة من القلب", date: "Memory II" },
  { id: "fb-3", url: "/moments/03.jpg", caption: "أجمل ذكرياتنا", date: "Memory III" },
  { id: "fb-4", url: "/moments/04.jpg", caption: "خطوة بخطوة سوا", date: "Memory IV" },
  { id: "fb-5", url: "/moments/05.jpg", caption: "وعد العمر كله", date: "Memory V" },
  { id: "fb-6", url: "/moments/06.jpg", caption: "بداية حكايتنا", date: "Memory VI" },
];

const InterlockingRingsSVG: React.FC<{ className?: string }> = ({
  className = "w-14 h-14",
}) => (
  <svg
    viewBox="0 0 80 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="goldRingGrad" x1="0" y1="0" x2="80" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <circle
      cx="29"
      cy="24"
      r="16"
      stroke="url(#goldRingGrad)"
      strokeWidth="2.2"
    />
    <circle
      cx="29"
      cy="24"
      r="12.5"
      stroke="url(#goldRingGrad)"
      strokeWidth="0.7"
      strokeOpacity="0.45"
    />
    <circle
      cx="51"
      cy="24"
      r="16"
      stroke="url(#goldRingGrad)"
      strokeWidth="2.2"
    />
    <circle
      cx="51"
      cy="24"
      r="12.5"
      stroke="url(#goldRingGrad)"
      strokeWidth="0.7"
      strokeOpacity="0.45"
    />
    <polygon points="40,5 42.2,9.2 40,12 37.8,9.2" fill="#FDE68A" />
  </svg>
);

/**
 * Distinguishes a genuine click from the click event fired at the end of a drag,
 * so dragging pages never triggers an extra instant flip.
 */
function useClickGuard() {
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const begin = (x: number, y: number) => {
    startRef.current = { x, y };
  };
  const isRealClick = (x: number, y: number) => {
    const s = startRef.current;
    startRef.current = null;
    if (!s) return true;
    return Math.hypot(x - s.x, y - s.y) < 8;
  };
  return { begin, isRealClick };
}

interface PageProps {
  children: React.ReactNode;
  pageNumber?: number;
  onMarginClick?: (side: "left" | "right") => void;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>(
  ({ children, pageNumber, onMarginClick }, ref) => {
    const guard = useClickGuard();
    const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!onMarginClick) return;
      if (!guard.isRealClick(e.clientX, e.clientY)) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const clickedLeftHalf = e.clientX < rect.left + rect.width / 2;
      onMarginClick(clickedLeftHalf ? "left" : "right");
    };

    return (
      <div
        ref={ref}
        onMouseDown={(e) => guard.begin(e.clientX, e.clientY)}
        onTouchStart={(e) =>
          guard.begin(e.touches[0].clientX, e.touches[0].clientY)
        }
        onClick={handlePageClick}
        className="page relative h-full w-full overflow-hidden bg-[#f8f5ee] shadow-[inset_0_0_32px_rgba(0,0,0,0.12)] border border-stone-300/90 p-4 flex flex-col select-none cursor-pointer"
      >
        {/* Spine-side depth shadow + visible stacked page-edge lines on the outer edge */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/20 via-black/5 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/15 to-transparent" />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[5px] opacity-70"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, #e8e0cc 0 1px, #bfb499 1px 2px)",
          }}
        />

        {/* Strict grid: rows split equally so 2 images can never overlap or clip */}
        <div className="relative z-10 flex-1 min-h-0 grid grid-cols-1 auto-rows-[minmax(0,1fr)] gap-3 overflow-hidden">
          {children}
        </div>

        {typeof pageNumber === "number" && (
          <div className="relative z-10 shrink-0 pt-2 text-center font-serif text-[11px] tracking-[0.25em] text-stone-500">
            {pageNumber}
          </div>
        )}
      </div>
    );
  },
);
Page.displayName = "Page";

interface CoverProps {
  groomName: string;
  brideName: string;
  dateText: string;
  isBack?: boolean;
  onCoverClick?: () => void;
}

const Cover = React.forwardRef<HTMLDivElement, CoverProps>(
  ({ groomName, brideName, dateText, isBack = false, onCoverClick }, ref) => {
    const guard = useClickGuard();
    return (
      <div
        ref={ref}
        data-density="hard"
        onMouseDown={(e) => guard.begin(e.clientX, e.clientY)}
        onTouchStart={(e) =>
          guard.begin(e.touches[0].clientX, e.touches[0].clientY)
        }
        onClick={(e) => {
          if (guard.isRealClick(e.clientX, e.clientY)) onCoverClick?.();
        }}
        className="page relative h-full w-full overflow-hidden bg-gradient-to-br from-[#4a040e] via-[#2c0207] to-[#120003] shadow-[inset_10px_0_28px_rgba(0,0,0,0.8),inset_0_0_45px_rgba(0,0,0,0.75)] border-[3px] border-[#b8923a]/55 border-l-[16px] border-l-amber-950 p-7 sm:p-10 flex flex-col items-center justify-between text-center select-none cursor-pointer"
      >
        {/* Heavy velvet sheen & leather-bound spine edge */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.07),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
        <div className="pointer-events-none absolute inset-3.5 border border-[#d4af37]/45" />
        <div className="pointer-events-none absolute inset-5 border border-[#d4af37]/20" />

        {/* Top Edition Tag */}
        <div className="relative z-10 pt-3 font-serif text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#d4af37]/85">
          {isBack ? "Forever & Always" : "Private Collection"}
        </div>

        {/* Center Emblem + Couple Typography */}
        <div className="relative z-10 flex flex-col items-center gap-5 px-2">
          <InterlockingRingsSVG className="w-16 h-10 sm:w-20 sm:h-12 drop-shadow-[0_2px_10px_rgba(212,175,55,0.35)]" />

          {isBack ? (
            <>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#f6e27a] via-[#d4af37] to-[#f6e27a] bg-clip-text text-transparent">
                {groomName} &amp; {brideName}
              </h3>
              <p className="font-serif text-xs sm:text-sm text-amber-100/70 max-w-[240px] leading-relaxed">
                Every photograph is a timeless chapter in our story.
              </p>
            </>
          ) : (
            <>
              <h3 className="font-serif text-3xl sm:text-4xl font-black tracking-wide bg-gradient-to-r from-[#fae8a4] via-[#d4af37] to-[#f5d061] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                {groomName} &amp; {brideName}
              </h3>
              <div className="h-px w-28 bg-gradient-to-r from-transparent via-[#d4af37]/75 to-transparent" />
              <span className="font-mono text-xs sm:text-sm tracking-[0.3em] text-amber-200/85">
                {dateText}
              </span>
            </>
          )}
        </div>

        {/* Bottom Foil Stamp */}
        <div className="relative z-10 pb-3 flex flex-col items-center gap-1">
          <span className="font-serif text-[10px] tracking-[0.3em] text-[#d4af37]/65 uppercase">
            {isBack ? "✦ Fin ✦" : "Click or Drag Corner to Open"}
          </span>
        </div>
      </div>
    );
  },
);
Cover.displayName = "Cover";

export default function PhotoAlbumSection() {
  const { config } = useWeddingConfig();
  const [selectedImage, setSelectedImage] = useState<AlbumPhoto | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [userMuted, setUserMuted] = useState(false);
  const [isAutoFlip, setIsAutoFlip] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipBookRef = useRef<any>(null);

  const albumAudioSrc = config.albumAudioUrl || "/audio/track-d-cinema.mp3";

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const albumPhotos: AlbumPhoto[] = useMemo(() => {
    const raw = (config.gallery || []).filter((item) => item?.url);
    return raw.length > 0 ? raw : FALLBACK_PHOTOS;
  }, [config.gallery]);

  const photoPages: AlbumPhoto[][] = useMemo(() => {
    const pages: AlbumPhoto[][] = [];
    for (let i = 0; i < albumPhotos.length; i += 2) {
      pages.push(albumPhotos.slice(i, i + 2));
    }
    return pages;
  }, [albumPhotos]);

  const totalBookPages = photoPages.length + 2;

  // Auto-Flip interval (every 4.5 seconds)
  useEffect(() => {
    if (!isAutoFlip || selectedImage) return;

    const timer = window.setInterval(() => {
      const pageFlip = flipBookRef.current?.pageFlip?.();
      if (!pageFlip) return;

      const idx = pageFlip.getCurrentPageIndex?.() ?? currentPage;
      if (idx >= totalBookPages - 1) {
        pageFlip.turnToPage?.(0);
      } else {
        pageFlip.flipNext?.();
      }
    }, 4500);

    return () => window.clearInterval(timer);
  }, [isAutoFlip, selectedImage, currentPage, totalBookPages]);

  const formattedDate = useMemo(() => {
    const rawDate = config.weddingDate || config.engagementDate;
    if (!rawDate) return "FOREVER TOGETHER";
    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) return rawDate;
    return parsed
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      .toUpperCase();
  }, [config.weddingDate, config.engagementDate]);

  const handleManualFlip = useCallback((direction: "prev" | "next") => {
    setIsAutoFlip(false);
    const pageFlip = flipBookRef.current?.pageFlip?.();
    if (!pageFlip) return;
    if (direction === "prev") {
      pageFlip.flipPrev?.();
    } else {
      pageFlip.flipNext?.();
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    const audio = audioRef.current;
    if (!el || !audio) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userMuted) {
          globalAudioCoordinator.playTrack(audio, undefined, () => {
            setIsPlaying(false);
          });
          setIsMuted(false);
        } else if (!entry.isIntersecting && !audio.paused) {
          audio.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [userMuted, albumAudioSrc]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying || audio.paused) {
      setUserMuted(false);
      setIsMuted(false);
      globalAudioCoordinator.setMuted(false);
      globalAudioCoordinator.playTrack(audio, undefined, () => {
        setIsPlaying(false);
      });
      return;
    }

    setUserMuted(true);
    audio.muted = true;
    setIsMuted(true);
    audio.pause();
    setIsPlaying(false);
  };

  return (
    <section
      ref={sectionRef}
      id="section-photo-album"
      className="relative w-full min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-zinc-950 via-[#0d0b0c] to-black py-14 px-4 sm:px-8 flex flex-col items-center justify-center border-t border-amber-500/15"
    >
      {/* Subtle monochrome luxury ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_65%)]" />

      {/* Background Instrumental Track (Configured via Admin Panel albumAudioUrl) */}
      <audio
        ref={audioRef}
        src={albumAudioSrc}
        loop
        preload="none"
      />

      {/* Top-Right Album Controls: Auto-Play + Audio Mute/Unmute */}
      <div className="relative sm:absolute sm:top-6 sm:right-6 z-30 mb-6 sm:mb-0 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setIsAutoFlip((prev) => !prev)}
          aria-pressed={isAutoFlip}
          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium backdrop-blur-md transition-all cursor-pointer ${isAutoFlip
              ? "border-[#d4af37] bg-[#d4af37]/20 text-[#fae8a4] shadow-[0_0_16px_rgba(212,175,55,0.25)]"
              : "border-zinc-700/80 bg-zinc-900/80 text-zinc-300 hover:border-[#d4af37]/60 hover:text-amber-200"
            }`}
        >
          {isAutoFlip ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Auto-Play On</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Auto-Play ↻</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={toggleAudio}
          aria-label={isPlaying && !isMuted ? "Mute Album Audio" : "Play Album Audio"}
          className="flex items-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-900/80 backdrop-blur-md px-3.5 py-2 text-xs font-medium text-amber-200/90 shadow-lg transition-all hover:border-[#d4af37]/60 hover:bg-zinc-900 cursor-pointer"
        >
          {isPlaying && !isMuted ? (
            <>
              <Volume2 className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden sm:inline">Mute</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-zinc-400" />
              <span className="hidden sm:inline">Music</span>
            </>
          )}
        </button>
      </div>

      {/* Section Header */}
      <div className="relative z-20 mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-zinc-900/80 px-4 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-[#d4af37]">
          <BookOpen className="w-3.5 h-3.5" />
          The Heirloom Album
        </span>
        <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-black text-zinc-100 tracking-tight">
          كتاب الذكريات
        </h2>
        <p className="mt-1.5 font-serif text-xs sm:text-sm text-zinc-400">
          اضغط على هوامش الصفحة للتقليب • اضغط مرتين على أي صورة لتكبيرها
        </p>
      </div>

      {/* Heavy Hardcover 3D Book Stage */}
      <div className="relative z-20 w-full max-w-[980px] flex items-center justify-center py-2 px-3">
        <div className="relative w-full">
          {/* ---- Volume layers rendered OUTSIDE the flipbook so react-pageflip never clips them ---- */}
          {/* Ground shadow */}
          <div className="pointer-events-none absolute -bottom-8 inset-x-6 h-10 rounded-[50%] bg-black/80 blur-2xl" />
          {/* Bottom stacked page block + hardcover board edge */}
          <div
            className="pointer-events-none absolute -bottom-3.5 inset-x-1 h-4 rounded-b-md border-x border-b border-amber-950/80"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, #e9e1cd 0 2px, #b9ad92 2px 3px)",
              boxShadow:
                "0 2px 0 #3a0a0f, 0 5px 0 #240206, 0 9px 0 #140103, 0 14px 22px rgba(0,0,0,0.85)",
            }}
          />
          {/* Right page-block thickness */}
          <div
            className="pointer-events-none absolute top-2 -right-3 bottom-0 w-3.5 rounded-r-md border-y border-r border-amber-950/80"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, #e9e1cd 0 2px, #b9ad92 2px 3px)",
              boxShadow: "5px 0 0 #240206, 9px 0 0 #140103",
            }}
          />
          {/* Left board thickness */}
          <div
            className="pointer-events-none absolute top-2 -left-3 bottom-0 w-3.5 rounded-l-md border-y border-l border-amber-950/80 bg-gradient-to-r from-[#140103] to-amber-950"
            style={{ boxShadow: "-5px 0 0 #140103" }}
          />

          <div className="relative z-10 flex justify-center">
            <HTMLFlipBook
              ref={flipBookRef}
              width={500}
              height={700}
              size="stretch"
              minWidth={315}
              maxWidth={1000}
              minHeight={400}
              maxHeight={1533}
              maxShadowOpacity={0.7}
              showCover={true}
              mobileScrollSupport={true}
              usePortrait={isMobile}
              drawShadow={true}
              flippingTime={900}
              startPage={0}
              startZIndex={0}
              autoSize={true}
              clickEventForward={false}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={true}
              style={{}}
              onFlip={(e: { data: number }) => setCurrentPage(e.data)}
              className="mx-auto"
            >
              <Cover
                groomName={config.groomName}
                brideName={config.brideName}
                dateText={formattedDate}
                onCoverClick={() => handleManualFlip("next")}
              />

              {photoPages.map((photosOnPage, pageIdx) => (
                <Page
                  key={`album-page-${pageIdx}`}
                  pageNumber={pageIdx + 1}
                  onMarginClick={(side) =>
                    handleManualFlip(side === "left" ? "prev" : "next")
                  }
                >
                  {photosOnPage.map((photo, idx) => (
                    <div
                      key={photo.id || `${pageIdx}-${idx}`}
                      onClick={(e) => e.stopPropagation()}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setIsAutoFlip(false);
                        setSelectedImage(photo);
                      }}
                      title="Double-click to enlarge"
                      className="group relative h-full min-h-0 w-full bg-white p-2 pb-2 rounded-xs shadow-md border border-stone-200/90 cursor-zoom-in transition-transform duration-300 hover:scale-[1.015] flex flex-col overflow-hidden"
                    >
                      <div className="relative flex-1 min-h-0 w-full overflow-hidden bg-stone-100 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.url}
                          alt={
                            photo.caption ||
                            `Wedding memory ${pageIdx * 2 + idx + 1}`
                          }
                          draggable={false}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <span className="pointer-events-none absolute bottom-1.5 right-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[10px] tracking-wider text-amber-200/90 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          2× Click
                        </span>
                      </div>
                      <div className="shrink-0 pt-1.5 px-1 flex items-center justify-between gap-2 text-stone-700">
                        <span className="font-serif text-[11px] font-semibold truncate">
                          {photo.caption || `${config.groomName} & ${config.brideName}`}
                        </span>
                        {photo.date && (
                          <span className="font-mono text-[10px] text-stone-400 shrink-0">
                            {photo.date}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </Page>
              ))}

              <Cover
                groomName={config.groomName}
                brideName={config.brideName}
                dateText={formattedDate}
                isBack={true}
                onCoverClick={() => handleManualFlip("prev")}
              />
            </HTMLFlipBook>
          </div>
        </div>
      </div>

      {/* Flip Navigation Controls */}
      <div className="relative z-20 mt-7 flex items-center gap-5">
        <button
          type="button"
          onClick={() => handleManualFlip("prev")}
          className="flex items-center gap-1.5 rounded-full border border-zinc-700/80 bg-zinc-900/80 px-4 py-2 text-xs font-medium text-amber-200/90 hover:border-[#d4af37]/60 hover:bg-zinc-900 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>
        <span className="font-mono text-xs tracking-widest text-zinc-400">
          {currentPage + 1} / {totalBookPages}
        </span>
        <button
          type="button"
          onClick={() => handleManualFlip("next")}
          className="flex items-center gap-1.5 rounded-full border border-zinc-700/80 bg-zinc-900/80 px-4 py-2 text-xs font-medium text-amber-200/90 hover:border-[#d4af37]/60 hover:bg-zinc-900 transition-all cursor-pointer"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Closing Monogram Footer */}
      <div className="relative z-20 mt-10 text-center text-[11px] font-serif tracking-[0.25em] text-zinc-500 uppercase">
        ✦ {config.groomName} &amp; {config.brideName} • {formattedDate} ✦
      </div>

      {/* Root-Level Lightbox Modal (Outside HTMLFlipBook; click backdrop or image to dismiss) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            key="album-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.url}
                alt={selectedImage.caption || "Enlarged album photo"}
                className="max-h-[80vh] w-auto rounded-md object-contain shadow-[0_25px_80px_rgba(0,0,0,0.95)] border border-[#d4af37]/30"
              />
              {(selectedImage.caption || selectedImage.date) && (
                <div className="mt-3 text-center text-zinc-100">
                  {selectedImage.caption && (
                    <p className="font-serif text-base font-semibold">
                      {selectedImage.caption}
                    </p>
                  )}
                  {selectedImage.date && (
                    <p className="font-mono text-xs text-amber-200/70 mt-0.5">
                      {selectedImage.date}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
