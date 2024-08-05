import withMDX from "@next/mdx";
import headingID from "remark-heading-id";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

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
    ];
  },
};

export default withMDX({
  options: {
    remarkPlugins: [headingID],
  },
})(withNextIntl(nextConfig));
