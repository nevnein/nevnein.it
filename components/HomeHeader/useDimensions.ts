"use client";
import { useEffect, useState, useSyncExternalStore } from "react";

type Dimensions = {
  lines: number;
  width: number;
};

const DEFAULT_DIMENSIONS: Dimensions = { lines: 5, width: 60 };

function getDimensions(): Dimensions {
  const style = getComputedStyle(document.documentElement);
  const lines = parseInt(style.getPropertyValue("--header-lines").trim(), 10);
  const width = parseInt(style.getPropertyValue("--header-width").trim(), 10);

  return {
    lines: isNaN(lines) ? DEFAULT_DIMENSIONS.lines : lines,
    width: isNaN(width) ? DEFAULT_DIMENSIONS.width : width,
  };
}

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getServerSnapshot(): Dimensions {
  return DEFAULT_DIMENSIONS;
}

export function useDimensions(): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>(DEFAULT_DIMENSIONS);

  useEffect(() => {
    const update = () => setDimensions(getDimensions());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return dimensions;
}
