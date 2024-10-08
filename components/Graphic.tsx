import clsx from "clsx";
import styles from "./Graphic.module.css";

export const Graphic = ({
  children,
  inline = false,
  weight = "normal",
  className,
}: {
  children: React.ReactNode;
  inline?: boolean;
  weight?: "normal" | "bold";
  className?: string;
}) => {
  const Element = inline ? "span" : "div";
  return (
    <Element
      aria-hidden="true"
      className={clsx(
        styles.graphic,
        weight === "bold" && styles.bold,
        className
      )}
    >
      {children}
    </Element>
  );
};
