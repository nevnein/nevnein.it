"use client";
import { useEffect, useState } from "react";
import { AnimationLines } from "./AnimationLines";
import { AnimationNoise } from "./AnimationNoise";
import { MousePositionProvider } from "./MousePositionContext";
// import { AnimationInspector } from "./AnimationInspector";
import { AnimationMaze } from "./AnimationMaze";

const animations = [
  AnimationLines,
  AnimationNoise,
  AnimationMaze,
  // AnimationInspector,
];

export const Canvas = () => {
  const [animation, setAnimation] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

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
      <AnimationNoise />
    ) : (
      <div onClick={() => setAnimation((animation + 1) % animations.length)}>
        <MousePositionProvider>
          <Animation />
        </MousePositionProvider>
      </div>
    )
  ) : null;
};
