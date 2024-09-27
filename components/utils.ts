import { ReactElement, ReactNode } from "react";

export const BORDERS = {
  single: {
    h: "─",
    v: "│",
  },
  double: {
    h: "═",
    v: "║",
  },
} as const;

export const CORNERS = {
  single: {
    single: {
      tl: "┌",
      tr: "┐",
      bl: "└",
      br: "┘",
    },
    double: {
      tl: "╓",
      tr: "╖",
      bl: "╙",
      br: "╜",
    },
  },
  double: {
    double: {
      tl: "╔",
      tr: "╗",
      bl: "╚",
      br: "╝",
    },
    single: {
      tl: "╒",
      tr: "╕",
      bl: "╘",
      br: "╛",
    },
  },
};

export const BREAKS = {
  single: {
    single: {
      t: "┬",
      b: "┴",
      l: "├",
      r: "┤",
    },
    double: {
      t: "╥",
      b: "╨",
      l: "╞",
      r: "╡",
    },
  },
  double: {
    double: {
      t: "╦",
      b: "╩",
      l: "╠",
      r: "╣",
    },
    single: {
      t: "╤",
      b: "╧",
      l: "╟",
      r: "╢",
    },
  },
} as const;

export const isReactElement = (node: ReactNode): node is ReactElement => {
  return typeof node === "object" && node !== null && "props" in node;
};
