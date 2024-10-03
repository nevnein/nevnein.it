import { locales } from "@/config";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getAllNotes, getNote } from "./utils";
import { Graphic } from "@/components/Graphic";
import { Link } from "@/navigation";
import { NoteHeader } from "./NoteHeader";
import { Metadata } from "next";

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
        <NoteNavigation />
        <NoteHeader metadata={metadata} locale={locale} />
        <Content.default />
        <NoteNavigation
          style={{
            marginTop: "calc(var(--line) * 4)",
            marginBottom: "calc(var(--line) * 2)",
          }}
        />
      </>
    );
  } catch (error) {
    console.log(error);
    notFound();
  }
}

const NoteNavigation = ({ style }: { style?: React.CSSProperties }) => {
  return (
    <div
      style={{
        ...style,
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
        <Link href="/notes">
          <Graphic>{`<`}</Graphic> Notes
        </Link>
        <Link href="/">
          Home <Graphic>{`>`}</Graphic>
        </Link>
      </nav>
    </div>
  );
};
