"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Scene1HeroSpotlight } from "./Scene1HeroSpotlight";
import TimelessBondSection from "./TimelessBondSection";
import SaidiHeritageSection from "./SaidiHeritageSection";
import GoldenAgeCinemaSection from "./GoldenAgeCinemaSection";
import FalahiHeritageSection from "./FalahiHeritageSection";
import ZamalekThemeSection from "./ZamalekThemeSection";
import WeddingRaceSection from "./WeddingRaceSection";
import { Scene3PhysicsDesk } from "./Scene3PhysicsDesk";
import { Scene4ZTunnel } from "./Scene4ZTunnel";
import { Scene5InfiniteCanvas } from "./Scene5InfiniteCanvas";
import { KeyboardShortcutsPill } from "./KeyboardShortcutsPill";
import { FloatingPetals } from "@/components/layout/FloatingPetals";
import { Volume2, VolumeX, Maximize2, Minimize2, Heart } from "lucide-react";
import { sceneAudio } from "@/utils/sceneAudioController";
import { useGlobalAudio } from "@/utils/globalAudioCoordinator";

const SCENE_TITLES = [
  "01 Spotlight",
  "02 Egyptian Heritage",
  "03 Saidi Heritage",
  "04 Golden Age Cinema",
  "05 أفراح الريف",
  "06 Zamalek SC",
  "07 تحدي الأزواج",
  "08 Physics Desk",
  "09 3D Tunnel",
  "10 Infinite Canvas",
];

