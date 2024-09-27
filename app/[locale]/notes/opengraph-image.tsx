import { getOgImage } from "@/app/utils/getOgImage";

const size = { width: 1200, height: 630 };

export async function generateImageMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return [
    {
      id: "1",
      size,
      alt: locale === "en" ? "Notes" : "Note",
      contentType: "image/png",
    },
  ];
}

export default async function Image({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return await getOgImage(locale === "en" ? "Notes" : "Note");
}
