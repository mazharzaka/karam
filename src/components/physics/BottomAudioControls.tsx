"use client";

import React from "react";
import { Play, Square, Volume2, VolumeX, Minus, Plus } from "lucide-react";

export interface BottomAudioControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  onTogglePlayStop: () => void;
  onIncreaseVolume: () => void;
  onDecreaseVolume: () => void;
  variant?: "light" | "dark";
}

export const BottomAudioControls: React.FC<BottomAudioControlsProps> = ({
  isPlaying,
  isMuted,
  volume,
  onTogglePlayStop,
  onIncreaseVolume,
  onDecreaseVolume,
  variant = "light",
}) => {
  const volumePercent = Math.round(volume * 100);
  const isLight = variant === "light";

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 backdrop-blur-md shadow-sm border transition-all ${
        isLight
          ? "bg-white/85 border-stone-300/60 text-[#2B1D24]"
          : "bg-black/55 border-white/20 text-white"
      }`}
    >
      {/* Bottom Control: Play / Stop (pauses & resets time to 0) */}
      <button
        type="button"
        onClick={onTogglePlayStop}
        aria-label={isPlaying ? "Stop track" : "Play track"}
        title={isPlaying ? "Stop (pause & reset)" : "Play track"}
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
          isLight
            ? "bg-[#2B1D24]/10 hover:bg-[#2B1D24]/15 text-[#2B1D24]"
            : "bg-white/15 hover:bg-white/25 text-white"
        }`}
      >
        {isPlaying ? (
          <>
            <Square className="w-3 h-3 fill-current" />
            <span>Stop</span>
          </>
        ) : (
          <>
            <Play className="w-3 h-3 fill-current" />
            <span>Play</span>
          </>
        )}
      </button>

      <span
        className={`h-3.5 w-px ${isLight ? "bg-stone-300" : "bg-white/20"}`}
      />

      {/* Volume - / + Controls (0.0 to 1.0 in 0.1 steps) */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onDecreaseVolume}
          disabled={volume <= 0}
          aria-label="Decrease volume"
          title="Decrease volume (-10%)"
          className={`flex h-6 w-6 items-center justify-center rounded-full transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
            isLight ? "hover:bg-black/10" : "hover:bg-white/15"
          }`}
        >
          <Minus className="w-3 h-3" />
        </button>

        <div className="flex items-center gap-1 px-1 min-w-[46px] justify-center font-mono text-[10px] font-semibold">
          {isMuted || volume === 0 ? (
            <VolumeX className="w-3 h-3 opacity-70" />
          ) : (
            <Volume2 className="w-3 h-3 opacity-80" />
          )}
          <span>{isMuted ? "Mute" : `${volumePercent}%`}</span>
        </div>

        <button
          type="button"
          onClick={onIncreaseVolume}
          disabled={volume >= 1}
          aria-label="Increase volume"
          title="Increase volume (+10%)"
          className={`flex h-6 w-6 items-center justify-center rounded-full transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
            isLight ? "hover:bg-black/10" : "hover:bg-white/15"
          }`}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