export const PhysicsSceneManager: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const { isEnabled: isPlayingMusic, toggleAudio: toggleMusic } = useGlobalAudio();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);
  const section7Ref = useRef<HTMLDivElement>(null);
  const section8Ref = useRef<HTMLDivElement>(null);
  const section9Ref = useRef<HTMLDivElement>(null);
  const section10Ref = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback((idx: number) => {
    setCurrentScene(idx);
    const refs = [
      section1Ref,
      section2Ref,
      section3Ref,
      section4Ref,
      section5Ref,
      section6Ref,
      section7Ref,
      section8Ref,
      section9Ref,
      section10Ref,
    ];
    const target = refs[idx]?.current;
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleNavClick = (idx: number) => {
    scrollToSection(idx);
  };

  // Organic scroll listener to automatically synchronize HUD and dynamic audio
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const refs = [
      section1Ref,
      section2Ref,
      section3Ref,
      section4Ref,
      section5Ref,
      section6Ref,
      section7Ref,
      section8Ref,
      section9Ref,
      section10Ref,
    ];

    const handleScroll = () => {
      const scrollPos = container.scrollTop + container.clientHeight * 0.35;
      for (let i = refs.length - 1; i >= 0; i--) {
        const el = refs[i]?.current;
        if (el && el.offsetTop <= scrollPos) {
          setCurrentScene(i);
          break;
        }
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic Scene Audio Crossfade Controller (for Web Audio synthesizer scenes)
  useEffect(() => {
    if (sceneAudio) {
      sceneAudio.transitionToScene(currentScene, isPlayingMusic);
    }
  }, [currentScene, isPlayingMusic]);

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Global keydown listeners for smooth keyboard scrolling & accessibility
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Focus container on mount so keyboard navigation is active immediately
    container.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not intercept keystrokes if the user is typing in form fields
      const target = e.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toLowerCase();
        if (
          tagName === "input" ||
          tagName === "textarea" ||
          tagName === "select" ||
          target.isContentEditable
        ) {
          return;
        }
      }

      // 1. Arrow keys: smooth incremental scrolling
      if (e.key === "ArrowDown") {
        e.preventDefault();
        container.scrollBy({ top: 180, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        container.scrollBy({ top: -180, behavior: "smooth" });
      }
      // 2. PageDown / PageUp: smooth large viewport jumps (~85% viewport)
      else if (e.key === "PageDown") {
        e.preventDefault();
        const scrollAmount = Math.max(400, container.clientHeight * 0.85);
        container.scrollBy({ top: scrollAmount, behavior: "smooth" });
      } else if (e.key === "PageUp") {
        e.preventDefault();
        const scrollAmount = Math.max(400, container.clientHeight * 0.85);
        container.scrollBy({ top: -scrollAmount, behavior: "smooth" });
      }
      // 3. Space / Shift+Space: smooth scroll down / up
      else if (e.key === " " || e.key === "Spacebar") {
        // Do not intercept if actively pressing a button
        if (target?.tagName.toLowerCase() !== "button") {
          e.preventDefault();
          const scrollAmount = Math.max(400, container.clientHeight * 0.85);
          const direction = e.shiftKey ? -1 : 1;
          container.scrollBy({ top: scrollAmount * direction, behavior: "smooth" });
        }
      }
      // 4. Home / End: smooth jump to beginning or end
      else if (e.key === "Home") {
        e.preventDefault();
        container.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key === "End") {
        e.preventDefault();
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#24181B] text-[#FDECEF] flex flex-col justify-between select-none">
      {/* Global Ambient Floating Rose Petals & Gold Sparkles */}
      <FloatingPetals />

      {/* TOP LUXURY CINEMATIC HUD */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 px-6 lg:px-12 flex items-center justify-between pointer-events-auto bg-black/35 backdrop-blur-xl border-b border-romantic-roseGold/25">
        {/* Monogram Brand */}
        <div
          onClick={() => handleNavClick(0)}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-romantic-roseGold/40 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          </div>
          <span className="font-serif text-sm sm:text-base font-bold text-white tracking-wide">
            Sophia &amp; Julian
          </span>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-romantic-roseGold/20 text-romantic-roseGoldLight font-semibold">
            80 Physics Scenes
          </span>
        </div>

        {/* 5 Physics Scene Switcher Buttons */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-white/10 backdrop-blur-md border border-romantic-roseGold/25 shadow-sm">
          {SCENE_TITLES.map((title, idx) => {
            const isActive = currentScene === idx;
            const isCompleted = idx < currentScene;

            return (
              <button
                key={idx}
                onClick={() => handleNavClick(idx)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-romantic-roseGold to-romantic-roseGoldLight text-romantic-charcoal shadow-md ring-1 ring-white/30"
                    : isCompleted
                    ? "text-white/80 hover:bg-white/10"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                {title}
              </button>
            );
          })}
        </div>

        {/* HUD Controls: Soundtrack & Cinema Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Soundtrack Equalizer */}
          <button
            onClick={toggleMusic}
            aria-label="Toggle romantic music"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-romantic-roseGold/30 shadow-sm text-xs font-medium text-white transition-all cursor-pointer"
          >
            <div className="flex items-end gap-0.5 h-3.5 w-3">
              {[40, 95, 60].map((h, i) => (
                <span
                  key={i}
                  className="w-0.5 bg-romantic-roseGold rounded-full transition-all duration-300"
                  style={{
                    height: isPlayingMusic ? `${h}%` : "30%",
                  }}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold hidden sm:inline text-romantic-roseGoldLight">
              {isPlayingMusic ? "Waltz Playing" : "Play Sound"}
            </span>
            {isPlayingMusic ? (
              <Volume2 className="w-3.5 h-3.5 text-romantic-roseGoldLight" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-romantic-roseGold/30 shadow-sm text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Toggle Cinema Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-white" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
      </header>

      {/* ACTIVE STAGE VIEWPORT (All 9 Sections in Natural Vertical Scroll Flow) */}
      <main className="relative w-full h-full pt-16 flex items-center justify-center overflow-hidden">
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          className="w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth outline-none focus:outline-none"
        >
          {/* Section 1: Hero Spotlight */}
          <div
            ref={section1Ref}
            id="scene-1-spotlight"
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden"
          >
            <Scene1HeroSpotlight onNext={() => scrollToSection(1)} />
          </div>

          {/* Section 2: Timeless Bond (Egyptian Pharaonic Heritage) */}
          <div
            ref={section2Ref}
            id="scene-2-timeless"
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden"
          >
            <TimelessBondSection
              onNext={() => scrollToSection(2)}
              scrollContainerRef={scrollContainerRef}
            />
          </div>

          {/* Section 3: Saidi Heritage (أصالة وجذور) */}
          <div
            ref={section3Ref}
            id="scene-3-saidi"
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden"
          >
            <SaidiHeritageSection
              onNext={() => scrollToSection(3)}
              scrollContainerRef={scrollContainerRef}
            />
          </div>

          {/* Section 4: Golden Age Egyptian Cinema (زمن الفن الجميل) */}
          <div
            ref={section4Ref}
            id="scene-4-cinema"
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden"
          >
            <GoldenAgeCinemaSection
              onNext={() => scrollToSection(4)}
              scrollContainerRef={scrollContainerRef}
            />
          </div>

          {/* Section 5: Egyptian Rural/Delta Heritage (الفلاحي - أفراح الريف) */}
          <div
            ref={section5Ref}
            id="scene-5-falahi"
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden"
          >
            <FalahiHeritageSection
              onNext={() => scrollToSection(5)}
              scrollContainerRef={scrollContainerRef}
            />
          </div>

          {/* Section 6: Zamalek SC (مدرسة الفن والهندسة - The White Knights) */}
          <div
            ref={section6Ref}
            id="scene-6-zamalek"
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden"
          >
            <ZamalekThemeSection
              onNext={() => scrollToSection(6)}
              scrollContainerRef={scrollContainerRef}
            />
          </div>

          {/* Section 7: Wedding Race (تحدي الأزواج) */}
          <div
            ref={section7Ref}
            id="section-7-race"
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden"
          >
            <WeddingRaceSection />
          </div>

          {/* Section 8: Physics Desk (Scrapbook Desk - whileInView) */}
          <motion.div
            ref={section8Ref}
            id="section-8-desk"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden"
          >
            <Scene3PhysicsDesk />
          </motion.div>

          {/* Section 9: Z-Axis Memory Tunnel (whileInView) */}
          <motion.div
            ref={section9Ref}
            id="section-9-tunnel"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden"
          >
            <Scene4ZTunnel />
          </motion.div>

          {/* Section 10: Infinite Canvas (whileInView) */}
          <motion.div
            ref={section10Ref}
            id="section-10-canvas"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden"
          >
            <Scene5InfiniteCanvas onRestart={() => scrollToSection(0)} />
          </motion.div>
        </div>
      </main>

      {/* Floating Keyboard Shortcuts Pill */}
      <KeyboardShortcutsPill />
    </div>
  );
};

