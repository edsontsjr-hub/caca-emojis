// Simple synthesizer using Web Audio API so we don't need external assets
const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

const playTone = (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number, delay = 0, volume = 0.1) => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
  
  // Smooth envelope for less harsh sound
  gain.gain.setValueAtTime(0, audioCtx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + delay + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime + delay);
  osc.stop(audioCtx.currentTime + delay + duration);
};

export const playSound = {
  correct: () => {
    // A magical chime up
    playTone(523.25, 'sine', 0.5, 0); // C5
    playTone(659.25, 'sine', 0.5, 0.1); // E5
    playTone(783.99, 'sine', 0.5, 0.2); // G5
    playTone(1046.50, 'sine', 1.0, 0.3); // C6
  },
  wrong: () => {
    // A gentle "oops" sound
    playTone(300, 'triangle', 0.3, 0);
    playTone(200, 'triangle', 0.4, 0.15);
  },
  win: () => {
    // Fanfare
    const now = 0;
    playTone(523.25, 'sine', 0.2, now);
    playTone(523.25, 'sine', 0.2, now + 0.15);
    playTone(523.25, 'sine', 0.2, now + 0.30);
    playTone(659.25, 'sine', 0.6, now + 0.45); // Long note
    playTone(783.99, 'sine', 0.6, now + 0.45); // Harmony
  },
  pop: () => {
    // Bubble sound
    playTone(800, 'sine', 0.1, 0);
  },
  hint: () => {
    // Magical dust sound
    playTone(1200, 'sine', 0.1, 0);
    playTone(1400, 'sine', 0.1, 0.05);
    playTone(1600, 'sine', 0.1, 0.1);
    playTone(1800, 'sine', 0.2, 0.15);
  },
  sparkle: () => {
    // High pitched sparkles
    for(let i=0; i<5; i++) {
        playTone(1500 + i*200, 'sine', 0.1, i*0.05, 0.05);
    }
  }
};