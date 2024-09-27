import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";
import { ImageResponseOptions } from "next/server";
import { resolve } from "path";

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#generate-images-using-code-js-ts-tsx
// https://github.com/vercel/satori#css

export const getOgImage = async (
  title: string,
  section?: string,
  extra?: string
): Promise<ImageResponse> => {
  const getFonts = async (): Promise<ImageResponseOptions["fonts"]> => {
    const fontPath = resolve(
      process.cwd().includes(".next") ? ".next/server/app/fonts" : "app/fonts"
    );
    console.log(fontPath);
    const regular = await readFile(
      resolve(fontPath, "BerkeleyMono-Regular.ttf")
    );
    const bold = await readFile(resolve(fontPath, "BerkeleyMono-Bold.ttf"));
    return [
      {
        name: "Berkeley Mono",
        data: regular,
        style: "normal",
        weight: 400,
      },
      {
        name: "Berkeley Mono",
        data: bold,
        style: "normal",
        weight: 600,
      },
    ];
  };

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "stretch",
          width: "100%",
        }}
      >
        <div
          style={{
            margin: "2rem",
            fontFamily: "Berkeley Mono",
            display: "flex",
            flexDirection: "column",
            border: "2px solid #adb5bd",
            alignItems: "stretch",
            flex: 1,
          }}
        >
          <p
            style={{
              fontSize: "2rem",
              padding: "2rem",
              margin: 0,
              borderBottom: "2px solid #adb5bd",
              display: "flex",
              letterSpacing: "0.125rem",
              gap: "1.25rem",
            }}
          >
            <b>NevNein</b>
            {section ? ` > ${section}` : null}
          </p>
          <h1
            style={{
              flex: 1,
              padding: "2rem",
              fontSize: "4rem",
              fontWeight: "bold",
              margin: 0,
              display: "block",
              lineClamp: '4 "…"',
              textWrap: "balance",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              padding: "2rem",
              margin: 0,
              display: "flex",
              justifyContent: "space-between",
              fontSize: "2rem",
            }}
          >
            <span>nevnein.it</span>
            {extra}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: await getFonts(),
    }
  );
};
