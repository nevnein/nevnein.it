import withMDX from "@next/mdx";
import headingID from "remark-heading-id";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

export default withMDX({
  options: {
    remarkPlugins: [headingID],
  },
})(withNextIntl(nextConfig));
