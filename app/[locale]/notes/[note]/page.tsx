import { locales } from "@/config";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getAllNotes, getNote } from "./utils";
import { Graphic } from "@/components/Graphic";
import { Link } from "@/navigation";
import { NoteHeader } from "./NoteHeader";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateStaticParams() {
  const slugs = await getAllNotes("en");
  return slugs.flatMap(({ slug }) =>
    locales.map((locale) => ({ note: slug, locale }))
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
    alternates: {
      canonical: `https://nevnein.it/${locale}/notes/${note}`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          `https://nevnein.it/${locale}/notes/${note}`,
        ])
      ),
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
    const Content = await import(
      `@/app/[locale]/notes/[note]/${note}/${locale}.mdx`
    );
    const { metadata } = Content;
    return (
      <>
        <div style={{ gridColumnStart: 2 }}>
          <Breadcrumbs
            links={[
              { label: t("notes"), link: "/notes" },
              { label: metadata.title, link: `/notes/${note}` },
            ]}
          />
        </div>
        <NoteHeader metadata={metadata} locale={locale} />
        <Content.default />
      </>
    );
  } catch (error) {
    console.log(error);
    notFound();
  }
}
