"use client";

import { useEffect } from "react";

export default function ThunderAmbience() {
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let cleanupTimer: number | null = null;
    let rumbleInterval: number | null = null;

    const initialize = async () => {
      if (audioCtx) return;
      audioCtx = new AudioContext();

      const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 3, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        const drift = Math.sin((i / buffer.length) * Math.PI) * 0.35;
        data[i] = white * 0.2 + drift * 0.35;
      }

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const lowPass = audioCtx.createBiquadFilter();
      lowPass.type = "lowpass";
      lowPass.frequency.value = 180;

      const highPass = audioCtx.createBiquadFilter();
      highPass.type = "highpass";
      highPass.frequency.value = 28;

      const gain = audioCtx.createGain();
      gain.gain.value = 0.0;

      source.connect(lowPass);
      lowPass.connect(highPass);
      highPass.connect(gain);
      gain.connect(audioCtx.destination);
      source.start();

      const swell = () => {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const swellGain = 0.15 + Math.random() * 0.05;
        gain.gain.cancelScheduledValues(now);
        gain.gain.linearRampToValueAtTime(swellGain, now + 0.6);
        gain.gain.linearRampToValueAtTime(0.03, now + 3.5 + Math.random() * 1.1);
        lowPass.frequency.cancelScheduledValues(now);
        lowPass.frequency.setTargetAtTime(220 + Math.random() * 40, now, 0.3);
      };

      swell();
      rumbleInterval = window.setInterval(swell, 4500 + Math.random() * 3000);

      const keepAlive = () => {
        if (!audioCtx) return;
        audioCtx.resume();
      };
      cleanupTimer = window.setInterval(keepAlive, 10000);
    };

    const resume = () => {
      initialize().catch(() => {
        /* ignore */
      });
    };

    window.addEventListener("pointerdown", resume);
    window.addEventListener("keydown", resume);

    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);

      if (cleanupTimer) {
        window.clearInterval(cleanupTimer);
      }
      if (rumbleInterval) {
        window.clearInterval(rumbleInterval);
      }
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, []);

  return null;
}
