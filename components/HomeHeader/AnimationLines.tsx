"use client";
import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { MousePositionContext } from "./MousePositionContext";
import type { Dimensions } from "./utils";
import styles from "./AnimationLines.module.css";

// Direction enum for the 8 possible orientations
const enum Direction {
  E = 0,    // -
  SEE = 1,  // \ rotated -45
  SE = 2,   // ⟍
  SES = 3,  // \
  S = 4,    // |
  SWS = 5,  // /
  SW = 6,   // ⟋
  SWW = 7,  // / rotated 45
}

const DIRECTION_CHARS: Record<Direction, string> = {
  [Direction.E]: "-",
  [Direction.SEE]: "\\",
  [Direction.SE]: "⟍",
  [Direction.SES]: "\\",
  [Direction.S]: "|",
  [Direction.SWS]: "/",
  [Direction.SW]: "⟋",
  [Direction.SWW]: "/",
};

const DIRECTION_CLASSES: Record<Direction, string> = {
  [Direction.E]: "",
  [Direction.SEE]: styles.rotateNeg45,
  [Direction.SE]: "",
  [Direction.SES]: "",
  [Direction.S]: "",
  [Direction.SWS]: "",
  [Direction.SW]: "",
  [Direction.SWW]: styles.rotate45,
};

function getDirection(angle: number): Direction {
  // Normalize angle to 0-2π range
  const normalized = angle < 0 ? angle + 2 * Math.PI : angle;
  // Divide circle into 16 segments, then map to 8 directions
  const segment = Math.floor((normalized + Math.PI / 16) / (Math.PI / 8)) % 16;

  // Map 16 segments to 8 directions (opposite segments map to same direction)
  const directionMap: Direction[] = [
    Direction.E,    // 0: E
    Direction.SEE,  // 1: E-SE
    Direction.SE,   // 2: SE
    Direction.SES,  // 3: SE-S
    Direction.S,    // 4: S
    Direction.SWS,  // 5: S-SW
    Direction.SW,   // 6: SW
    Direction.SWW,  // 7: SW-W
    Direction.E,    // 8: W (opposite of E)
    Direction.SEE,  // 9: W-NW (opposite of E-SE)
    Direction.SE,   // 10: NW (opposite of SE)
    Direction.SES,  // 11: NW-N (opposite of SE-S)
    Direction.S,    // 12: N (opposite of S)
    Direction.SWS,  // 13: N-NE (opposite of S-SW)
    Direction.SW,   // 14: NE (opposite of SW)
    Direction.SWW,  // 15: NE-E (opposite of SW-W)
  ];

  return directionMap[segment];
}

// Memoized character component - only re-renders when direction changes
const Char = memo(function Char({ direction }: { direction: Direction }) {
  const className = DIRECTION_CLASSES[direction];
  return (
    <span className={className ? `${styles.char} ${className}` : styles.char}>
      {DIRECTION_CHARS[direction]}
    </span>
  );
});

export const AnimationLines = ({ lines, width }: Dimensions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, mouseY] = useContext(MousePositionContext);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [cellSize, setCellSize] = useState({ width: 10, height: 20 });

  // Half density: render half the columns
  const cols = Math.floor(width / 2);

  // Measure container position and cell size
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setOffset({ x: rect.left, y: rect.top });
        setCellSize({
          width: rect.width / cols,
          height: rect.height / lines,
        });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [lines, cols]);

  // Compute all directions in one pass
  const directions = useMemo(() => {
    const result: Direction[] = new Array(lines * cols);
    for (let row = 0; row < lines; row++) {
      for (let col = 0; col < cols; col++) {
        const cellX = offset.x + col * cellSize.width + cellSize.width / 2;
        const cellY = offset.y + row * cellSize.height + cellSize.height / 2;
        const angle = Math.atan2(mouseY - cellY, mouseX - cellX);
        result[row * cols + col] = getDirection(angle);
      }
    }
    return result;
  }, [mouseX, mouseY, offset, cellSize, lines, cols]);

  return (
    <div ref={containerRef} className={styles.grid}>
      {directions.map((direction, i) => (
        <Char key={i} direction={direction} />
      ))}
    </div>
  );
};
