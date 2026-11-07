"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Scene1HeroSpotlight } from "./Scene1HeroSpotlight";
import { Scene2DraggableFilmstrip } from "./Scene2DraggableFilmstrip";
import { Scene3PhysicsDesk } from "./Scene3PhysicsDesk";
import { Scene4ZTunnel } from "./Scene4ZTunnel";
import { Scene5InfiniteCanvas } from "./Scene5InfiniteCanvas";
import { FloatingPetals } from "@/components/layout/FloatingPetals";
import { Volume2, VolumeX, Maximize2, Minimize2, Heart } from "lucide-react";
import { romanticAudio } from "@/utils/audioSynthesizer";

const SCENE_TITLES = [
  "01 Spotlight (1-2)",
  "02 Filmstrip (3-20)",
  "03 Physics Desk (21-50)",
  "04 3D Tunnel (51-70)",
  "05 Infinite Canvas (71-80)",
];

export const PhysicsSceneManager: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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

  const nextScene = useCallback(() => {
    setCurrentScene((prev) => Math.min(SCENE_TITLES.length - 1, prev + 1));
  }, []);

  const prevScene = useCallback(() => {
    setCurrentScene((prev) => Math.max(0, prev - 1));
  }, []);

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
          onClick={() => setCurrentScene(0)}
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
                onClick={() => setCurrentScene(idx)}
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

      {/* ACTIVE STAGE VIEWPORT (Crossfade via AnimatePresence) */}
      <main className="relative w-full h-full pt-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentScene === 0 && (
            <motion.div
              key="scene-1-spotlight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <Scene1HeroSpotlight onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 1 && (
            <motion.div
              key="scene-2-filmstrip"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <Scene2DraggableFilmstrip onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 2 && (
            <motion.div
              key="scene-3-desk"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <Scene3PhysicsDesk onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 3 && (
            <motion.div
              key="scene-4-tunnel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <Scene4ZTunnel onNext={nextScene} />
            </motion.div>
          )}

          {currentScene === 4 && (
            <motion.div
              key="scene-5-canvas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <Scene5InfiniteCanvas onRestart={() => setCurrentScene(0)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

