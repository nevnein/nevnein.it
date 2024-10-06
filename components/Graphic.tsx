import clsx from "clsx";
import styles from "./Graphic.module.css";

export const Graphic = ({
  children,
  weight = "normal",
  className,
}: {
  children: React.ReactNode;
  weight?: "normal" | "bold";
  className?: string;
}) => {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        styles.graphic,
        weight === "bold" && styles.bold,
        className
      )}
    >
      {children}
    </div>
  );
};
