"use client";
import { useContext, useEffect, useState } from "react";
import { MousePositionContext } from "./MousePositionContext";
import { LINES, LINE_LENGTH, noise } from "./utils";
import { BerkeleyMono } from "@/app/utils/BerkeleyMono";

const CHARS = [
  " ",
  ".",
  ":",
  ",",
  "'",
  "-",
  "^",
  "*",
  "+",
  "?",
  "!",
  "|",
  "=",
  "0",
  "#",
  "X",
  "%",
  "W",
  "M",
  "@",
];

export const AnimationNoise = () => {
  const [mouseX, mouseY] = useContext(MousePositionContext);
  const [z, setZ] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setZ((z) => z + 0.01);
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const Result = new Array(LINE_LENGTH * LINES).fill("0").map((_, i) => {
    const x = i % LINE_LENGTH;
    const y = (i - (i % LINE_LENGTH)) / LINE_LENGTH;
    const noiseValue = noise.get(
      (x + mouseX / 20) / 20,
      (y + mouseY / 20) / 10,
      z
    );
    const position = Math.floor(noiseValue * CHARS.length);
    return CHARS[position];
  });

  return (
    <div
      className={BerkeleyMono.className}
      style={{ lineBreak: "anywhere", overflow: "hidden", height: "100%" }}
    >
      {Result.join("")}
    </div>
  );
};
