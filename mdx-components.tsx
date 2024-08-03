import type { MDXComponents } from "mdx/types";
import {
  ExternalLink,
  H1,
  H2,
  H3,
  ListItem,
  Paragraph,
} from "./components/Mdx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: H1,
    h2: H2,
    h3: H3,
    p: Paragraph,
    a: ExternalLink,
    li: ListItem,
  };
}
