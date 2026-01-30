"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { noise, type Dimensions } from "./utils";
import { MousePositionContext } from "./MousePositionContext";
import styles from "./AnimationWave.module.css";

// Density characters based on overlap count (0-3 waves)
const DENSITY_CHARS = [" ", "░", "▒", "█"];

type WaveParams = {
  amplitude: number;
  waveOffsets: number[];
};

const generateWaves = (
  input: number,
  lines: number,
  width: number,
  { amplitude, waveOffsets }: WaveParams
) => {
  // Initialize grid with overlap counts
  const grid: number[][] = Array.from({ length: lines }, () =>
    new Array(width).fill(0)
  );

  // Generate each wave and fill the area below it
  waveOffsets.forEach((verticalOffset, waveIndex) => {
    for (let x = 0; x < width; x++) {
      // Each wave uses different noise coordinates for variety
      const noiseValue = noise.get(
        (x + input * 2) / 20,
        waveIndex * 0.5,
        input * 0.02
      );

      // Wave height centered around its vertical offset
      const waveAmplitude = lines * amplitude;
      const centerY = verticalOffset * lines;
      const waveY = centerY + (noiseValue - 0.5) * waveAmplitude;

      // Fill all cells BELOW the wave (y >= waveY)
      for (let y = 0; y < lines; y++) {
        if (y >= waveY) {
          grid[y][x]++;
        }
      }
    }
  });

  // Convert overlap counts to density characters
  return grid.map((row) =>
    row.map((count) => DENSITY_CHARS[Math.min(count, DENSITY_CHARS.length - 1)])
  );
};

export const AnimationWave = ({ lines, width }: Dimensions) => {
  const [input, setInput] = useState(0);
  const [mouseX, mouseY] = useContext(MousePositionContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ top: 0, left: 0, width: 1, height: 1 });

  // Measure container for relative mouse position
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setBounds({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, []);

  // Calculate relative mouse position (0-1 range, clamped)
  const relativeX = Math.max(0, Math.min(1, (mouseX - bounds.left) / bounds.width));
  const relativeY = Math.max(0, Math.min(1, (mouseY - bounds.top) / bounds.height));

  // Horizontal: Amplitude based on distance from center
  // Center = max amplitude (wavy), edges = min amplitude (flat)
  const distanceFromCenter = Math.abs(relativeX - 0.5) * 2; // 0 at center, 1 at edges
  const amplitude = 0.1 + (1 - distanceFromCenter) * 0.5;

  // Vertical: Wave separation (perspective effect)
  // Top = compressed (distant horizon), bottom = spread (close up)
  const separation = 0.1 + relativeY * 0.3;
  const waveOffsets = [0.5 - separation, 0.5, 0.5 + separation];

  useEffect(() => {
    const interval = setInterval(() => {
      setInput((prev) => prev + 1);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className={styles.grid}>
      {generateWaves(input, lines, width, { amplitude, waveOffsets }).flatMap(
        (row, y) => row.map((char, x) => <span key={`${y}-${x}`}>{char}</span>)
      )}
    </div>
  );
};
