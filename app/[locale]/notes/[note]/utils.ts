import { readdir } from "fs/promises";
import { resolve } from "path";

export type NoteMetadata = {
  title: string;
  description: string;
  tags: string;
  published: string;
  lastModified: string;
};

export const getAllNotes = async (locale: string) => {
  const slugs = (
    await readdir(resolve(process.cwd(), "app/[locale]/notes/[note]"), {
      withFileTypes: true,
    })
  )
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const notes = await Promise.all(
    slugs.map(async (name) => {
      const { metadata } = await import(
        `@/app/[locale]/notes/[note]/${name}/${locale}.mdx`
      );
      return { slug: name, ...metadata } as NoteMetadata & { slug: string };
    })
  );

  notes.sort((a, b) => +new Date(b.published) - +new Date(a.published));

  return notes;
};

export const getNote = async (locale: string, slug: string) => {
  return (await import(
    `@/app/[locale]/notes/[note]/${slug}/${locale}.mdx`
  )) as { metadata: NoteMetadata; default: () => JSX.Element };
};
