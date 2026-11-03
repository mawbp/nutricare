import { describe, it, expect, beforeEach, vi } from 'vitest';
import { soundEffects } from './soundEffects';

describe('SoundEffects Service', () => {
  beforeEach(() => {
    localStorage.clear();
    soundEffects.setMuted(false);
  });

  it('initializes unmuted by default or reads from storage', () => {
    expect(soundEffects.isMuted()).toBe(false);
  });

  it('toggles and persists mute state in localStorage', () => {
    const newState = soundEffects.toggleMute();
    expect(newState).toBe(true);
    expect(soundEffects.isMuted()).toBe(true);
    expect(localStorage.getItem('nutricare_sound_muted')).toBe('true');

    soundEffects.toggleMute();
    expect(soundEffects.isMuted()).toBe(false);
    expect(localStorage.getItem('nutricare_sound_muted')).toBe('false');
  });

  it('exposes playback methods that execute safely without throwing', () => {
    expect(() => soundEffects.playClick()).not.toThrow();
    expect(() => soundEffects.playGlug()).not.toThrow();
    expect(() => soundEffects.playShutter()).not.toThrow();
    expect(() => soundEffects.playStamp()).not.toThrow();
  });
});
