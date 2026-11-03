/**
 * Web Audio API Sound Synthesizer for NutriCare
 * Generates tactile, analog acoustic feedback:
 * - Mechanical button clicks
 * - Liquid glug / splash
 * - Vintage camera shutter release
 * - Ink stamp thud
 */

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private readonly STORAGE_KEY = 'nutricare_sound_muted';

  private safeGetStorage(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Storage unavailable
    }
    return null;
  }

  private safeSetStorage(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Storage unavailable
    }
  }

  constructor() {
    const saved = this.safeGetStorage(this.STORAGE_KEY);
    this.muted = saved === 'true';
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx && (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      try {
        this.ctx = new AudioCtx();
      } catch {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    this.safeSetStorage(this.STORAGE_KEY, String(muted));
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /**
   * Tactile mechanical switch click (800Hz to 200Hz snappy pulse)
   */
  public playClick(): void {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(850, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Fluid drop / water glug sound (liquid resonance)
   */
  public playGlug(): void {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Pitch sweeps up like a liquid bubble filling up
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Vintage camera shutter click (noise burst + mechanical return)
   */
  public playShutter(): void {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Initial click
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(1200, now);
      clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.03);
      clickGain.gain.setValueAtTime(0.2, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.035);

      // 2. Secondary shutter curtain blade return
      const returnOsc = ctx.createOscillator();
      const returnGain = ctx.createGain();
      returnOsc.type = 'triangle';
      returnOsc.frequency.setValueAtTime(500, now + 0.06);
      returnOsc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
      returnGain.gain.setValueAtTime(0.18, now + 0.06);
      returnGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      returnOsc.connect(returnGain);
      returnGain.connect(ctx.destination);
      returnOsc.start(now + 0.06);
      returnOsc.stop(now + 0.11);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Deep ink stamp thud (heavy rubber/wood press)
   */
  public playStamp(): void {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.1);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Audio fallback silent
    }
  }
}

export const soundEffects = new SoundEffectsService();
