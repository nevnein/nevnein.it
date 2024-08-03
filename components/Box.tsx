import styles from "./Box.module.css";
import { Graphic } from "./Graphic";

type Borders = {
  h: string;
  v: string;
  tl: string;
  tr: string;
  bl: string;
  br: string;
  c: string;
  lt: string;
  rt: string;
  bt: string;
  tt: string;
};

const BORDERS: Record<"single" | "double", Borders> = {
  single: {
    h: "─",
    v: "│",
    tl: "┌",
    tr: "┐",
    bl: "└",
    br: "┘",
    c: "┼",
    lt: "├",
    rt: "┤",
    bt: "┴",
    tt: "┬",
  },
  double: {
    h: "═",
    v: "║",
    tl: "╔",
    tr: "╗",
    bl: "╚",
    br: "╝",
    c: "╬",
    lt: "╠",
    rt: "╣",
    bt: "╩",
    tt: "╦",
  },
};

export const Box = ({
  children,
  width,
  height,
  type,
}: {
  children: React.ReactNode;
  width: number;
  height: number;
  type: "single" | "double";
}) => {
  return (
    <div className={styles.box}>
      <Graphic>{BORDERS[type].tl}</Graphic>
      <Separator width={width - 2} type={type} />
      <Graphic>{BORDERS[type].tr}</Graphic>

      <div style={{ gridColumn: "2 / span 1", gridRow: `2 / span ${height}` }}>
        {children}
      </div>

      {[...Array(height * 2)].map((_, i) => (
        <Graphic key={i}>{BORDERS[type].v}</Graphic>
      ))}

      <Graphic>{BORDERS[type].bl}</Graphic>
      <Separator width={width - 2} type={type} />
      <Graphic>{BORDERS[type].br}</Graphic>
    </div>
  );
};

export const Separator = ({
  width,
  type,
  weight = "normal",
}: {
  width: number;
  type: "single" | "double";
  weight?: "normal" | "bold";
}) => {
  return (
    <Graphic weight={weight}>
      {new Array(width).fill(BORDERS[type].h).join("")}
    </Graphic>
  );
};
