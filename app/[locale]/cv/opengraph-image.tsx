import { getOgImage } from "@/app/utils/getOgImage";

const size = { width: 1200, height: 630 };

export async function generateImageMetadata() {
  return [
    {
      id: "1",
      size,
      alt: "Curriculum Vitæ",
      contentType: "image/png",
    },
  ];
}

export default async function Image() {
  return await getOgImage("Adam Di Mario, Curriculum Vitæ");
}
