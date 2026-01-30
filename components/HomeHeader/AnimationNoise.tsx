"use client";
import { useContext, useEffect, useState } from "react";
import { MousePositionContext } from "./MousePositionContext";
import { noise, type Dimensions } from "./utils";
import styles from "./AnimationNoise.module.css";

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

export const AnimationNoise = ({ lines, width }: Dimensions) => {
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

  const Result = new Array(width * lines).fill("0").map((_, i) => {
    const x = i % width;
    const y = (i - (i % width)) / width;
    const noiseValue = noise.get(
      (x + mouseX / 20) / 20,
      (y + mouseY / 20) / 10,
      z
    );
    const position = Math.floor(noiseValue * CHARS.length);
    return CHARS[position];
  });

  return <div className={styles.container}>{Result.join("")}</div>;
};
