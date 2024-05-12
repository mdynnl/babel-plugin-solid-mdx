# babel-plugin-solid-mdx

[![NPM](https://img.shields.io/npm/v/babel-plugin-solid-mdx.svg)](https://www.npmjs.com/package/babel-plugin-solid-mdx)

A simple babel plugin to transform mdx to solid

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
