"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Scene1HeroSpotlight } from "./Scene1HeroSpotlight";
import TimelessBondSection from "./TimelessBondSection";
import SaidiHeritageSection from "./SaidiHeritageSection";
import GoldenAgeCinemaSection from "./GoldenAgeCinemaSection";
import ZamalekThemeSection from "./ZamalekThemeSection";
import { Scene3PhysicsDesk } from "./Scene3PhysicsDesk";
import { Scene4ZTunnel } from "./Scene4ZTunnel";
import { Scene5InfiniteCanvas } from "./Scene5InfiniteCanvas";
import { KeyboardShortcutsPill } from "./KeyboardShortcutsPill";
import { FloatingPetals } from "@/components/layout/FloatingPetals";
import { Volume2, VolumeX, Maximize2, Minimize2, Heart } from "lucide-react";
import { sceneAudio } from "@/utils/sceneAudioController";

const SCENE_TITLES = [
  "01 Spotlight",
  "02 Egyptian Heritage",
  "03 Saidi Heritage",
  "04 Golden Age Cinema",
  "05 Zamalek SC",
  "06 Physics Desk",
  "07 3D Tunnel",
  "08 Infinite Canvas",
];

export const PhysicsSceneManager: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);

  const scrollToSection1 = useCallback(() => {
    setCurrentScene(0);
    if (section1Ref.current) {
      section1Ref.current.scrollIntoView({ behavior: "smooth" });
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const scrollToSection2 = useCallback(() => {
    setCurrentScene(1);
    if (section2Ref.current) {
      section2Ref.current.scrollIntoView({ behavior: "smooth" });
    } else if (scrollContainerRef.current) {
      const top = section2Ref.current
        ? (section2Ref.current as HTMLElement).offsetTop
        : scrollContainerRef.current.clientHeight;
      scrollContainerRef.current.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const scrollToSection3 = useCallback(() => {
    setCurrentScene(2);
    if (section3Ref.current) {
      section3Ref.current.scrollIntoView({ behavior: "smooth" });
    } else if (scrollContainerRef.current) {
      const top = section3Ref.current
        ? (section3Ref.current as HTMLElement).offsetTop
        : scrollContainerRef.current.clientHeight * 2;
      scrollContainerRef.current.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const scrollToSection4 = useCallback(() => {
    setCurrentScene(3);
    if (section4Ref.current) {
      section4Ref.current.scrollIntoView({ behavior: "smooth" });
    } else if (scrollContainerRef.current) {
      const top = section4Ref.current
        ? (section4Ref.current as HTMLElement).offsetTop
        : scrollContainerRef.current.clientHeight * 3;
      scrollContainerRef.current.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const scrollToSection5 = useCallback(() => {
    setCurrentScene(4);
    if (section5Ref.current) {
      section5Ref.current.scrollIntoView({ behavior: "smooth" });
    } else if (scrollContainerRef.current) {
      const top = section5Ref.current
        ? (section5Ref.current as HTMLElement).offsetTop
        : scrollContainerRef.current.clientHeight * 4;
      scrollContainerRef.current.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const handleNavClick = (idx: number) => {
    if (idx === 0) {
      if (currentScene > 4) {
        setCurrentScene(0);
        setTimeout(() => scrollToSection1(), 60);
      } else {
        scrollToSection1();
      }
    } else if (idx === 1) {
      if (currentScene > 4) {
        setCurrentScene(1);
        setTimeout(() => scrollToSection2(), 60);
      } else {
        scrollToSection2();
      }
    } else if (idx === 2) {
      if (currentScene > 4) {
        setCurrentScene(2);
        setTimeout(() => scrollToSection3(), 60);
      } else {
        scrollToSection3();
      }
    } else if (idx === 3) {
      if (currentScene > 4) {
        setCurrentScene(3);
        setTimeout(() => scrollToSection4(), 60);
      } else {
        scrollToSection4();
      }
    } else if (idx === 4) {
      if (currentScene > 4) {
        setCurrentScene(4);
        setTimeout(() => scrollToSection5(), 60);
      } else {
        scrollToSection5();
      }
    } else {
      setCurrentScene(idx);
    }
  };

  // Organic scroll listener to automatically synchronize HUD and dynamic audio
  // when scrolling smoothly between Section 1, 2, 3, 4, and 5
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || currentScene > 4) return;

    const handleScroll = () => {
      const scrollPos = container.scrollTop;
      const height = container.clientHeight;
      if (scrollPos > height * 3.35) {
        if (currentScene !== 4) {
          setCurrentScene(4);
        }
      } else if (scrollPos > height * 2.35) {
        if (currentScene !== 3) {
          setCurrentScene(3);
        }
      } else if (scrollPos > height * 1.35) {
        if (currentScene !== 2) {
          setCurrentScene(2);
        }
      } else if (scrollPos > height * 0.35) {
        if (currentScene !== 1) {
          setCurrentScene(1);
        }
      } else {
        if (currentScene !== 0) {
          setCurrentScene(0);
        }
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentScene]);

  const toggleMusic = () => {
    const nextState = !isPlayingMusic;
    setIsPlayingMusic(nextState);
    if (sceneAudio) {
      sceneAudio.toggleMute(nextState);
    }
  };

  // Dynamic Scene Audio Crossfade Controller:
  // Smoothly crossfades between Scene 1 (Arabic Track) and Scene 2 (Pharaonic Track)
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

  const nextScene = useCallback(() => {
    if (currentScene === 0) {
      scrollToSection2();
    } else if (currentScene === 1) {
      scrollToSection3();
    } else if (currentScene === 2) {
      scrollToSection4();
    } else if (currentScene === 3) {
      scrollToSection5();
    } else {
      setCurrentScene((prev) => Math.min(SCENE_TITLES.length - 1, prev + 1));
    }
  }, [currentScene, scrollToSection2, scrollToSection3, scrollToSection4, scrollToSection5]);

  const prevScene = useCallback(() => {
    if (currentScene === 4) {
      scrollToSection4();
    } else if (currentScene === 3) {
      scrollToSection3();
    } else if (currentScene === 2) {
      scrollToSection2();
    } else if (currentScene === 1) {
      scrollToSection1();
    } else {
      setCurrentScene((prev) => Math.max(0, prev - 1));
    }
  }, [currentScene, scrollToSection1, scrollToSection2, scrollToSection3, scrollToSection4]);

  // Global keydown listeners for scene switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept inside Scene 4 (Tunnel) or Scene 5 (Canvas) unless explicitly using PageDown / PageUp
      if (e.key === "PageDown") {
        e.preventDefault();
        nextScene();
      } else if (e.key === "PageUp") {
        e.preventDefault();
        prevScene();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextScene, prevScene]);

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

      {/* ACTIVE STAGE VIEWPORT */}
      <main className="relative w-full h-full pt-16 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {currentScene <= 4 && (
            <motion.div
              key="scene-1-2-3-4-5-scroll-stream"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5 }}
              ref={scrollContainerRef}
              className="w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth"
            >
              {/* Scene 1: Hero Spotlight */}
              <div
                ref={section1Ref}
                id="scene-1-spotlight"
                className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between"
              >
                <Scene1HeroSpotlight onNext={scrollToSection2} />
              </div>

              {/* Scene 2: Timeless Bond (Egyptian Pharaonic Heritage) */}
              <div
                ref={section2Ref}
                id="scene-2-timeless"
                className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between"
              >
                <TimelessBondSection
                  onNext={scrollToSection3}
                  scrollContainerRef={scrollContainerRef}
                />
              </div>

              {/* Scene 3: Saidi Heritage (أصالة وجذور) */}
              <div
                ref={section3Ref}
                id="scene-3-saidi"
                className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between"
              >
                <SaidiHeritageSection
                  onNext={scrollToSection4}
                  scrollContainerRef={scrollContainerRef}
                />
              </div>

              {/* Scene 4: Golden Age Egyptian Cinema (زمن الفن الجميل) */}
              <div
                ref={section4Ref}
                id="scene-4-cinema"
                className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between"
              >
                <GoldenAgeCinemaSection
                  onNext={scrollToSection5}
                  scrollContainerRef={scrollContainerRef}
                />
              </div>

              {/* Scene 5: Zamalek SC (مدرسة الفن والهندسة - The White Knights) */}
              <div
                ref={section5Ref}
                id="scene-5-zamalek"
                className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between"
              >
                <ZamalekThemeSection
                  onNext={() => setCurrentScene(5)}
                  scrollContainerRef={scrollContainerRef}
                />
              </div>
            </motion.div>
          )}

          {currentScene === 5 && (
            <motion.div
              key="scene-6-desk"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <Scene3PhysicsDesk onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 6 && (
            <motion.div
              key="scene-7-tunnel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <Scene4ZTunnel onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 7 && (
            <motion.div
              key="scene-8-canvas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <Scene5InfiniteCanvas onRestart={() => handleNavClick(0)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Keyboard Shortcuts Pill */}
      <KeyboardShortcutsPill />
    </div>
  );
};

