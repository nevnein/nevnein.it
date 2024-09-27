"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { MousePositionContext } from "./MousePositionContext";
import { LINES, LINE_LENGTH } from "./utils";

const getChar = (angle: number): [string, number] => {
  if (
    (angle >= -Math.PI / 16 && angle < Math.PI / 16) ||
    angle >= (15 * Math.PI) / 16 ||
    angle < (-15 * Math.PI) / 16
  ) {
    return ["-", 0];
  }
  if (
    (angle >= Math.PI / 16 && angle < (3 * Math.PI) / 16) ||
    (angle >= (-15 * Math.PI) / 16 && angle < (-13 * Math.PI) / 16)
  ) {
    return ["\\", -45];
  }
  if (
    (angle >= (3 * Math.PI) / 16 && angle < (5 * Math.PI) / 16) ||
    (angle >= (-13 * Math.PI) / 16 && angle < (-11 * Math.PI) / 16)
  ) {
    return ["⟍", 0];
  }
  if (
    (angle >= (5 * Math.PI) / 16 && angle < (7 * Math.PI) / 16) ||
    (angle >= (-11 * Math.PI) / 16 && angle < (-9 * Math.PI) / 16)
  ) {
    return ["\\", 0];
  }
  if (
    (angle >= (7 * Math.PI) / 16 && angle < (9 * Math.PI) / 16) ||
    (angle >= (-9 * Math.PI) / 16 && angle < (-7 * Math.PI) / 16)
  ) {
    return ["|", 0];
  }
  if (
    (angle >= (9 * Math.PI) / 16 && angle < (11 * Math.PI) / 16) ||
    (angle >= (-7 * Math.PI) / 16 && angle < (-5 * Math.PI) / 16)
  ) {
    return ["/", 0];
  }
  if (
    (angle >= (11 * Math.PI) / 16 && angle < (13 * Math.PI) / 16) ||
    (angle >= (-5 * Math.PI) / 16 && angle < (-3 * Math.PI) / 16)
  ) {
    return ["⟋", 0];
  }
  if (
    (angle >= (13 * Math.PI) / 16 && angle < (15 * Math.PI) / 16) ||
    (angle >= (-3 * Math.PI) / 16 && angle < -Math.PI / 16)
  ) {
    return ["/", 45];
  }
  return ["0", 0];
};

const AnimatedLine = () => {
  const [x, y] = useContext(MousePositionContext);
  const elementRef = useRef<HTMLDivElement>(null);
  const [boundingBox, setBoundingBox] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const measureBoundingBox = () => {
      if (elementRef.current) {
        const boundingBox = elementRef.current.getBoundingClientRect();
        setBoundingBox(boundingBox);
      }
    };
    measureBoundingBox();
    window.addEventListener("resize", measureBoundingBox);
    return () => {
      window.removeEventListener("resize", measureBoundingBox);
    };
  }, []);

  const angle = Math.atan2(
    y - (boundingBox.y + boundingBox.height / 2),
    x - (boundingBox.x + boundingBox.width / 2)
  );

  const [char, rotation] = getChar(angle);

  return (
    <div
      ref={elementRef}
      style={{
        width: "1ch",
        marginRight: "1ch",
        height: "var(--line)",
        display: "inline-block",
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {char}
    </div>
  );
};

const lines = new Array((LINES / 2) * LINE_LENGTH).fill(AnimatedLine);

export const AnimationLines = () => {
  return (
    <>
      {lines.map((Line, i) => (
        <Line key={i} />
      ))}
    </>
  );
};
