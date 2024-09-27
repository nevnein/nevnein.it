"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import styles from "./Grid.module.css";
import { Graphic } from "./Graphic";
import { BORDERS, BREAKS, CORNERS } from "./utils";

type GridType = "single" | "double";

type GridContext = {
  top: GridType;
  left: GridType;
  right: GridType;
  bottom: GridType;
};

const GridContext = createContext<GridContext>({
  top: "single",
  left: "single",
  right: "single",
  bottom: "single",
});

type GridProps = {
  children: React.ReactNode;
  type?: GridType;
  h?: GridType;
  v?: GridType;
} & Partial<GridContext>;

function GridProvider({
  children,
  type,
  h,
  v,
  top,
  left,
  right,
  bottom,
}: GridProps) {
  const grid = {
    top: top ?? h ?? type ?? "single",
    left: left ?? v ?? type ?? "single",
    right: right ?? v ?? type ?? "single",
    bottom: bottom ?? h ?? type ?? "single",
  };
  return (
    <GridContext.Provider value={grid}>
      <div className={styles.grid}>
        <Graphic>{CORNERS[grid.top][grid.left].tl}</Graphic>
        <Autofill direction="h" filler={BORDERS[grid.top].h} />
        <Graphic>{CORNERS[grid.top][grid.right].tr}</Graphic>
        {children}
        <Graphic>{CORNERS[grid.top][grid.left].bl}</Graphic>
        <Autofill direction="h" filler={BORDERS[grid.bottom].h} />
        <Graphic>{CORNERS[grid.top][grid.right].br}</Graphic>
      </div>
    </GridContext.Provider>
  );
}

const Content = ({ children }: { children: React.ReactNode }) => {
  const grid = useContext(GridContext);

  return (
    <>
      <Autofill direction="v" filler={BORDERS[grid.left].v} />
      <div style={{ padding: "0 1ch" }}>{children}</div>
      <Autofill direction="v" filler={BORDERS[grid.right].v} />
    </>
  );
};

const HRule = ({ type }: { type?: GridType }) => {
  const grid = useContext(GridContext);
  const computedType = type ?? grid.top;

  return (
    <>
      <Graphic>{BREAKS[grid.left][computedType].l}</Graphic>
      <Autofill direction="h" filler={BORDERS[computedType].h} />
      <Graphic>{BREAKS[grid.right][computedType].r}</Graphic>
    </>
  );
};

const Autofill = ({
  direction,
  filler,
}: {
  direction: "h" | "v";
  filler: string;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const [charNumber, setCharNumber] = useState(90);

  useEffect(() => {
    const base = document.getElementById("measurer")?.getBoundingClientRect();
    const baseHeight = base?.height || 1;
    const baseWidth = base?.width || 1;

    if (container.current) {
      const { width, height } = container.current.getBoundingClientRect();
      setCharNumber(
        Math.round(direction === "h" ? width / baseWidth : height / baseHeight)
      );
    }
  }, [direction]);

  return direction === "h" ? (
    <div
      ref={container}
      style={{
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <Graphic>{filler.repeat(charNumber)}</Graphic>
    </div>
  ) : (
    <div
      ref={container}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "grid",
          gridAutoRows: "var(--line)",
          gridAutoColumns: "1ch",
          maxHeight: "fill-available",
          overflow: "hidden",
        }}
      >
        {new Array(charNumber).fill(filler).map((c, i) => (
          <Graphic key={i}>{c}</Graphic>
        ))}
      </div>
    </div>
  );
};

export { GridProvider, Content, HRule, Autofill };
