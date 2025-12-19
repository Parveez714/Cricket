import { useCallback, useRef } from "react";

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playClick = useCallback(() => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }, [getAudioContext]);

  const playScore = useCallback((runs: number) => {
    const ctx = getAudioContext();
    const baseFreq = 400 + runs * 50;

    for (let i = 0; i < Math.min(runs, 3); i++) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(baseFreq + i * 100, ctx.currentTime + i * 0.1);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.15);

      oscillator.start(ctx.currentTime + i * 0.1);
      oscillator.stop(ctx.currentTime + i * 0.1 + 0.15);
    }
  }, [getAudioContext]);

  const playOut = useCallback(() => {
    const ctx = getAudioContext();

    // Dramatic descending tone
    const oscillator1 = ctx.createOscillator();
    const gainNode1 = ctx.createGain();
    oscillator1.connect(gainNode1);
    gainNode1.connect(ctx.destination);

    oscillator1.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
    oscillator1.type = "sawtooth";

    gainNode1.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator1.start(ctx.currentTime);
    oscillator1.stop(ctx.currentTime + 0.5);

    // Crash sound
    const bufferSize = ctx.sampleRate * 0.3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    noise.buffer = noiseBuffer;
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseGain.gain.setValueAtTime(0.2, ctx.currentTime + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    noise.start(ctx.currentTime + 0.1);
  }, [getAudioContext]);

  return { playClick, playScore, playOut };
};
