import styles from "./MainContainer.module.css";

export const MainContainer = ({ children }: { children: React.ReactNode }) => {
  return <main className={styles.mainContainer}>{children}</main>;
};
