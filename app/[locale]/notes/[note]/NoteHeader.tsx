import * as Grid from "@/components/Grid";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NoteMetadata } from "./utils";
import styles from "./NoteHeader.module.css";

export const NoteHeader = async ({
  metadata,
  locale,
}: {
  metadata: NoteMetadata;
  locale: string;
}) => {
  setRequestLocale(locale);
  const t = await getTranslations("Notes");

  return (
    <header className={styles.noteHeader}>
      <Grid.GridProvider h="double">
        <Grid.Content>
          <h1 style={{ fontWeight: "bold", textTransform: "uppercase" }}>
            {metadata.title}
          </h1>
        </Grid.Content>
        <Grid.HRule type="double" />
        <Grid.Content>
          <div className={styles.metaContainer}>
            <span>{t("published")}</span>
            <span>
              {new Date(metadata.published).toLocaleString(locale, {
                dateStyle: "long",
              })}
            </span>
          </div>
        </Grid.Content>
        {metadata.lastModified !== metadata.published ? (
          <>
            <Grid.HRule type="single" />
            <Grid.Content>
              <div className={styles.metaContainer}>
                <span>{t("lastUpdated")}</span>
                <span>
                  {new Date(metadata.lastModified).toLocaleString(locale, {
                    dateStyle: "long",
                  })}
                </span>
              </div>
            </Grid.Content>
          </>
        ) : null}
        <Grid.HRule type="single" />
        <Grid.Content>
          <div className={styles.metaContainer}>
            <span>{t("topics")}</span>
            <span>{metadata.tags}</span>
          </div>
        </Grid.Content>
      </Grid.GridProvider>
    </header>
  );
};
