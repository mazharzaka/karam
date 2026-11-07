"use client";

// Elegant romantic ambient chime synthesizer & physical SFX using Web Audio API
// Generates soft acoustic harp chord arpeggios and physical desk interaction sounds without external MP3 files.

class RomanticAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  // Gentle romantic chord progression: Fmaj7 -> C -> G -> Am
  private readonly notes = [
    [349.23, 440.0, 523.25, 659.25], // Fmaj7
    [261.63, 329.63, 392.0, 523.25], // C
    [392.0, 493.88, 587.33, 783.99], // G
    [220.0, 261.63, 329.63, 440.0],  // Am
  ];
  private chordIndex = 0;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  private playTone(freq: number, timeOffset: number) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime + timeOffset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.9);
    } catch {
      // AudioContext waiting for user gesture
    }
  }

  // Physical tap/landing sound when a polaroid drops onto the desk
  public playDropSfx() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);

      // Light harmonic sparkle accent
      this.playTone(880, 0.04);
    } catch {}
  }

  // Soft camera click/gliding sound when timeline item reveals
  public playGlideSfx() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  public start() {
    if (this.isPlaying) return;
    this.initContext();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.isPlaying = true;

    const playChord = () => {
      const chord = this.notes[this.chordIndex % this.notes.length];
      chord.forEach((freq, idx) => {
        this.playTone(freq, idx * 0.28);
      });
      this.chordIndex++;
    };

    playChord();
    this.intervalId = setInterval(playChord, 2400);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const romanticAudio = typeof window !== "undefined" ? new RomanticAudioPlayer() : null;
