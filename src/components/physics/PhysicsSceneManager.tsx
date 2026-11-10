"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Scene1HeroSpotlight } from "./Scene1HeroSpotlight";
import TimelessBondSection from "./TimelessBondSection";
import SaidiHeritageSection from "./SaidiHeritageSection";
import GoldenAgeCinemaSection from "./GoldenAgeCinemaSection";
import FalahiHeritageSection from "./FalahiHeritageSection";
import ZamalekThemeSection from "./ZamalekThemeSection";
import AlAhlyThemeSection from "./AlAhlyThemeSection";
import IndianThemeSection from "./IndianThemeSection";
import MexicanThemeSection from "./MexicanThemeSection";
import WeddingRaceSection from "./WeddingRaceSection";
import { Scene3PhysicsDesk } from "./Scene3PhysicsDesk";
import { Scene4ZTunnel } from "./Scene4ZTunnel";
import { Scene5InfiniteCanvas } from "./Scene5InfiniteCanvas";
import { KeyboardShortcutsPill } from "./KeyboardShortcutsPill";
import { FloatingPetals } from "@/components/layout/FloatingPetals";
import { Volume2, VolumeX, Maximize2, Minimize2, Heart } from "lucide-react";
import { sceneAudio } from "@/utils/sceneAudioController";
import { useGlobalAudio } from "@/utils/globalAudioCoordinator";
import {
  useWeddingConfig,
  ThemeId,
  AVAILABLE_THEMES,
  MAX_ACTIVE_THEMES,
} from "@/context/WeddingConfigContext";

interface ThemeSectionProps {
  onNext?: () => void;
  scrollContainerRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
}

const THEME_COMPONENTS: Record<ThemeId, React.ComponentType<ThemeSectionProps>> = {
  pharaonic: TimelessBondSection,
  saidi: SaidiHeritageSection,
  cinema: GoldenAgeCinemaSection,
  falahi: FalahiHeritageSection,
  zamalek: ZamalekThemeSection,
  ahly: AlAhlyThemeSection,
  indian: IndianThemeSection,
  mexican: MexicanThemeSection,
};

