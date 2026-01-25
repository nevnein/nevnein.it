import rehypeShiki from '@shikijs/rehype'
import { createHighlighter } from 'shiki'
import { rendererRich, transformerTwoslash } from "@shikijs/twoslash";
import { readFileSync } from "fs";
import path from "path";

const nightOwlLight = JSON.parse(
  readFileSync(path.resolve(process.cwd(), "app/utils/code-theme.json"), "utf8")
);

// Cache the highlighter as a singleton
let highlighterPromise = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [nightOwlLight],
      langs: ['ts', 'tsx', 'js', 'jsx'],
    });
  }
  return highlighterPromise;
}

export default function rehypeShikiWrapper(options) {
  return async (tree, file) => {
    const highlighter = await getHighlighter();

    const plugin = rehypeShiki({
      highlighter,
      theme: nightOwlLight,
      inline: options.inline,
      transformers: [
        transformerTwoslash({
          explicitTrigger: options.twoslash?.explicitTrigger,
          renderer: rendererRich(),
        }),
      ],
    })

    return plugin(tree, file)
  }
}