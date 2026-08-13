// Web Audio API Synthesizer for Royal Hashmi Restaurant Theme & Intro

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Plays a luxury royal chime chord for the Hashmi Restaurant intro animation
 */
export function playRoyalIntroSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { freq: 261.63, delay: 0.0, gain: 0.15 }, // C4
      { freq: 329.63, delay: 0.15, gain: 0.18 }, // E4
      { freq: 392.00, delay: 0.3, gain: 0.2 }, // G4
      { freq: 523.25, delay: 0.45, gain: 0.25 }, // C5
      { freq: 659.25, delay: 0.65, gain: 0.28 }, // E5
      { freq: 783.99, delay: 0.85, gain: 0.3 }, // G5 (Climax)
      { freq: 1046.50, delay: 1.05, gain: 0.25 }, // High C6 shimmer
    ];

    // Master Compressor
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18, now);
    compressor.knee.setValueAtTime(30, now);
    compressor.ratio.setValueAtTime(10, now);
    compressor.attack.setValueAtTime(0.003, now);
    compressor.release.setValueAtTime(0.25, now);
    compressor.connect(ctx.destination);

    notes.forEach(({ freq, delay, gain }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      // Sine wave with soft harmonic warmth
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + delay);

      const startTime = now + delay;
      const duration = 2.2;

      oscGain.gain.setValueAtTime(0.0001, startTime);
      oscGain.gain.exponentialRampToValueAtTime(gain, startTime + 0.04);
      oscGain.gain.exponentialRampToValueAtTime(gain * 0.4, startTime + 0.5);
      oscGain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

      osc.connect(oscGain);
      oscGain.connect(compressor);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (err) {
    console.debug('Audio not available or blocked by user gesture:', err);
  }
}

/**
 * Tactile UI Button Click Sound
 */
export function playClickSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

/**
 * Success action sound (e.g. Booking confirmed, login success)
 */
export function playSuccessSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [587.33, 880.0].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.08, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.65);
    });
  } catch {
    // Ignore
  }
}
