"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

/**
 * Universal Global Audio Coordinator for Romantic Wrapped
 *
 * Features:
 * 1. Default Low Volume (`0.2`) across all tracks so music never blasts the user.
 * 2. Autoplay on mount / in-view with graceful DOMException handling & user-gesture recovery.
 * 3. Global Mute (`muted` property synced across all `<audio>` elements).
 * 4. Per-section Play / Stop (`pause()` + reset `currentTime = 0`) state synced via React hooks.
 * 5. Incremental Volume Controls (`+/- 0.1`, strictly clamped between `0.0` and `1.0`).
 */

export const DEFAULT_AUDIO_VOLUME = 0.2;

export function clampVolume(val: number): number {
  const clamped = Math.max(0, Math.min(1, val));
  return Math.round(clamped * 10) / 10;
}

export interface GlobalAudioState {
  isEnabled: boolean;
  isMuted: boolean;
  volume: number;
}

export function fadeVolume(
  audio: HTMLAudioElement,
  startVol: number,
  targetVol: number,
  durationMs: number = 600,
  onComplete?: () => void
): () => void {
  const startTime = performance.now();
  let rafId: number | null = null;
  audio.volume = Math.max(0, Math.min(1, startVol));

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(1, elapsed / durationMs);
    const easeProgress =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const newVol = startVol + (targetVol - startVol) * easeProgress;
    audio.volume = Math.max(0, Math.min(1, newVol));

    if (progress < 1) {
      rafId = requestAnimationFrame(animate);
    } else {
      audio.volume = Math.max(0, Math.min(1, targetVol));
      if (onComplete) {
        onComplete();
      }
    }
  };

  rafId = requestAnimationFrame(animate);

  return () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}

