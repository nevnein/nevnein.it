import type { UseMdxComponents } from "@mdx-js/mdx";
import {
  Blockquote,
  Code,
  ExternalLink,
  H1,
  H2,
  H3,
  ListItem,
  Paragraph,
  UnorderedList,
} from "./components/Mdx";

const components = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: Paragraph,
  a: ExternalLink,
  li: ListItem,
  blockquote: Blockquote,
  ul: UnorderedList,
  pre: Code,
};

export const useMDXComponents = () => {
  return components;
};
