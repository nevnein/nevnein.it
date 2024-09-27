import { getNote } from "./utils";
import { getOgImage } from "@/app/utils/getOgImage";

const size = { width: 1200, height: 630 };

export async function generateImageMetadata({
  params: { locale, note },
}: {
  params: { locale: string; note: string };
}) {
  const {
    metadata: { title },
  } = await getNote(locale, note);

  return [
    {
      id: note,
      size,
      alt: title,
      contentType: "image/png",
    },
  ];
}

export default async function Image({
  params: { locale, note },
}: {
  params: { locale: string; note: string };
}) {
  const {
    metadata: { title, published },
  } = await getNote(locale, note);

  return await getOgImage(title, locale === "en" ? "Notes" : "Note", published);
}
