import createMdx from "@next/mdx";
import headingID from "remark-heading-id";
import createNextIntlPlugin from "next-intl/plugin";
import rehypeShiki from "@shikijs/rehype";
import { rendererRich, transformerTwoslash } from "@shikijs/twoslash";
import { readFileSync } from "fs";
import path from "path";

const nightOwlLight = JSON.parse(
  readFileSync(path.resolve(process.cwd(), "app/utils/code-theme.json"), "utf8")
);

const withNextIntl = createNextIntlPlugin();

/** @type {import("@shikijs/rehype").RehypeShikiOptions} */
const shikiOptions = {
  theme: nightOwlLight,
  transformers: [
    transformerTwoslash({
      explicitTrigger: true,
      renderer: rendererRich(),
    }),
  ],
  inline: "tailing-curly-colon",
};

const withMdx = createMdx({
  options: {
    remarkPlugins: [headingID],
    rehypePlugins: [[rehypeShiki, shikiOptions]],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  redirects() {
    return [
      {
        source: "/cv",
        destination: "/it/cv",
        permanent: true,
      },
      {
        source: "/adam-di-mario-cv.pdf",
        destination: "/it/cv",
        permanent: true,
      },
    ];
  },
};

export default withMdx(withNextIntl(nextConfig));
