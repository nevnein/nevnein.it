"use client";
import { useEffect, useState } from "react";
import { AnimationLines } from "./AnimationLines";
import { AnimationNoise } from "./AnimationNoise";
import { MousePositionProvider } from "./MousePositionContext";
import { AnimationMaze } from "./AnimationMaze";
import { useDimensions } from "./useDimensions";
import type { Dimensions } from "./utils";
import { AnimationWave } from "./AnimationWave";
import { AnimationInspector } from "./AnimationInspector";

const animations: React.FC<Dimensions>[] = [
  AnimationLines,
  AnimationNoise,
  AnimationMaze,
  AnimationWave,
  AnimationInspector,
];

export const Canvas = () => {
  const [animation, setAnimation] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const dimensions = useDimensions();

  const Animation = animations[animation];

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = () => {
      setIsRunning(!reducedMotion.matches);
    };
    listener();
    reducedMotion.addEventListener("change", listener);
    return () => {
      reducedMotion.removeEventListener("change", listener);
    };
  }, []);

  useEffect(() => {
    const smallScreen = window.matchMedia("(max-width: 40rem)");
    const listener = () => {
      setIsSmallScreen(smallScreen.matches);
    };
    listener();
    smallScreen.addEventListener("change", listener);
    return () => {
      smallScreen.removeEventListener("change", listener);
    };
  }, []);

  return isRunning ? (
    isSmallScreen ? (
      <AnimationNoise {...dimensions} />
    ) : (
      <div onClick={() => setAnimation((animation + 1) % animations.length)}>
        <MousePositionProvider>
          <Animation {...dimensions} />
        </MousePositionProvider>
      </div>
    )
  ) : null;
};
