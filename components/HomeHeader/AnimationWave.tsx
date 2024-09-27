"use client";

import { useContext, useEffect, useState } from "react";
import { LINES, LINE_LENGTH, noise } from "./utils";
import { MousePositionContext } from "./MousePositionContext";

// const generateWave = (noiseX: number, noiseY = 0, noiseZ = 0) => {
//   const result = new Array(LINES * LINE_LENGTH).fill(" ").map((_, i) => {
//     const x = i % LINE_LENGTH;
//     const y = (i - (i % LINE_LENGTH)) / LINE_LENGTH;
//     const level = noise.get((x + noiseX) / 10, noiseY / 10, noiseZ);
//     const treshold = Math.floor(level * LINES * LIMITER);

//     if (treshold < y) return "█";
//     if (treshold >= y && treshold < y + 1) return "▓";
//     if (treshold >= y + 1 && treshold < y + 2) return "▒";
//     if (treshold >= y + 2 && treshold < y + 3) return "░";
//     if (treshold >= y + 3) return " ";
//   });
//   return result;
// };

const LIMITER = 3 / 2;

const generateWave = (input: number) => {
  const wave: string[][] = new Array(LINES).fill(
    new Array(LINE_LENGTH).fill(" ")
  );

  return wave.map((row, y) =>
    row.map((_el, x) => {
      const waveHeight =
        noise.get((x + input * 2) / 5, 0, 0) * (LINES - 1) * LIMITER;
      return waveHeight > y && waveHeight < y + 1 ? "█" : " ";
    })
  );
};

export const AnimationWave = () => {
  const [input, setInput] = useState(0);
  const [mouseX, mouseY] = useContext(MousePositionContext);
  useEffect(() => {
    const interval = setInterval(() => {
      setInput((prev) => prev + 1);
    }, 60);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ display: "grid", grid: "repeat(5, 1fr) / repeat(60, 1fr)" }}>
      {generateWave(input).map((row, y) =>
        row.map((el, x) => (
          <span data-pos={`${y}-${x}`} key={`${y}-${x}`}>
            {el}
          </span>
        ))
      )}
    </div>
  );
};
