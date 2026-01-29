"use client";
import { createContext, useContext } from "react";
import styles from "./Grid.module.css";
import { Graphic } from "./Graphic";
import { BORDERS, BREAKS, CORNERS } from "./utils";

const H_FILL_COUNT = 500;
const V_FILL_COUNT = 100;

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
      <div className={styles.content}>{children}</div>
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
  return direction === "h" ? (
    <div className={styles.autofillH}>
      <Graphic>{filler.repeat(H_FILL_COUNT)}</Graphic>
    </div>
  ) : (
    <div className={styles.autofillV}>
      <div className={styles.autofillVInner}>
        {Array.from({ length: V_FILL_COUNT }, (_, i) => (
          <Graphic key={i}>{filler}</Graphic>
        ))}
      </div>
    </div>
  );
};

export { GridProvider, Content, HRule, Autofill };
