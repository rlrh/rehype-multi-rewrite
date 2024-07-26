rehype-multi-rewrite
===
<!--rehype:style=display: flex; height: 230px; align-items: center; justify-content: center; font-size: 38px;-->

<!-- [![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://jaywcjlove.github.io/#/sponsor)
[![Downloads](https://img.shields.io/npm/dm/rehype-rewrite.svg?style=flat)](https://www.npmjs.com/package/rehype-rewrite)
[![NPM version](https://img.shields.io/npm/v/rehype-rewrite.svg?style=flat)](https://npmjs.org/package/rehype-rewrite)
[![Build](https://github.com/jaywcjlove/rehype-rewrite/actions/workflows/ci.yml/badge.svg)](https://github.com/jaywcjlove/rehype-rewrite/actions/workflows/ci.yml)
[![Coverage Status](https://jaywcjlove.github.io/rehype-rewrite/badges.svg)](https://jaywcjlove.github.io/rehype-rewrite/lcov-report/)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/rehype-rewrite)](https://bundlephobia.com/result?p=rehype-rewrite)
[![Repo Dependents](https://badgen.net/github/dependents-repo/jaywcjlove/rehype-rewrite)](https://github.com/jaywcjlove/rehype-rewrite/network/dependents) -->

Rewrite elements with [rehype](https://github.com/rehypejs/rehype).

## Installation

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c): Node 12+ is needed to use it and it must be `import` instead of `require`.

```bash
npm install rehype-multi-rewrite
```

## Usage

> 🚧  Migrate from rehype-rewrite
> 
> ```diff
> rehype()
> - .use(rehypeRewrite, (node, index, parent) => {})
> - .use(rehypeRewrite, {
> -   rewrite: (node, index, parent) => {}
> - })
> + .use(rehypeMultiRewrite, {
> +   '': (node, index, parent) => {}
> + })
> ```
<!--rehype:style=border-left-color: #fddf4c;-->

<!--rehype:-->
```js
import { rehype } from 'rehype';
import rehypeMultiRewrite from 'rehype-multi-rewrite';
import stringify from 'rehype-stringify';

const html = `<h1>header</h1>`;
const htmlStr = rehype()
  .data('settings', { fragment: true })
  .use(rehypeMultiRewrite, {
    '': (node, index, parent) => {
      if(node.type == 'text' && node.value == 'header') {
        node.value = ''
      }
    }
  })
  .use(stringify)
  .processSync(html)
  .toString()
```

> ```html
> <h1>header</h1>
> ```
> **`Output:`** 
> 
> ```html
> <h1></h1>
> ```
> 

## Options

```ts
import { Plugin } from 'unified';
import { Root, Element, ElementContent, RootContent } from 'hast';
/** Get the node tree source code string */
export declare const getCodeString: (data?: ElementContent[], code?: string) => string;
/**
 * Select elements to be wrapped. Expects string selectors that can be passed to hast-util-select ([supported selectors](https://github.com/syntax-tree/hast-util-select/blob/master/readme.md#support)).
 */
export declare type RehypeMultiRewriteOptions = {
  [selector: string]: (
    node: Root | RootContent,
    index?: number,
    parent?: Root | Element
  ) => void;
};
declare const remarkMultiRewrite: Plugin<[RehypeMultiRewriteOptions?], Root>;
export default remarkMultiRewrite;
```

### `selector?: string;`

Select an element to be wrapped. Expects a string selector that can be passed to hast-util-select ([supported selectors](https://github.com/syntax-tree/hast-util-select/blob/master/readme.md#support)). If `selector` is an empty string then wrap will check for a body all elements.

### `(node, index, parent) => void`

Rewrite element.

## Example

### Example 1

```js
import { rehype } from 'rehype';
import rehypeMultiRewrite from 'rehype-multi-rewrite';
import stringify from 'rehype-stringify';

const html = `<h1>header</h1><h1>header</h1><h1 class="title3">header</h1>`;
const htmlStr = rehype()
  .data('settings', { fragment: true })
  .use(rehypeMultiRewrite, {
    'h1': (node) => {
      if (node.type === 'element') {
        node.properties.className = 'test';
      }
    }
  })
  .use(stringify)
  .processSync(html)
  .toString()
```

> ```html
> <h1>header</h1>
> <h1>header</h1>
> <h1 class="title3">header</h1>
> ```
> **`Output:`** 
> 
> ```html
> <h1 class="test">header</h1>
> <h1 class="test">header</h1>
> <h1 class="test">header</h1>
> ```
>

### Example 2

```js
import { rehype } from 'rehype';
import rehypeMultiRewrite from 'rehype-multi-rewrite';
import stringify from 'rehype-stringify';

const html = `<h1>header</h1>`;
const htmlStr = rehype()
  .use(rehypeMultiRewrite, {
    'body': (node) => {
      node.properties = { ...node.properties, style: 'color:red;'}
    }
  })
  .use(stringify)
  .processSync(html)
  .toString()
```

> ```html
> <h1>header</h1>
> ```
> **`Output:`** 
> 
> ```html
> <html><head></head><body style="color:red;"><h1>header</h1></body></html>
> ```
>

### Example 3

```js
import { rehype } from 'rehype';
import rehypeMultiRewrite from 'rehype-multi-rewrite';
import stringify from 'rehype-stringify';

const html = `<h1>hello</h1>`;
const htmlStr = rehype()
  .data('settings', { fragment: true })
  .use(rehypeMultiRewrite, {
    'h1': (node) => {
      node.children = [ ...node.children, {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [
          {type: 'text', value: ' world'}
        ]
      }]
    }
  })
  .use(stringify)
  .processSync(html)
  .toString()
```

> ```html
> <h1>hello</h1>
> ```
> **`Output:`** 
> 
> ```html
> <h1>hello<span> world</span></h1>
> ```
> 

### Example 4

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import rehypeRaw from 'rehype-raw';
import remark2rehype from 'remark-rehype';
import rehypeMultiRewrite from 'rehype-multi-rewrite';
import stringify from 'rehype-stringify';

const html = `<h1>hello</h1>`;
const htmlStr = unified()
  .use(remarkParse)
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeMultiRewrite, {
    'h1': (node) => {
      node.properties = { ...node.properties, style: 'color:red;' }
    }
  })
  .use(stringify)
  .processSync(html)
  .toString()
```

> ```html
> <h1>hello</h1>
> ```
>
> **`Output:`** 
> 
> ```html
> <h1 style="color:red;">Hello World!</h1>
> ```
> 

## Related

- [`rehype-video`](https://github.com/jaywcjlove/rehype-video) Add improved video syntax: links to `.mp4` and `.mov` turn into videos.
- [`rehype-attr`](https://github.com/jaywcjlove/rehype-attr) New syntax to add attributes to Markdown.
- [`rehype-ignore`](https://github.com/jaywcjlove/rehype-ignore) Ignore content display via HTML comments, Shown in GitHub readme, excluded in HTML.
- [`remark-github-blockquote-alert`](https://github.com/jaywcjlove/remark-github-blockquote-alert) Remark plugin to add support for GitHub Alert.

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/jaywcjlove/rehype-rewrite/graphs/contributors">
  <img src="https://jaywcjlove.github.io/rehype-rewrite/CONTRIBUTORS.svg" />
</a>

Made with [action-contributors](https://github.com/jaywcjlove/github-action-contributors).


## License

MIT © [Kenny Wong](https://github.com/jaywcjlove)
