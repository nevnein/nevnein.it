import { locales } from "@/config";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { getAllNotes } from "./[note]/utils";
import Link from "next/link";
import * as Grid from "@/components/Grid";
import { CvH1 } from "@/components/Mdx";
import { Metadata } from "next";
import { getMetadata } from "@/app/utils/getMetadata";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadata(locale, "Notes");
}

export default async function Cv({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("Notes");

  const notes = await getAllNotes(locale);

  return (
    <>
      <div style={{ gridColumnStart: 2 }}>
        <nav
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Link href={`/${locale}`}>Home {`>`}</Link>
        </nav>
        <CvH1>{t("notes")}</CvH1>
        <p style={{ marginBottom: "var(--line)" }}>{t("intro")}</p>
        <p>{t("disclaimer")}</p>
      </div>
      {notes.map(({ slug, title, description, tags, published }) => (
        <article
          key={slug}
          style={{
            gridColumnStart: 1,
            gridColumnEnd: 4,
            marginTop: "var(--line)",
          }}
        >
          <Grid.GridProvider v="double">
            <Grid.Content>
              <h1
                style={{
                  fontWeight: "bold",
                  marginBottom: "var(--line)",
                }}
              >
                <Link href={`/${locale}/notes/${slug}`}>{title}</Link>
              </h1>
              <p style={{ marginBottom: "var(--line)" }}>{description}</p>
              <span>{tags}</span>
              <span
                style={{
                  position: "absolute",
                  right: "2ch",
                  top: "0",
                  background: "var(--background)",
                }}
              >
                {new Date(published).toLocaleString(locale, {
                  dateStyle: "short",
                })}
              </span>
            </Grid.Content>
          </Grid.GridProvider>
        </article>
      ))}
    </>
  );
}