export const PhysicsSceneManager: React.FC = () => {
  const { config } = useWeddingConfig();
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const { isEnabled: isPlayingMusic, toggleAudio: toggleMusic } = useGlobalAudio();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionElsRef = useRef<(HTMLDivElement | null)[]>([]);

  const activeThemes = useMemo(
    () => (config.activeThemes || []).slice(0, MAX_ACTIVE_THEMES),
    [config.activeThemes]
  );

  const sceneTitles = useMemo(() => {
    const themeLabels = activeThemes.map((id, i) => {
      const meta = AVAILABLE_THEMES.find((t) => t.id === id);
      const num = String(i + 2).padStart(2, "0");
      return `${num} ${meta?.hudTitle || id}`;
    });
    const baseOffset = 2 + activeThemes.length;
    return [
      "01 Spotlight",
      ...themeLabels,
      `${String(baseOffset).padStart(2, "0")} تحدي الأزواج`,
      `${String(baseOffset + 1).padStart(2, "0")} Physics Desk`,
      `${String(baseOffset + 2).padStart(2, "0")} 3D Tunnel`,
      `${String(baseOffset + 3).padStart(2, "0")} Infinite Canvas`,
    ];
  }, [activeThemes]);

  const scrollToSection = useCallback((idx: number) => {
    setCurrentScene(idx);
    const target = sectionElsRef.current[idx];
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleNavClick = (idx: number) => {
    scrollToSection(idx);
  };

  // Organic scroll listener to synchronize HUD and dynamic audio
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const totalCount = 1 + activeThemes.length + 4;

    const handleScroll = () => {
      const scrollPos = container.scrollTop + container.clientHeight * 0.35;
      for (let i = totalCount - 1; i >= 0; i--) {
        const el = sectionElsRef.current[i];
        if (el && el.offsetTop <= scrollPos) {
          setCurrentScene(i);
          break;
        }
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeThemes.length]);

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
    container.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
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

      if (e.key === "ArrowDown") {
        e.preventDefault();
        container.scrollBy({ top: 180, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        container.scrollBy({ top: -180, behavior: "smooth" });
      } else if (e.key === "PageDown") {
        e.preventDefault();
        const scrollAmount = Math.max(400, container.clientHeight * 0.85);
        container.scrollBy({ top: scrollAmount, behavior: "smooth" });
      } else if (e.key === "PageUp") {
        e.preventDefault();
        const scrollAmount = Math.max(400, container.clientHeight * 0.85);
        container.scrollBy({ top: -scrollAmount, behavior: "smooth" });
      } else if (e.key === " " || e.key === "Spacebar") {
        if (target?.tagName.toLowerCase() !== "button") {
          e.preventDefault();
          const scrollAmount = Math.max(400, container.clientHeight * 0.85);
          const direction = e.shiftKey ? -1 : 1;
          container.scrollBy({ top: scrollAmount * direction, behavior: "smooth" });
        }
      } else if (e.key === "Home") {
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

  const raceIndex = 1 + activeThemes.length;
  const deskIndex = raceIndex + 1;
  const tunnelIndex = raceIndex + 2;
  const canvasIndex = raceIndex + 3;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#24181B] text-[#FDECEF] flex flex-col justify-between select-none">
      {/* Global Ambient Floating Rose Petals & Gold Sparkles */}
      <FloatingPetals />

      {/* TOP LUXURY CINEMATIC HUD */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 px-6 lg:px-12 flex items-center justify-between pointer-events-auto bg-black/35 backdrop-blur-xl border-b border-romantic-roseGold/25">
        {/* Monogram Brand */}
        <div
          onClick={() => handleNavClick(0)}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-romantic-roseGold/40 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          </div>
          <span className="font-serif text-sm sm:text-base font-bold text-white tracking-wide">
            {config.groomName} &amp; {config.brideName}
          </span>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-romantic-roseGold/20 text-romantic-roseGoldLight font-semibold">
            {config.gallery.length} Memories
          </span>
        </div>

        {/* Dynamic Scene Switcher Buttons */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-white/10 backdrop-blur-md border border-romantic-roseGold/25 shadow-sm overflow-x-auto max-w-[60vw] no-scrollbar">
          {sceneTitles.map((title, idx) => {
            const isActive = currentScene === idx;
            const isCompleted = idx < currentScene;

            return (
              <button
                key={`${title}-${idx}`}
                onClick={() => handleNavClick(idx)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
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
        <div className="flex items-center gap-2 shrink-0">
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

      {/* ACTIVE STAGE VIEWPORT */}
      <main className="relative w-full h-full pt-16 flex items-center justify-center overflow-hidden">
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          className="w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth outline-none focus:outline-none"
        >
          {/* Section 1: Hero Spotlight */}
          <div
            ref={(el) => {
              sectionElsRef.current[0] = el;
            }}
            id="scene-1-spotlight"
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden"
          >
            <Scene1HeroSpotlight onNext={() => scrollToSection(1)} />
          </div>

          {/* Dynamic Selected Cultural Themes (Max 5 from config.activeThemes) */}
          {activeThemes.map((themeId, themeIdx) => {
            const ThemeComponent = THEME_COMPONENTS[themeId];
            if (!ThemeComponent) return null;
            const sceneIdx = 1 + themeIdx;
            return (
              <div
                key={themeId}
                ref={(el) => {
                  sectionElsRef.current[sceneIdx] = el;
                }}
                id={`scene-theme-${themeId}`}
                className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden"
              >
                <ThemeComponent
                  onNext={() => scrollToSection(sceneIdx + 1)}
                  scrollContainerRef={scrollContainerRef}
                />
              </div>
            );
          })}

          {/* Wedding Race (تحدي الأزواج) */}
          <div
            ref={(el) => {
              sectionElsRef.current[raceIndex] = el;
            }}
            id="section-race"
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden"
          >
            <WeddingRaceSection />
          </div>

          {/* Physics Desk */}
          <motion.div
            ref={(el) => {
              sectionElsRef.current[deskIndex] = el;
            }}
            id="section-desk"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden"
          >
            <Scene3PhysicsDesk />
          </motion.div>

          {/* Z-Axis Memory Tunnel */}
          <motion.div
            ref={(el) => {
              sectionElsRef.current[tunnelIndex] = el;
            }}
            id="section-tunnel"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-x-hidden"
          >
            <Scene4ZTunnel />
          </motion.div>

          {/* Infinite Canvas */}
          <motion.div
            ref={(el) => {
              sectionElsRef.current[canvasIndex] = el;
            }}
            id="section-canvas"
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
