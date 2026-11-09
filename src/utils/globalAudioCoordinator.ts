"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Universal Global Audio Coordinator for Romantic Wrapped
 * 
 * Features:
 * 1. Global Browser Audio Unlock on first user gesture (click / pointerdown / keydown)
 * 2. Unified `isGlobalAudioEnabled` state across all timeline sections & HUD
 * 3. Graceful Autoplay handling with smooth crossfading (fades out previous, fades in current)
 * 4. Fallback to "Muted" when blocked by browser policy until unmuted by the user
 */

export function fadeVolume(
  audio: HTMLAudioElement,
  startVol: number,
  targetVol: number,
  durationMs: number = 800,
  onComplete?: () => void
): () => void {
  const startTime = performance.now();
  let rafId: number | null = null;
  audio.volume = Math.max(0, Math.min(1, startVol));

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(1, elapsed / durationMs);
    // Smooth quadratic ease-in-out
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
  private isAudioEnabled: boolean = false;
  private isUnlocked: boolean = false;
  private activeAudioEl: HTMLAudioElement | null = null;
  private activeFadeCancel: (() => void) | null = null;
  private listeners: Set<(enabled: boolean) => void> = new Set();
  private pendingAudioEl: HTMLAudioElement | null = null;
  private pendingTargetVol: number = 0.85;

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

  /**
   * Resumes Web Audio context and plays micro silent buffer to clear autoplay restriction
   */
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

    // If audio is already enabled and there's a pending section waiting to play
    if (this.isAudioEnabled && this.pendingAudioEl) {
      this.playTrack(this.pendingAudioEl, this.pendingTargetVol);
    }
  }

  public isEnabled(): boolean {
    return this.isAudioEnabled;
  }

  public subscribe(listener: (enabled: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.isAudioEnabled);
      } catch {}
    });
  }

  public setGlobalAudioEnabled(enabled: boolean): void {
    if (enabled) {
      this.unlock();
      this.isAudioEnabled = true;
      this.notify();

      if (this.pendingAudioEl) {
        this.playTrack(this.pendingAudioEl, this.pendingTargetVol);
      }
    } else {
      this.isAudioEnabled = false;
      this.pauseAll();
      this.notify();
    }
  }

  public toggleGlobalAudio(): boolean {
    this.setGlobalAudioEnabled(!this.isAudioEnabled);
    return this.isAudioEnabled;
  }

  /**
   * Smoothly plays `audioEl`, gently fading out any currently playing track.
   * If browser blocks playback, invokes `onBlocked` and awaits user gesture.
   */
  public playTrack(
    audioEl: HTMLAudioElement | null,
    targetVolume: number = 0.85,
    onBlocked?: () => void
  ): void {
    if (!audioEl) return;
    this.pendingAudioEl = audioEl;
    this.pendingTargetVol = targetVolume;

    // If global audio is currently off, ensure this track is quiet and paused
    if (!this.isAudioEnabled) {
      this.stopTrack(audioEl, 400);
      return;
    }

    // Crossfade: if another audio track is playing, smoothly fade it out
    if (this.activeAudioEl && this.activeAudioEl !== audioEl) {
      this.stopTrack(this.activeAudioEl, 800);
    }

    this.activeAudioEl = audioEl;

    if (this.activeFadeCancel) {
      this.activeFadeCancel();
      this.activeFadeCancel = null;
    }

    audioEl.muted = false;
    if (audioEl.paused) {
      audioEl.volume = 0.001;
    }

    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Play succeeded! Smoothly ramp up to target volume
          this.activeFadeCancel = fadeVolume(
            audioEl,
            audioEl.volume,
            targetVolume,
            800
          );
        })
        .catch((err: Error) => {
          // Autoplay blocked by browser policy
          if (err.name === "NotAllowedError") {
            this.isAudioEnabled = false;
            this.notify();
            onBlocked?.();

            // Set up immediate recovery on the next user click
            const recoverPlay = () => {
              this.unlock();
              this.setGlobalAudioEnabled(true);
            };
            window.addEventListener("pointerdown", recoverPlay, {
              once: true,
              capture: true,
            });
            window.addEventListener("keydown", recoverPlay, {
              once: true,
              capture: true,
            });
          }
        });
    }
  }

  /**
   * Smoothly fades out and pauses a given audio element
   */
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
        audioEl.volume = 0;
      } catch {}
      if (this.activeAudioEl === audioEl) {
        this.activeAudioEl = null;
      }
    });
  }

  /**
   * Pauses all <audio> elements on the page with smooth volume fade-out
   */
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
 * React hook for synchronized audio state across sections & HUD
 */
export function useGlobalAudio() {
  const [isEnabled, setIsEnabled] = useState<boolean>(
    globalAudioCoordinator.isEnabled()
  );

  useEffect(() => {
    setIsEnabled(globalAudioCoordinator.isEnabled());
    const unsubscribe = globalAudioCoordinator.subscribe((enabled) => {
      setIsEnabled(enabled);
    });
    return unsubscribe;
  }, []);

  const toggleAudio = useCallback(() => {
    globalAudioCoordinator.toggleGlobalAudio();
  }, []);

  const enableAudio = useCallback(() => {
    globalAudioCoordinator.setGlobalAudioEnabled(true);
  }, []);

  const disableAudio = useCallback(() => {
    globalAudioCoordinator.setGlobalAudioEnabled(false);
  }, []);

  const playTrack = useCallback(
    (
      audioEl: HTMLAudioElement | null,
      targetVol: number = 0.85,
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
    isEnabled,
    toggleAudio,
    enableAudio,
    disableAudio,
    playTrack,
    stopTrack,
  };
}

