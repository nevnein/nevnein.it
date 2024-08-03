import styles from "./Graphic.module.css";

export const Graphic = ({
  children,
  weight = "normal",
}: {
  children: React.ReactNode;
  weight?: "normal" | "bold";
}) => {
  return (
    <div
      aria-hidden="true"
      className={`${styles.graphic} ${weight === "bold" ? styles.bold : ""}`}
    >
      {children}
    </div>
  );
};
