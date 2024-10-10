"use client";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { LINES } from "./utils";
import { MousePositionContext } from "./MousePositionContext";

export const AnimationInspector = () => {
  const [x, y] = useContext(MousePositionContext);
  const rAFref = useRef<null | number>();
  const times = useRef<number[]>([]);
  const [fps, setFps] = useState(0);

  const animate = useCallback(() => {
    const now = performance.now();
    while (times.current.length > 0 && times.current[0] <= now - 1000) {
      times.current.shift();
    }
    times.current.push(now);
    setFps(times.current.length);
    if (rAFref.current !== null) {
      rAFref.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    rAFref.current = requestAnimationFrame(animate);
    return () => {
      if (rAFref.current) {
        cancelAnimationFrame(rAFref.current);
      }
    };
  }, [animate]);

  return (
    <>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          lineBreak: "anywhere",
          maxHeight: `calc(var(--line) * ${LINES})`,
          overflow: "hidden",
        }}
      >
        {navigator.userAgent}
        <br />
        {`FPS: ${fps}`}
        <br />
        {`Mouse: ${x}, ${y}`}
        <br />
        {document.activeElement?.tagName}
      </pre>
    </>
  );
};
