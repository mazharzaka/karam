"use client";

import React, { useState } from "react";
import { Command, ChevronUp, ChevronDown } from "lucide-react";

export const KeyboardShortcutsPill: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="fixed bottom-4 left-6 z-40 select-none">
      <div className="flex flex-col items-start gap-1">
        {isOpen && (
          <div className="p-3 rounded-2xl bg-black/85 backdrop-blur-xl border border-romantic-roseGold/30 text-white shadow-2xl text-xs space-y-2 mb-1 animate-fadeIn max-w-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1 text-[11px] font-bold text-romantic-roseGoldLight uppercase tracking-wider">
              <span>Shortcuts</span>
              <span>Cinema Mode</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-stone-300">
              <span>Scroll Down:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/15 font-mono text-[10px] text-white">
                &darr; / Space / PgDn
              </kbd>
            </div>
            <div className="flex items-center justify-between gap-4 text-stone-300">
              <span>Scroll Up:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/15 font-mono text-[10px] text-white">
                &uarr; / Shift+Space / PgUp
              </kbd>
            </div>
            <div className="flex items-center justify-between gap-4 text-stone-300">
              <span>Cinema Fullscreen:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/15 font-mono text-[10px] text-white">
                HUD [⛶]
              </kbd>
            </div>
            <div className="flex items-center justify-between gap-4 text-stone-300">
              <span>Audio Soundtrack:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/15 font-mono text-[10px] text-white">
                HUD [♫]
              </kbd>
            </div>
            <div className="flex items-center justify-between gap-4 text-stone-300">
              <span>Interactive Drag:</span>
              <span className="text-[10px] text-romantic-roseGoldLight">Mouse Hold</span>
            </div>
          </div>
        )}

        {/* Toggle Pill */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-romantic-roseGold/30 text-white/90 hover:text-white text-xs shadow-md transition-all cursor-pointer group"
        >
          <Command className="w-3.5 h-3.5 text-romantic-roseGold group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-medium tracking-wide">
            {isOpen ? "Hide Controls" : "Keyboard Guide"}
          </span>
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
          )}
        </button>
      </div>
    </div>
  );
};

