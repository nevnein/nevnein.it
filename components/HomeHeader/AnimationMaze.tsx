"use client";
import { useEffect, useRef, useState } from "react";
import type { Dimensions } from "./utils";
import styles from "./AnimationMaze.module.css";

// This is not an efficient implementation of a disjoint set, but it's good enough for this use case
class DisjointSet<T> {
  store: null | Map<T, Set<T>>;
  sets: Map<T, Set<T>>;
  constructor() {
    this.sets = new Map();
    this.store = null;
  }

  find(x: T) {
    for (const set of this.sets.values()) {
      if (set.has(x)) {
        return set;
      }
    }
    return null;
  }

  add(x: T) {
    if (!this.sets.has(x)) {
      const newSet = new Set([x]);
      this.sets.set(x, newSet);
    }
  }

  union(x: T, y: T) {
    if (!this.find(x)) this.add(x);
    if (!this.find(y)) this.add(y);

    const setX = this.find(x)!;
    const setY = this.find(y)!;

    for (const elem of setY) {
      setX.add(elem);
      this.sets.set(elem, setX);
    }
  }

  connected(x: T, y: T) {
    const setX = this.find(x);
    const setY = this.find(y);
    return setX === setY;
  }
}

const SINGLE_LINE_CHARS = [
  "E", // This char should never appear
  "╵",
  "╶",
  "└",
  "╷",
  "│",
  "┌",
  "├",
  "╴",
  "┘",
  "─",
  "┴",
  "┐",
  "┤",
  "┬",
  "┼",
];

function createInitialGrid(lines: number, width: number) {
  const internalGrid: number[][] = Array.from({ length: lines }, () =>
    new Array(width + 2).fill(15),
  );

  // Add top and bottom edges
  internalGrid.unshift(new Array(width + 2).fill(14));
  internalGrid.push(new Array(width + 2).fill(11));

  // Add corners and left and right edges
  return internalGrid.map((el, i) => {
    switch (i) {
      case 0:
        return [6].concat(el, 12);
      case internalGrid.length - 1:
        return [3].concat(el, 9);
      default:
        return [7].concat(el, [13]);
    }
  });
}

function createInitialEdges(grid: number[][]) {
  const edges: [number, number, "W" | "N"][] = [];
  for (let y = 0; y < grid.length - 1; y++) {
    for (let x = 0; x < grid[y].length - 1; x++) {
      if (y !== 0) edges.push([x, y, "N"]);
      if (x !== 0) edges.push([x, y, "W"]);
    }
  }
  return edges;
}

function createInitialCells(grid: number[][]) {
  const cells = new DisjointSet<string>();
  for (let y = 0; y < grid.length - 1; y++) {
    for (let x = 0; x < grid[y].length - 1; x++) {
      cells.add(`${y}-${x}`);
    }
  }
  return cells;
}

// Pop a random edge until the two cells are disconnected or the array is empty
// Should probably shuffle the array and move the index instead
const popEdge = (
  edges: [number, number, "W" | "N"][],
  cells: DisjointSet<string>,
): [number, number, "W" | "N"] | null => {
  if (edges.length === 0) return null;
  const edge = edges.splice(Math.floor(Math.random() * edges.length), 1)[0];
  const [x, y, dir] = edge;
  const oppositeX = x - (dir === "W" ? 1 : 0);
  const oppositeY = y - (dir === "N" ? 1 : 0);
  const cellValue = `${y}-${x}`;
  const oppositeCellValue = `${oppositeY}-${oppositeX}`;
  if (!cells.connected(cellValue, oppositeCellValue)) {
    cells.union(cellValue, oppositeCellValue);
    return edge;
  } else {
    return popEdge(edges, cells);
  }
};

// Remove the edge from the grid by swapping the bits of the char accessor,
// eg ┼ (15) -> ┴ (11)
//    ┴ (11) -> ─ (14)
const removeEdge = (grid: number[][], edge: [number, number, "W" | "N"]) => {
  const newGrid = grid.map((row) => row.slice());
  const [x, y, dir] = edge;
  switch (dir) {
    case "W":
      newGrid[y][x] = grid[y][x] ^ (1 << 2);
      newGrid[y + 1][x] = grid[y + 1][x] ^ (1 << 0);
      break;
    case "N":
      newGrid[y][x] = grid[y][x] ^ (1 << 1);
      newGrid[y][x + 1] = grid[y][x + 1] ^ (1 << 3);
      break;
  }
  return newGrid;
};

export const AnimationMaze = ({ lines, width }: Dimensions) => {
  const initialGrid = useRef(createInitialGrid(lines, width));
  const edges = useRef(createInitialEdges(initialGrid.current));
  const cells = useRef(createInitialCells(initialGrid.current));
  const [grid, setGrid] = useState(initialGrid.current);

  // Reset when dimensions change
  useEffect(() => {
    initialGrid.current = createInitialGrid(lines, width);
    edges.current = createInitialEdges(initialGrid.current);
    cells.current = createInitialCells(initialGrid.current);
    setGrid(initialGrid.current);
  }, [lines, width]);

  useEffect(() => {
    const interval = setInterval(() => {
      const edge = popEdge(edges.current, cells.current);
      if (edge) {
        setGrid((oldGrid) => removeEdge(oldGrid, edge));
      } else {
        // Out of edges, reset
        edges.current = createInitialEdges(initialGrid.current);
        cells.current = createInitialCells(initialGrid.current);
        setGrid(initialGrid.current);
      }
    }, 30);

    return () => {
      clearInterval(interval);
    };
  }, [lines, width]);

  return (
    <div className={styles.grid}>
      {grid.flatMap((line, y) =>
        line.map((el, i) => (
          <span key={`${y}-${i}-${el}`}>{SINGLE_LINE_CHARS[el]}</span>
        ))
      )}
    </div>
  );
};
