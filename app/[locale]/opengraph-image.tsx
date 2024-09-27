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
      alt:
        locale === "en"
          ? "NevNein is Adam Di Mario's website"
          : "NevNein è il sito web di Adam Di Mario",
      contentType: "image/png",
    },
  ];
}

export default async function Image({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return await getOgImage(
    locale === "en"
      ? "NevNein is Adam Di Mario's website"
      : "NevNein è il sito web di Adam Di Mario"
  );
}
