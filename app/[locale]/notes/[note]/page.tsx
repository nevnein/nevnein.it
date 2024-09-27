import { locales } from "@/config";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getAllNotes, getNote } from "./utils";
import { Graphic } from "@/components/Graphic";
import Link from "next/link";
import * as Grid from "@/components/Grid";
import { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = await getAllNotes("en");
  return slugs.flatMap(({ slug }) =>
    locales.map((locale) => ({ slug, locale }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params: { locale, note },
}: {
  params: { locale: string; note: string };
}): Promise<Metadata> {
  const { metadata } = await getNote(locale, note);
  return {
    title: metadata.title,
    description: metadata.description,
    creator: "Adam Di Mario",
    keywords: metadata.tags,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: `https://nevnein.it/${locale}/notes/${note}`,
    },
  };
}

export default async function Note({
  params: { locale, note },
}: {
  params: { locale: string; note: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("Notes");

  try {
    const { metadata, default: Content } = await getNote(locale, note);
    return (
      <>
        <div
          style={{
            gridColumnStart: 2,
            gridColumnEnd: 3,
          }}
        >
          <nav
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Link href={`/${locale}/notes`}>
              <Graphic>{`<`}</Graphic> Notes
            </Link>
            <Link href={`/${locale}`}>
              Home <Graphic>{`>`}</Graphic>
            </Link>
          </nav>
        </div>
        <div
          style={{
            gridColumnStart: 1,
            gridColumnEnd: 4,
            margin: "calc(var(--line) * 1) 0",
          }}
        >
          <Grid.GridProvider h="double">
            <Grid.Content>
              <h1 style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                {metadata.title}
              </h1>
            </Grid.Content>
            <Grid.HRule type="double" />
            <Grid.Content>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{t("published")}</span>
                {new Date(metadata.published).toLocaleString(locale, {
                  dateStyle: "long",
                })}
              </div>
            </Grid.Content>
            {metadata.lastModified !== metadata.published ? (
              <>
                <Grid.HRule type="single" />
                <Grid.Content>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>{t("lastUpdated")}</span>
                    {new Date(metadata.lastModified).toLocaleString(locale, {
                      dateStyle: "long",
                    })}
                  </div>
                </Grid.Content>
              </>
            ) : null}
            <Grid.HRule type="single" />
            <Grid.Content>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{t("topics")}</span>
                {metadata.tags}
              </div>
            </Grid.Content>
          </Grid.GridProvider>
        </div>
        <Content />
        <div
          style={{
            gridColumnStart: 2,
            gridColumnEnd: 3,
            marginTop: "calc(var(--line) * 4)",
            marginBottom: "calc(var(--line) * 2)",
          }}
        >
          <nav
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Link href={`/${locale}/notes`}>
              <Graphic>{`<`}</Graphic> Notes
            </Link>
            <Link href={`/${locale}`}>
              Home <Graphic>{`>`}</Graphic>
            </Link>
          </nav>
        </div>
      </>
    );
  } catch (error) {
    notFound();
  }
}
