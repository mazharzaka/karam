"use client";

// Hyper-Cinematic Audio Engine for Romantic Wrapped
// Handles real-time Web Audio API synthesis & seamless crossfading between Scene 1 (Arabic Track) and Scene 2 (Pharaonic Track)
// Also supports external audio URL playback with GainNode crossfaders.

class SceneAudioController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentSceneIndex: number = 0;

  // Track A (Scene 1: Arabic Romantic Maqam) nodes
  private gainA: GainNode | null = null;
  private timerA: NodeJS.Timeout | null = null;
  private chordIndexA: number = 0;
  // Arabic Maqam Nahawand / Bayati romantic scale frequencies (Plucked Oud & Acoustic Chimes)
  private readonly arabicNotes = [
    [293.66, 369.99, 440.0, 554.37], // D minor / Bayati
    [261.63, 329.63, 392.0, 493.88], // C major
    [349.23, 440.0, 523.25, 659.25], // F major 7
    [220.0, 277.18, 329.63, 440.0],  // A major Hijaz inflection
  ];

  // Track B (Scene 2: Pharaonic Cinematic Sacred Aura) nodes
  private gainB: GainNode | null = null;
  private timerB: NodeJS.Timeout | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private pharaonicIndex: number = 0;
  // Ancient Egyptian Pharaonic Harp / Cithara & Mystical Ney Flute tones (Deep G / D mystic pentatonic)
  private readonly pharaonicTones = [
    [146.83, 220.0, 293.66, 440.0],  // Deep D sacred resonance
    [196.0, 293.66, 392.0, 587.33],  // Ancient G mystic chord
    [164.81, 246.94, 329.63, 493.88], // E minor solemn depth
    [220.0, 329.63, 440.0, 659.25],  // A resonant golden cadence
  ];

  constructor() {
    // Lazy init on first user interaction
  }

  private initAudio() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();

        // Master Gain
        const masterGain = this.ctx.createGain();
        masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
        masterGain.connect(this.ctx.destination);

        // Track A Gain Node
        this.gainA = this.ctx.createGain();
        this.gainA.gain.setValueAtTime(1.0, this.ctx.currentTime);
        this.gainA.connect(masterGain);

        // Track B Gain Node (starts silent)
        this.gainB = this.ctx.createGain();
        this.gainB.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.gainB.connect(masterGain);

        this.startTrackA();
        this.startTrackB();
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  // Play a single note for Track A (Acoustic Pluck)
  private playPluckedTone(freq: number, delaySec: number) {
    if (!this.ctx || !this.gainA) return;
    try {
      const now = this.ctx.currentTime + delaySec;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.045, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      osc.connect(noteGain);
      noteGain.connect(this.gainA);

      osc.start(now);
      osc.stop(now + 1.7);
    } catch {}
  }

  // Play a mystical harp/flute harmonic tone for Track B
  private playPharaonicChime(freq: number, delaySec: number) {
    if (!this.ctx || !this.gainB) return;
    try {
      const now = this.ctx.currentTime + delaySec;
      const osc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();

      // Triangle wave delivers ancient flute & cithara warmth
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);

      chimeGain.gain.setValueAtTime(0.0001, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.05, now + 0.08);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      osc.connect(chimeGain);
      chimeGain.connect(this.gainB);

      osc.start(now);
      osc.stop(now + 2.5);
    } catch {}
  }

  // Track A loop (Arabic Romantic)
  private startTrackA() {
    if (this.timerA) clearInterval(this.timerA);

    const stepA = () => {
      const chord = this.arabicNotes[this.chordIndexA % this.arabicNotes.length];
      chord.forEach((freq, idx) => {
        this.playPluckedTone(freq, idx * 0.26);
      });
      this.chordIndexA++;
    };

    stepA();
    this.timerA = setInterval(stepA, 2500);
  }

  // Track B loop (Pharaonic Sacred Aura)
  private startTrackB() {
    if (this.timerB) clearInterval(this.timerB);

    // Continuous deep golden drone (73.4Hz + 110Hz Sacred 5th)
    if (this.ctx && this.gainB && !this.droneOsc1) {
      try {
        const droneGain = this.ctx.createGain();
        droneGain.gain.setValueAtTime(0.025, this.ctx.currentTime);
        droneGain.connect(this.gainB);
        this.droneGain = droneGain;

        const osc1 = this.ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(73.42, this.ctx.currentTime); // D2 deep root
        osc1.connect(droneGain);
        osc1.start();
        this.droneOsc1 = osc1;

        const osc2 = this.ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(110.0, this.ctx.currentTime); // A2 harmonic 5th
        osc2.connect(droneGain);
        osc2.start();
        this.droneOsc2 = osc2;
      } catch {}
    }

    const stepB = () => {
      const chord = this.pharaonicTones[this.pharaonicIndex % this.pharaonicTones.length];
      chord.forEach((freq, idx) => {
        this.playPharaonicChime(freq, idx * 0.38);
      });
      this.pharaonicIndex++;
    };

    stepB();
    this.timerB = setInterval(stepB, 3000);
  }

  // SMOOTH CROSSFADE LOGIC
  public transitionToScene(sceneIndex: number, isEnabled: boolean = true) {
    this.currentSceneIndex = sceneIndex;
    if (!isEnabled) {
      this.mute();
      return;
    }

    this.initAudio();
    if (!this.ctx || !this.gainA || !this.gainB) return;

    const now = this.ctx.currentTime;
    const fadeDuration = 1.6; // 1.6s cinematic smooth crossfade

    try {
      if (sceneIndex >= 1 && sceneIndex <= 6) {
        // TRANSITION TO SCENES 2 through 7 (Pharaonic, Saidi, Cinema, Falahi, Zamalek, Race)
        // Real MP3 audio tracks are handled directly by their respective section components
        this.gainA.gain.cancelScheduledValues(now);
        this.gainB.gain.cancelScheduledValues(now);

        this.gainA.gain.setValueAtTime(Math.max(0.0001, this.gainA.gain.value), now);
        this.gainA.gain.exponentialRampToValueAtTime(0.0001, now + fadeDuration);

        this.gainB.gain.setValueAtTime(Math.max(0.0001, this.gainB.gain.value), now);
        this.gainB.gain.exponentialRampToValueAtTime(0.0001, now + fadeDuration);
      } else {
        // TRANSITION TO SCENE 1 (or other scenes): Fade IN Track A (Arabic), Fade OUT Track B
        this.gainA.gain.cancelScheduledValues(now);
        this.gainB.gain.cancelScheduledValues(now);

        this.gainB.gain.setValueAtTime(Math.max(0.0001, this.gainB.gain.value), now);
        this.gainB.gain.exponentialRampToValueAtTime(0.0001, now + fadeDuration);

        this.gainA.gain.setValueAtTime(Math.max(0.0001, this.gainA.gain.value), now);
        this.gainA.gain.exponentialRampToValueAtTime(0.9, now + fadeDuration);
      }
    } catch {}
  }

  public mute() {
    this.isMuted = true;
    if (this.ctx && this.gainA && this.gainB) {
      const now = this.ctx.currentTime;
      this.gainA.gain.cancelScheduledValues(now);
      this.gainB.gain.cancelScheduledValues(now);
      this.gainA.gain.setValueAtTime(0.0001, now);
      this.gainB.gain.setValueAtTime(0.0001, now);
    }
  }

  public toggleMute(isEnabled: boolean) {
    this.isMuted = !isEnabled;
    this.transitionToScene(this.currentSceneIndex, isEnabled);
  }

  public playGoldenGlowSfx() {
    this.initAudio();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.14); // A5

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }
}

export const sceneAudio = typeof window !== "undefined" ? new SceneAudioController() : null;

