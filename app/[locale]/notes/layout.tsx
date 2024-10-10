import styles from "./layout.module.css";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className={styles.notesContainer}>{children}</main>;
}
