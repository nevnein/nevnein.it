import createMdx from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin();

const withMdx = createMdx({
  options: {
    remarkPlugins: ["remark-heading-id"],
    rehypePlugins: [
      [path.resolve('./rehype-shiki.mjs'), {
        inline: 'tailing-curly-colon',
        twoslash: {
          explicitTrigger: true,
        },
      }],
    ],
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