class GlobalAudioCoordinator {
  private isAudioEnabled: boolean = true; // Attempts gentle autoplay by default
  private isMutedState: boolean = false;
  private volumeState: number = DEFAULT_AUDIO_VOLUME;
  private isUnlocked: boolean = false;
  private activeAudioEl: HTMLAudioElement | null = null;
  private activeFadeCancel: (() => void) | null = null;
  private listeners: Set<(state: GlobalAudioState) => void> = new Set();
  private pendingAudioEl: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.setupGlobalUnlockListener();
    }
  }

  private setupGlobalUnlockListener() {
    const handleFirstInteraction = () => {
      this.unlock();
      window.removeEventListener("pointerdown", handleFirstInteraction, true);
      window.removeEventListener("keydown", handleFirstInteraction, true);
      window.removeEventListener("touchstart", handleFirstInteraction, true);
    };

    window.addEventListener("pointerdown", handleFirstInteraction, {
      capture: true,
      once: true,
    });
    window.addEventListener("keydown", handleFirstInteraction, {
      capture: true,
      once: true,
    });
    window.addEventListener("touchstart", handleFirstInteraction, {
      capture: true,
      once: true,
    });
  }

  public unlock(): void {
    if (this.isUnlocked || typeof window === "undefined") return;
    this.isUnlocked = true;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioContextClass) {
        const dummyCtx = new AudioContextClass();
        if (dummyCtx.state === "suspended") {
          dummyCtx.resume().catch(() => {});
        }
        const osc = dummyCtx.createOscillator();
        const gain = dummyCtx.createGain();
        gain.gain.setValueAtTime(0.00001, dummyCtx.currentTime);
        osc.connect(gain);
        gain.connect(dummyCtx.destination);
        osc.start(0);
        osc.stop(dummyCtx.currentTime + 0.05);
      }
    } catch {}

    if (
      this.isAudioEnabled &&
      !this.isMutedState &&
      this.pendingAudioEl &&
      this.pendingAudioEl.paused
    ) {
      this.playTrack(this.pendingAudioEl);
    }
  }

  public getState(): GlobalAudioState {
    return {
      isEnabled: this.isAudioEnabled,
      isMuted: this.isMutedState,
      volume: this.volumeState,
    };
  }

  public isEnabled(): boolean {
    return this.isAudioEnabled && !this.isMutedState;
  }

  public isMuted(): boolean {
    return this.isMutedState;
  }

  public getVolume(): number {
    return this.volumeState;
  }

  public subscribe(listener: (state: GlobalAudioState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const snapshot = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch {}
    });
  }

  public setMuted(muted: boolean): void {
    this.isMutedState = muted;

    if (typeof document !== "undefined") {
      document.querySelectorAll("audio").forEach((el) => {
        el.muted = muted;
      });
    }

    if (!muted) {
      this.unlock();
      this.isAudioEnabled = true;
      if (this.pendingAudioEl && this.pendingAudioEl.paused) {
        this.playTrack(this.pendingAudioEl);
      }
    }

    this.notify();
  }

  public toggleGlobalMute(): boolean {
    this.setMuted(!this.isMutedState);
    return this.isMutedState;
  }

  public setGlobalAudioEnabled(enabled: boolean): void {
    this.setMuted(!enabled);
  }

  public toggleGlobalAudio(): boolean {
    this.toggleGlobalMute();
    return !this.isMutedState;
  }

  public setVolume(nextVol: number): number {
    const clamped = clampVolume(nextVol);
    this.volumeState = clamped;

    if (this.activeFadeCancel) {
      this.activeFadeCancel();
      this.activeFadeCancel = null;
    }

    if (typeof document !== "undefined") {
      document.querySelectorAll("audio").forEach((el) => {
        el.volume = clamped;
      });
    }

    this.notify();
    return clamped;
  }

  public increaseVolume(): number {
    return this.setVolume(this.volumeState + 0.1);
  }

  public decreaseVolume(): number {
    return this.setVolume(this.volumeState - 0.1);
  }

  /**
   * Attempts to play `audioEl` smoothly at `this.volumeState` (default `0.2`),
   * gently fading out any other active audio track.
   */
  public playTrack(
    audioEl: HTMLAudioElement | null,
    targetVolOverride?: number,
    onBlocked?: () => void
  ): void {
    if (!audioEl) return;
    this.pendingAudioEl = audioEl;

    const targetVolume =
      targetVolOverride !== undefined
        ? clampVolume(targetVolOverride)
        : this.volumeState;

    audioEl.muted = this.isMutedState;

    if (!this.isAudioEnabled) {
      this.stopTrack(audioEl, 400);
      return;
    }

    // Crossfade: smoothly fade out any previously playing track
    if (this.activeAudioEl && this.activeAudioEl !== audioEl) {
      this.stopTrack(this.activeAudioEl, 600);
    }

    this.activeAudioEl = audioEl;

    if (this.activeFadeCancel) {
      this.activeFadeCancel();
      this.activeFadeCancel = null;
    }

    if (audioEl.paused) {
      audioEl.volume = Math.min(0.02, targetVolume);
    }

    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.activeFadeCancel = fadeVolume(
            audioEl,
            audioEl.volume,
            this.volumeState,
            600
          );
        })
        .catch(() => {
          // Autoplay blocked by browser policy (DOMException NotAllowedError)
          onBlocked?.();
          const recoverPlay = () => {
            this.unlock();
            if (!this.isMutedState && this.pendingAudioEl) {
              this.playTrack(this.pendingAudioEl);
            }
          };
          window.addEventListener("pointerdown", recoverPlay, {
            once: true,
            capture: true,
          });
          window.addEventListener("keydown", recoverPlay, {
            once: true,
            capture: true,
          });
        });
    }
  }

  /**
   * Explicit user Play on a specific section track
   */
  public playSpecificTrack(audioEl: HTMLAudioElement | null): void {
    if (!audioEl) return;
    this.unlock();
    this.isAudioEnabled = true;
    this.pendingAudioEl = audioEl;

    if (typeof document !== "undefined") {
      document.querySelectorAll("audio").forEach((other) => {
        if (other !== audioEl && !other.paused) {
          other.pause();
        }
      });
    }

    if (this.activeFadeCancel) {
      this.activeFadeCancel();
      this.activeFadeCancel = null;
    }

    this.activeAudioEl = audioEl;
    audioEl.muted = this.isMutedState;
    audioEl.volume = this.volumeState;
    audioEl.play().catch(() => {});
  }

  /**
   * Explicit user Stop/Pause on a specific section track (pauses & resets time to 0)
   */
  public stopSpecificTrack(audioEl: HTMLAudioElement | null): void {
    if (!audioEl) return;
    if (this.activeFadeCancel && this.activeAudioEl === audioEl) {
      this.activeFadeCancel();
      this.activeFadeCancel = null;
    }
    try {
      audioEl.pause();
      audioEl.currentTime = 0;
    } catch {}
    if (this.activeAudioEl === audioEl) {
      this.activeAudioEl = null;
    }
  }

  public stopTrack(
    audioEl: HTMLAudioElement | null,
    durationMs: number = 600
  ): void {
    if (!audioEl || audioEl.paused) return;

    if (this.activeFadeCancel && this.activeAudioEl === audioEl) {
      this.activeFadeCancel();
      this.activeFadeCancel = null;
    }

    fadeVolume(audioEl, audioEl.volume, 0, durationMs, () => {
      try {
        audioEl.pause();
        audioEl.volume = this.volumeState;
      } catch {}
      if (this.activeAudioEl === audioEl) {
        this.activeAudioEl = null;
      }
    });
  }

  public pauseAll(): void {
    if (this.activeFadeCancel) {
      this.activeFadeCancel();
      this.activeFadeCancel = null;
    }

    if (typeof document !== "undefined") {
      document.querySelectorAll("audio").forEach((el) => {
        fadeVolume(el, el.volume, 0, 400, () => {
          try {
            el.pause();
          } catch {}
        });
      });
    }

    this.activeAudioEl = null;
  }
}

