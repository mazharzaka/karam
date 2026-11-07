"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Scene0Intro } from "./Scene0Intro";
import { Scene1Stats } from "./Scene1Stats";
import { Scene2Timeline } from "./Scene2Timeline";
import { Scene3Desk } from "./Scene3Desk";
import { Scene4Finale } from "./Scene4Finale";
import { FloatingPetals } from "@/components/layout/FloatingPetals";
import { TIMELINE_IMAGES, DESK_POLAROIDS } from "@/data/cinematicData";
import { Volume2, VolumeX, Maximize2, Minimize2, Heart } from "lucide-react";
import { romanticAudio } from "@/utils/audioSynthesizer";

const SCENE_NAMES = [
  "00 Intro",
  "01 Stats",
  "02 Timeline",
  "03 Polaroid Desk",
  "04 Finale",
];

export const SceneManager: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [stepInScene, setStepInScene] = useState<number>(1);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Wheel debounce lock
  const wheelLockRef = useRef<boolean>(false);

  const toggleMusic = () => {
    if (romanticAudio) {
      const active = romanticAudio.toggle();
      setIsPlayingMusic(active);
    }
  };

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

  // ADVANCE FORWARD LOGIC
  const advanceForward = useCallback(() => {
    if (currentScene === 0) {
      // Intro -> Stats
      setCurrentScene(1);
      setStepInScene(1);
    } else if (currentScene === 1) {
      // Stats -> Timeline (Step 1)
      setCurrentScene(2);
      setStepInScene(1);
    } else if (currentScene === 2) {
      // In Scene 2: reveal timeline images one by one
      if (stepInScene < TIMELINE_IMAGES.length) {
        romanticAudio?.playGlideSfx();
        setStepInScene((prev) => prev + 1);
      } else {
        // Timeline finished -> Desk (initial 0 dropped)
        setCurrentScene(3);
        setStepInScene(0);
      }
    } else if (currentScene === 3) {
      // In Scene 3: drop polaroids one by one onto the desk
      if (stepInScene < DESK_POLAROIDS.length) {
        romanticAudio?.playDropSfx();
        setStepInScene((prev) => prev + 1);
      } else {
        // Desk finished -> Finale
        setCurrentScene(4);
        setStepInScene(1);
      }
    }
  }, [currentScene, stepInScene]);

  // STEP BACKWARD LOGIC
  const stepBackward = useCallback(() => {
    if (currentScene === 4) {
      setCurrentScene(3);
      setStepInScene(DESK_POLAROIDS.length);
    } else if (currentScene === 3) {
      if (stepInScene > 0) {
        setStepInScene((prev) => prev - 1);
      } else {
        setCurrentScene(2);
        setStepInScene(TIMELINE_IMAGES.length);
      }
    } else if (currentScene === 2) {
      if (stepInScene > 1) {
        setStepInScene((prev) => prev - 1);
      } else {
        setCurrentScene(1);
        setStepInScene(1);
      }
    } else if (currentScene === 1) {
      setCurrentScene(0);
      setStepInScene(1);
    }
  }, [currentScene, stepInScene]);

  // KEYBOARD NAVIGATION LISTENER
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default scrolling
      if (
        [
          "ArrowDown",
          "ArrowUp",
          "ArrowLeft",
          "ArrowRight",
          " ",
          "PageDown",
          "PageUp",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === " " ||
        e.key === "PageDown"
      ) {
        advanceForward();
      } else if (
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "PageUp"
      ) {
        stepBackward();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [advanceForward, stepBackward]);

  // DEBOUNCED MOUSE WHEEL NAVIGATION LISTENER
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (wheelLockRef.current) return;

      if (e.deltaY > 25) {
        wheelLockRef.current = true;
        advanceForward();
        setTimeout(() => {
          wheelLockRef.current = false;
        }, 550);
      } else if (e.deltaY < -25) {
        wheelLockRef.current = true;
        stepBackward();
        setTimeout(() => {
          wheelLockRef.current = false;
        }, 550);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [advanceForward, stepBackward]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FDECEF] to-[#FCE4EC] text-romantic-charcoal flex flex-col justify-between">
      {/* Global Ambient Floating Petals & Gold Sparkles */}
      <FloatingPetals />

      {/* TOP CINEMATIC HUD BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 px-6 lg:px-12 flex items-center justify-between pointer-events-auto">
        {/* Monogram Brand */}
        <div
          onClick={() => {
            setCurrentScene(0);
            setStepInScene(1);
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-romantic-roseGold/40 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 text-romantic-blushDeep fill-romantic-blushDeep" />
          </div>
          <span className="font-serif text-sm sm:text-base font-bold text-romantic-charcoal tracking-wide">
            Sophia &amp; Julian
          </span>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-romantic-roseGold/20 text-romantic-roseGoldDark font-semibold">
            Wrapped 2025
          </span>
        </div>

        {/* Scene Indicator Dots & Navigation Pill */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/70 backdrop-blur-md border border-romantic-roseGold/25 shadow-sm">
          {SCENE_NAMES.map((name, idx) => {
            const isActive = currentScene === idx;
            const isCompleted = idx < currentScene;

            return (
              <button
                key={idx}
                onClick={() => {
                  setCurrentScene(idx);
                  setStepInScene(idx === 3 ? 0 : 1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-romantic-roseGold to-romantic-roseGoldLight text-romantic-charcoal shadow-sm ring-1 ring-romantic-roseGoldDark/30"
                    : isCompleted
                    ? "text-romantic-charcoal hover:bg-white/60"
                    : "text-romantic-muted hover:text-romantic-charcoal"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>

        {/* HUD Controls: Soundtrack & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Soundtrack Equalizer */}
          <button
            onClick={toggleMusic}
            aria-label="Toggle romantic music"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-romantic-roseGold/30 shadow-sm text-xs font-medium text-romantic-charcoal transition-all cursor-pointer"
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
            <span className="text-[11px] font-semibold hidden sm:inline">
              {isPlayingMusic ? "Soundtrack On" : "Play Sound"}
            </span>
            {isPlayingMusic ? (
              <Volume2 className="w-3.5 h-3.5 text-romantic-roseGoldDark" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-romantic-muted" />
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="p-2 rounded-full bg-white/80 hover:bg-white border border-romantic-roseGold/30 shadow-sm text-romantic-charcoal hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Toggle Cinema Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-romantic-charcoal" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-romantic-charcoal" />
            )}
          </button>
        </div>
      </header>

      {/* MAIN CINEMATIC SCENE VIEWPORT */}
      <main className="relative w-full h-full flex items-center justify-center pt-16">
        <AnimatePresence mode="wait">
          {currentScene === 0 && (
            <Scene0Intro
              onEnter={() => {
                setCurrentScene(1);
                setIsPlayingMusic(true);
              }}
            />
          )}

          {currentScene === 1 && (
            <Scene1Stats
              daysTogether={1245}
              startDate="June 12, 2021"
              onNext={advanceForward}
            />
          )}

          {currentScene === 2 && (
            <Scene2Timeline
              revealedCount={stepInScene}
              onNext={advanceForward}
              onPrev={stepBackward}
            />
          )}

          {currentScene === 3 && (
            <Scene3Desk
              droppedCount={stepInScene}
              onDropNext={() => setStepInScene((prev) => prev + 1)}
              onNext={advanceForward}
            />
          )}

          {currentScene === 4 && (
            <Scene4Finale
              onReplay={() => {
                setCurrentScene(0);
                setStepInScene(1);
              }}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

