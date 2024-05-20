# babel-plugin-solid-mdx

[![NPM](https://img.shields.io/npm/v/babel-plugin-solid-mdx.svg)](https://www.npmjs.com/package/babel-plugin-solid-mdx)

A simple babel plugin to transform mdx to solid

## demo
[solid](https://stackblitz.com/edit/github-hea2ss)
[solid start](https://stackblitz.com/edit/github-ct2vvw)

## Install

```bash
npm install --save-dev babel-plugin-solid-mdx
```

```bash
yarn add -D babel-plugin-solid-mdx
```

```bash
pnpm add -D babel-plugin-solid-mdx
```

```bash
bun add -d babel-plugin-solid-mdx
```

## Usage

```ts
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import mdx from '@mdx-js/rollup';
import solidMdx from 'babel-plugin-solid-mdx';

export default defineConfig({
  plugins: [
    // use @mdx-js/rollup before solidPlugin
    {
      enforce: 'pre',
      ...mdx({
        jsx: true,
        jsxImportSource: 'solid-js',
      }),
    },
    solidPlugin({
      // configure solid to compile `.mdx` files
      extensions: ['.mdx'],
      babel: {
        // use the plugin to transform the mdx output
        plugins: [solidMdx],
      },
    }),
  ],
});
```

## Frontmatter Support

```js
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import mdx from '@mdx-js/rollup';
import solidMdx from 'babel-plugin-solid-mdx';

import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        jsx: true,
        jsxImportSource: 'solid-js',
        remarkPlugins: [
          //
          remarkFrontmatter,
          remarkMdxFrontmatter,
        ],
      }),
    },
    solidPlugin({
      extensions: ['.mdx'],
      babel: {
        plugins: [solidMdx],
      },
    }),
  ],
});
```



## note
The transform pipeline basically goes like this.

#### 1. mdx
```md
# heading

paragraph

- list
```

#### 2. mdx jsx
```jsx
/*@jsxRuntime automatic*/
/*@jsxImportSource solid-js*/
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    li: "li",
    p: "p",
    ul: "ul",
    ...props.components
  };
  return <><_components.h1>{"heading"}</_components.h1>{"\n"}<_components.p>{"paragraph"}</_components.p>{"\n"}<_components.ul>{"\n"}<_components.li>{"list"}</_components.li>{"\n"}</_components.ul></>;
}
export default function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
```

### 3. babel-plugin-solid-mdx

`solid-js` transforms jsx elements into `createComponent` calls which doesn't support string tags. This plugins transforms jsx elements with potential string tags to use `Dynamic` instead.
```jsx
import { Dynamic } from "solid-js/web"

/*@jsxRuntime automatic*/
/*@jsxImportSource solid-js*/
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    li: "li",
    p: "p",
    ul: "ul",
    ...props.components
  };
  return <><Dynamic component={_components.h1}>{"heading"}</Dynamic>{"\n"}<Dynamic component={_components.p}>{"paragraph"}</Dynamic>{"\n"}<Dynamic component={_components.ul}>{"\n"}<Dynamic component={_components.li}>{"list"}</Dynamic>{"\n"}</Dynamic></>;
}
export default function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
}
```

### 4. babel-plugin-solid-mdx
And the rest is handled by `solid-js` babel transform.