export const globalAudioCoordinator = new GlobalAudioCoordinator();

/**
 * React hook for Top HUD & global state sync
 */
export function useGlobalAudio() {
  const [state, setState] = useState<GlobalAudioState>(() =>
    globalAudioCoordinator.getState()
  );

  useEffect(() => {
    setState(globalAudioCoordinator.getState());
    return globalAudioCoordinator.subscribe((next) => {
      setState(next);
    });
  }, []);

  const toggleAudio = useCallback(() => {
    globalAudioCoordinator.toggleGlobalMute();
  }, []);

  const toggleGlobalMute = useCallback(() => {
    globalAudioCoordinator.toggleGlobalMute();
  }, []);

  const increaseVolume = useCallback(() => {
    globalAudioCoordinator.increaseVolume();
  }, []);

  const decreaseVolume = useCallback(() => {
    globalAudioCoordinator.decreaseVolume();
  }, []);

  const playTrack = useCallback(
    (
      audioEl: HTMLAudioElement | null,
      targetVol?: number,
      onBlocked?: () => void
    ) => {
      globalAudioCoordinator.playTrack(audioEl, targetVol, onBlocked);
    },
    []
  );

  const stopTrack = useCallback(
    (audioEl: HTMLAudioElement | null, durationMs: number = 600) => {
      globalAudioCoordinator.stopTrack(audioEl, durationMs);
    },
    []
  );

  return {
    isEnabled: state.isEnabled && !state.isMuted,
    isMuted: state.isMuted,
    volume: state.volume,
    toggleAudio,
    toggleGlobalMute,
    increaseVolume,
    decreaseVolume,
    playTrack,
    stopTrack,
  };
}

/**
 * Section-level React Audio Controller Hook using `useRef` & `useState`
 * 1. Defaults `<audio>` volume to `0.2`
 * 2. Attempts autoplay on mount/in-view gracefully
 * 3. Top button toggles global `muted`
 * 4. Bottom button plays or stops (pause + currentTime = 0) this section's track
 * 5. +/- buttons step volume by +/- 0.1 within [0.0, 1.0]
 */
export function useSectionAudio(
  audioRef: React.RefObject<HTMLAudioElement | null>,
  inView: boolean,
  autoPlayOnView: boolean = true
) {
  const {
    isMuted,
    volume,
    toggleGlobalMute,
    increaseVolume,
    decreaseVolume,
    playTrack,
    stopTrack,
  } = useGlobalAudio();

  const [isTrackPlaying, setIsTrackPlaying] = useState<boolean>(false);
  const manuallyStoppedRef = useRef<boolean>(false);

  // Set default volume (0.2) on mount & keep element volume/muted synced
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [audioRef, volume, isMuted]);

  // Sync React isTrackPlaying state with native <audio> events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsTrackPlaying(true);
    const handlePause = () => setIsTrackPlaying(false);
    const handleEnded = () => setIsTrackPlaying(false);

    setIsTrackPlaying(!audio.paused);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioRef]);

  // Attempt autoplay on mount / when scrolling into view; pause when leaving view
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (inView) {
      if (autoPlayOnView && !manuallyStoppedRef.current && !isMuted) {
        playTrack(audio);
      }
    } else {
      manuallyStoppedRef.current = false;
      stopTrack(audio, 600);
    }
  }, [audioRef, inView, autoPlayOnView, isMuted, playTrack, stopTrack]);

  // Bottom Play / Stop button: pauses & resets currentTime = 0, or starts playing
  const togglePlayStop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      manuallyStoppedRef.current = true;
      globalAudioCoordinator.stopSpecificTrack(audio);
      setIsTrackPlaying(false);
    } else {
      manuallyStoppedRef.current = false;
      globalAudioCoordinator.playSpecificTrack(audio);
    }
  }, [audioRef]);

  return {
    isMuted,
    toggleGlobalMute,
    isTrackPlaying,
    togglePlayStop,
    volume,
    increaseVolume,
    decreaseVolume,
  };
}
