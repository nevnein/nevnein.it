import { BerkeleyMono } from "@/app/utils/BerkeleyMono";
import styles from "./layout.module.css";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={styles.notesContainer}>
      <div className={BerkeleyMono.className} style={{ display: "contents" }}>
        {children}
      </div>
    </main>
  );
}
