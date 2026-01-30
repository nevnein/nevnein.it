"use client";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Dimensions } from "./utils";
import { MousePositionContext } from "./MousePositionContext";
import styles from "./AnimationInspector.module.css";

// Generate a pseudo-random hash that changes over time
const generateHash = (seed: number) => {
  const hash = ((seed * 1103515245 + 12345) >>> 0)
    .toString(16)
    .padStart(8, "0");
  return hash.toUpperCase();
};

// Convert number to binary with fixed width
const toBinary = (n: number, bits = 12) =>
  Math.abs(Math.floor(n)).toString(2).padStart(bits, "0");

// Sparkline characters (8 levels)
const SPARK_CHARS = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];

// Generate sparkline from array of values
const sparkline = (
  values: number[],
  width: number,
  min?: number,
  max?: number,
) => {
  if (values.length === 0) return " ".repeat(width);

  const actualMin = min ?? Math.min(...values);
  const actualMax = max ?? Math.max(...values);
  const range = actualMax - actualMin || 1;

  // Take last `width` values, pad with zeros if needed
  const slice = values.slice(-width);
  const padded = [...Array(width - slice.length).fill(actualMin), ...slice];

  return padded
    .map((v) => {
      const normalized = (v - actualMin) / range;
      const index = Math.min(
        Math.floor(normalized * SPARK_CHARS.length),
        SPARK_CHARS.length - 1,
      );
      return SPARK_CHARS[index];
    })
    .join("");
};

// Format timestamp as HH:MM:SS.mmm
const formatTime = (date: Date) => {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");
  const ms = date.getMilliseconds().toString().padStart(3, "0");
  return `${h}:${m}:${s}.${ms}`;
};

type PerformanceExtended = Performance & {
  interactionCount?: number;
  eventCounts?: Map<string, number>;
};

// Get random hex from crypto
const getRandomHex = (bytes: number) => {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
};

// Get event counts from performance API
const getEventCounts = () => {
  const perf = performance as PerformanceExtended;
  if (!perf.eventCounts) return null;
  return {
    click: perf.eventCounts.get("click") ?? 0,
    keydown: perf.eventCounts.get("keydown") ?? 0,
    pointerdown: perf.eventCounts.get("pointerdown") ?? 0,
  };
};

const GRAPH_WIDTH = 24;
const HISTORY_SIZE = 60;

