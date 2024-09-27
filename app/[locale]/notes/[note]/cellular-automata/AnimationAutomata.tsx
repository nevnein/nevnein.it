"use client";
import { useEffect, useState } from "react";
import { noise } from "@/components/HomeHeader/utils";

const LINES = 5;
const LINE_LENGTH = 60;

function applyRule90(p: (0 | 1)[]) {
  return p.map((_, i) => (p.at(i - 1)! ^ p.at((i + 1) % p.length)!) as 0 | 1);
}

function generateNextRow(grid: (0 | 1)[][], maxRows = LINES * 2): (0 | 1)[][] {
  const newGrid = grid.concat([applyRule90(grid[grid.length - 1])]);

  if (newGrid.length > maxRows) {
    return newGrid.slice(1);
  }

  return newGrid;
}

const BLOCKS = [
  " ",
  "▗",
  "▖",
  "▃",
  "▝",
  "▐",
  "▞",
  "▟",
  "▘",
  "▚",
  "▍",
  "▙",
  "▀",
  "▜",
  "▛",
  "▉",
];

function subgridToChar(a: 0 | 1, b: 0 | 1, c: 0 | 1, d: 0 | 1): string {
  return BLOCKS[(a << 3) | (b << 2) | (c << 1) | d];
}

export const renderGridToString = (grid: (0 | 1)[][]) => {
  let aggregate: string = "";

  for (let i = 0; i < grid.length; i += 2) {
    for (let j = 0; j < grid[i].length; j += 2) {
      aggregate += subgridToChar(
        grid[i][j],
        grid[i][j + 1],
        grid[i + 1]?.[j],
        grid[i + 1]?.[j + 1]
      );
    }
  }

  return aggregate;
};

const firstLine = new Array(LINE_LENGTH * 2)
  .fill(0)
  .map((_, i) => (noise.get(i, i, i) > 0.5 ? 1 : 0));

const initialGrid = [firstLine];

export const AnimationAutomata = () => {
  const [automataGrid, setAutomataGrid] = useState(initialGrid);

  useEffect(() => {
    const interval = setInterval(() => {
      setAutomataGrid(generateNextRow(automataGrid));
    }, 200);
    return () => {
      clearInterval(interval);
    };
  }, [automataGrid]);

  return (
    <div
      style={{
        whiteSpace: "break-spaces",
        lineBreak: "anywhere",
        marginBottom: "calc(var(--line) * 2)",
        height: `calc(var(--line) * ${LINES})`,
        gridColumn: `2 / 3`,
        fontFamily: "var(--font-code)",
      }}
    >
      {renderGridToString(automataGrid)}
    </div>
  );
};

const LINES_BIG = 60;
const LINE_LENGTH_BIG = 120;

const firstLineBig = new Array(LINE_LENGTH_BIG * 2)
  .fill(0)
  .map((_, i) => (noise.get(i, i, i) > 0.5 ? 1 : 0));

const initialGridBig = [firstLineBig];

export const AnimationAutomataBig = () => {
  const [automataGrid, setAutomataGrid] = useState(initialGridBig);

  useEffect(() => {
    const interval = setInterval(() => {
      setAutomataGrid(generateNextRow(automataGrid, LINES_BIG));
    }, 60);
    return () => {
      clearInterval(interval);
    };
  }, [automataGrid]);

  return (
    <div
      style={{
        whiteSpace: "break-spaces",
        lineBreak: "anywhere",
        marginBottom: "calc(var(--line) * 2)",
        height: `calc((var(--line) / 5) * ${LINES_BIG})`,
        fontSize: "0.5em",
        lineHeight: "1",
        gridColumn: `2 / 3`,
        fontFamily: "var(--font-code)",
      }}
    >
      {renderGridToString(automataGrid)}
    </div>
  );
};
