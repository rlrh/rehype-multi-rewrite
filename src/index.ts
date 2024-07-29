import { Plugin } from "unified";
import { Root, Element, ElementContent, RootContent } from "hast";
import { visit } from "unist-util-visit";
import { selectAll } from "hast-util-select";
import { Test } from "unist-util-is";

/** Get the node tree source code string */
export const getCodeString = (
  data: ElementContent[] = [],
  code: string = ""
) => {
  data.forEach((node) => {
    if (node.type === "text") {
      code += node.value;
    } else if (
      node.type === "element" &&
      node.children &&
      Array.isArray(node.children)
    ) {
      code += getCodeString(node.children);
    }
  });
  return code;
};

export type RehypeMultiRewriteOptions = {
  /**
 * Select elements to be wrapped. Expects string selectors that can be passed to hast-util-select ([supported selectors](https://github.com/syntax-tree/hast-util-select/blob/master/readme.md#support)).
 */
  selectors?: {
    [selector: string]: (
      node: Element,
      index?: number,
      parent?: Root | Element
    ) => void;
  };
  /** Rewrite Element. */
  rewrite?: (
    node: Root | RootContent,
    index?: number,
    parent?: Root | Element
  ) => void;
};

const remarkMultiRewrite: Plugin<[RehypeMultiRewriteOptions?], Root> = (options = {}) => {
  const { selectors = {}, rewrite } = options;
  return (tree) => {
    for (const [selector, rewrite] of Object.entries(selectors)) {
      if (!rewrite || typeof rewrite !== "function") continue;
      if (selector && typeof selector === "string") {
        const selected = selectAll(selector, tree);
        if (selected && selected.length > 0) {
          visit(
            tree,
            selected as unknown as Test,
            (node: Element, index, parent) => {
              rewrite(node, index, parent);
            }
          );
        }
      }
    }
    if (!rewrite || typeof rewrite !== 'function') return;
    visit(tree, (node: Root | RootContent, index, parent) => {
      rewrite(node, index, parent);
    });
  };
};

export default remarkMultiRewrite;