export const AnimationInspector = ({ lines, width }: Dimensions) => {
  const [x, y] = useContext(MousePositionContext);
  const rAFref = useRef<number>(undefined);
  const times = useRef<number[]>([]);
  const lastEventRef = useRef<{ type: string; time: Date } | null>(null);
  const lastFrameTime = useRef(performance.now());
  const lastMousePos = useRef({ x: 0, y: 0 });

  // History for graphs
  const history = useRef({
    fps: [] as number[],
    frameTime: [] as number[],
    mouseSpeed: [] as number[],
    interactions: [] as number[],
  });

  const [frameData, setFrameData] = useState({
    fps: 0,
    timestamp: new Date(),
    frameCount: 0,
    frameTime: 0,
    interactionCount: 0,
    lastEvent: null as { type: string; time: Date } | null,
    eventCounts: null as {
      click: number;
      keydown: number;
      pointerdown: number;
    } | null,
    cryptoHex: "",
    cryptoUUID: "",
    graphs: {
      fps: "",
      frameTime: "",
      mouseSpeed: "",
      interactions: "",
    },
  });

  const [hoveredElement, setHoveredElement] = useState<{
    tag: string;
    id: string;
    classes: string;
    dimensions: string;
    position: string;
    text: string;
    attrs: string;
  } | null>(null);

  const animate = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastFrameTime.current;
    lastFrameTime.current = now;

    while (times.current.length > 0 && times.current[0] <= now - 1000) {
      times.current.shift();
    }
    times.current.push(now);

    const currentFps = times.current.length;
    const interactionCount =
      (performance as PerformanceExtended).interactionCount ?? 0;

    // Update history (keep last HISTORY_SIZE entries)
    const h = history.current;
    h.fps.push(currentFps);
    h.frameTime.push(deltaTime);
    h.interactions.push(interactionCount);
    if (h.fps.length > HISTORY_SIZE) h.fps.shift();
    if (h.frameTime.length > HISTORY_SIZE) h.frameTime.shift();
    if (h.interactions.length > HISTORY_SIZE) h.interactions.shift();

    setFrameData((prev) => {
      // Calculate mouse speed
      const dx = x - lastMousePos.current.x;
      const dy = y - lastMousePos.current.y;
      const mouseSpeed = Math.sqrt(dx * dx + dy * dy);
      lastMousePos.current = { x, y };
      h.mouseSpeed.push(mouseSpeed);
      if (h.mouseSpeed.length > HISTORY_SIZE) h.mouseSpeed.shift();

      return {
        fps: currentFps,
        timestamp: new Date(),
        frameCount: prev.frameCount + 1,
        frameTime: deltaTime,
        interactionCount,
        lastEvent: lastEventRef.current,
        eventCounts: getEventCounts(),
        cryptoHex:
          prev.frameCount % 10 === 0 ? getRandomHex(4) : prev.cryptoHex,
        cryptoUUID:
          prev.frameCount % 60 === 0 ? crypto.randomUUID() : prev.cryptoUUID,
        graphs: {
          fps: sparkline(h.fps, GRAPH_WIDTH, 0, 120),
          frameTime: sparkline(h.frameTime, GRAPH_WIDTH, 0, 50),
          mouseSpeed: sparkline(h.mouseSpeed, GRAPH_WIDTH, 0, 100),
          interactions: sparkline(h.interactions, GRAPH_WIDTH),
        },
      };
    });

    if (rAFref.current !== null) {
      rAFref.current = requestAnimationFrame(animate);
    }
  }, [x, y]);

  useEffect(() => {
    const capture = (e: Event) => {
      lastEventRef.current = { type: e.type, time: new Date() };
    };
    const events = [
      "mousemove",
      "mousedown",
      "mouseup",
      "click",
      "keydown",
      "keyup",
      "wheel",
      "touchstart",
      "touchend",
    ];
    events.forEach((name) => window.addEventListener(name, capture, true));
    return () =>
      events.forEach((name) => window.removeEventListener(name, capture, true));
  }, []);

  useEffect(() => {
    rAFref.current = requestAnimationFrame(animate);
    return () => {
      if (rAFref.current) {
        cancelAnimationFrame(rAFref.current);
      }
    };
  }, [animate]);

  // Track hovered element
  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.elementFromPoint(x, y);
    if (!el) {
      setHoveredElement(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    const classes = Array.from(el.classList).join(" ");
    const textContent = el.textContent?.slice(0, 20) ?? "";
    const attrs = Array.from(el.attributes)
      .filter((a) => !["id", "class", "style"].includes(a.name))
      .slice(0, 3)
      .map((a) => `${a.name}="${a.value.slice(0, 10)}"`)
      .join(" ");

    setHoveredElement({
      tag: el.tagName.toLowerCase(),
      id: el.id || "—",
      classes: classes || "—",
      dimensions: `${Math.round(rect.width)}×${Math.round(rect.height)}`,
      position: `${Math.round(rect.left)},${Math.round(rect.top)}`,
      text: textContent
        ? `"${textContent}${textContent.length >= 20 ? "…" : ""}"`
        : "—",
      attrs: attrs || "—",
    });
  }, [x, y]);

  // Static navigator/env (read once, safe for SSR)
  const nav = typeof navigator !== "undefined" ? navigator : null;
  const staticProps = {
    dpr: typeof window !== "undefined" ? window.devicePixelRatio : 1,
    platform: nav?.platform ?? "N/A",
    language: nav?.language ?? "N/A",
    vendor: nav?.vendor ?? "N/A",
    hardwareConcurrency: nav?.hardwareConcurrency ?? "N/A",
    maxTouchPoints: nav?.maxTouchPoints ?? "N/A",
  };

  // Aesthetic values (dynamic)
  const mouseHex =
    `#${(x & 0xff).toString(16).padStart(2, "0")}${(y & 0xff).toString(16).padStart(2, "0")}${((x + y) & 0xff).toString(16).padStart(2, "0")}`.toUpperCase();
  const cyclingHash = generateHash(frameData.frameCount);
  const mouseBinary = `${toBinary(x)} ${toBinary(y)}`;
  const fakeAddress = `0x${(0x7fff0000 + ((frameData.frameCount * 16) & 0xffff)).toString(16).toUpperCase()}`;

  return (
    <div className={styles.container}>
      {/* Top left - Static props */}
      <pre className={`${styles.panel} ${styles.panelTop}`}>
        {`NAV.plat ${staticProps.platform}`}
        <br />
        {`NAV.lang ${staticProps.language}`}
        <br />
        {`NAV.vend ${staticProps.vendor}`}
        <br />
        {`NAV.cpus ${staticProps.hardwareConcurrency}`}
        <br />
        {`NAV.pts  ${staticProps.maxTouchPoints}`}
        <br />
        {`DPR      ${staticProps.dpr}`}
      </pre>

      {/* Top right - Graphs */}
      <pre className={`${styles.panelRight} ${styles.panelTop}`}>
        {`┌${"─".repeat(GRAPH_WIDTH)}┐`}
        <br />
        {`FPS │${frameData.graphs.fps}│`}
        <br />
        {`├${"─".repeat(GRAPH_WIDTH)}┤`}
        <br />
        {`Δt │${frameData.graphs.frameTime}│`}
        <br />
        {`├${"─".repeat(GRAPH_WIDTH)}┤`}
        <br />
        {`PTR │${frameData.graphs.mouseSpeed}│`}
        <br />
        {`├${"─".repeat(GRAPH_WIDTH)}┤`}
        <br />
        {`INT │${frameData.graphs.interactions}│`}
        <br />
        {`└${"─".repeat(GRAPH_WIDTH)}┘`}
      </pre>

      {/* Bottom left - Dynamic data */}
      <pre className={`${styles.panel} ${styles.panelBottom}`}>
        {`TIME     ${formatTime(frameData.timestamp)}`}
        <br />
        {`FPS      ${frameData.fps}`}
        <br />
        {`FRAME    ${frameData.frameCount}`}
        <br />
        {`DELTA    ${frameData.frameTime.toFixed(1)}ms`}
        <br />
        {`INTERACT ${frameData.interactionCount}`}
        <br />
        {`EVENT    ${frameData.lastEvent?.type ?? "—"}`}
        <br />
        {`MOUSE    ${x}, ${y}`}
        <br />
        {`MOUSE.#  ${mouseHex}`}
        <br />
        {`HASH     ${cyclingHash}`}
        <br />
        {`ADDR     ${fakeAddress}`}
      </pre>

      {/* Bottom right - Element inspector */}
      <pre className={`${styles.panelRight} ${styles.panelBottom}`}>
        {`┌${"─".repeat(GRAPH_WIDTH)}┐`}
        <br />
        {`TAG  │${(hoveredElement?.tag ?? "—").padStart(GRAPH_WIDTH)}│`}
        <br />
        {`├${"─".repeat(GRAPH_WIDTH)}┤`}
        <br />
        {`TEXT │${(hoveredElement?.text ?? "—").slice(0, GRAPH_WIDTH).padStart(GRAPH_WIDTH)}│`}
        <br />
        {`├${"─".repeat(GRAPH_WIDTH)}┤`}
        <br />
        {`SIZE │${(hoveredElement?.dimensions ?? "—").padStart(GRAPH_WIDTH)}│`}
        <br />
        {`├${"─".repeat(GRAPH_WIDTH)}┤`}
        <br />
        {`POS  │${(hoveredElement?.position ?? "—").padStart(GRAPH_WIDTH)}│`}
        <br />
        {`└${"─".repeat(GRAPH_WIDTH)}┘`}
      </pre>
    </div>
  );
};
