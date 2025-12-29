# minify-html-css

🔽 A JavaScript (TypeScript) library to minify HTML and CSS.

[![CI](https://github.com/femincan/minify-html-css/actions/workflows/ci.yml/badge.svg)](https://github.com/femincan/minify-html-css/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/minify-html-css)](https://www.npmjs.com/package/minify-html-css)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

---

## Table of Contents

- [Intent](#intent)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [TODO](#todo)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Intent

I created this project to bring together the most performant HTML and CSS minifier libraries (according to my tests and findings) as clean, easy-to-use functions with well-documented options. The goal is to make web minification accessible, fast, and developer-friendly.

---

## Features

- Minifies HTML strings
- Removes unnecessary whitespace and comments
- Works seamlessly in Node.js and browser environments
- Written in TypeScript with type definitions included

---

## Installation

```bash
npm install minify-html-css
```

---

## Usage

### Basic Example

```typescript
import { minifyHTML } from 'minify-html-css';

const html = `
  <div>
    <!-- This is a comment -->
    <h1> Hello World! </h1>
    <style>
      body { color: red; }
    </style>
  </div>
`;

const minifiedHtml = minifyHTML(html).code;
console.log(minifiedHtml); // "<div><h1>Hello World!</h1><style>body{color:red}</style></div>"
```

---

## API Documentation

### `minifyHTML(input: string, options?: MinifyHTMLOptions): TransformOutput`

**Description:**
Minifies an HTML string by removing unnecessary whitespace, comments, and compressing inline JS and CSS (where supported). Returns an object containing `code` property for transformed code and `errors` array for possible errors.

> **Implementation note:**
> This function is a wrapper around the [`@swc/html`](https://github.com/swc-project/swc/tree/main/packages/html) package and uses its minification logic under the hood.

**Parameters:**

- `input` (`string`): The HTML code to minify.
- `options?` (`MinifyHTMLOptions`): Configuration object for fine-grained control.

The available options are:

| Option                              | Type                                                                                         | Default   | Description                                                                                              |
| ----------------------------------- | -------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------- |
| `collapseWhitespaces`               | `'none' \| 'all' \| 'smart' \| 'conservative' \| 'advanced-conservative' \| 'only-metadata'` | `'all'`   | Controls how whitespace is collapsed and removed throughout the document.                                |
| `removeEmptyMetadataElements`       | `boolean`                                                                                    | `true`    | Removes empty metadata elements such as `<script>`, `<style>`, `<meta>`, and `<link>`.                   |
| `removeComments`                    | `boolean`                                                                                    | `true`    | Removes all HTML comments unless matched by `preserveComments`.                                          |
| `preserveComments`                  | `string[]`                                                                                   |           | Array of regex strings; comments matching any are preserved. You can override the default patterns.      |
| `minifyConditionalComments`         | `boolean`                                                                                    | `true`    | Minifies IE conditional comments.                                                                        |
| `removeEmptyAttributes`             | `boolean`                                                                                    | `true`    | Removes empty attributes from HTML tags (when safe).                                                     |
| `removeRedundantAttributes`         | `'none' \| 'all' \| 'smart'`                                                                 | `'smart'` | Controls removal of redundant or default attributes.                                                     |
| `collapseBooleanAttributes`         | `boolean`                                                                                    | `true`    | Collapses boolean attributes to their short form (e.g. `checked`).                                       |
| `normalizeAttributes`               | `boolean`                                                                                    | `true`    | Cleans up attribute values by removing unnecessary spaces, and strips `javascript:` from event handlers. |
| `minifyJson`                        | `boolean \| { pretty?: boolean }`                                                            | `true`    | Minifies embedded JSON within `<script type="application/json">`.                                        |
| `minifyJs`                          | `boolean`                                                                                    | `true`    | Minifies inline JavaScript.                                                                              |
| `minifyCss`                         | `boolean`                                                                                    | `true`    | Minifies inline CSS.                                                                                     |
| `minifyAdditionalScriptsContent`    | `[string, MinifierType][]`                                                                   |           | Minifies additional `<script>` types, specifying type pattern and minifier.                              |
| `minifyAdditionalAttributes`        | `[string, MinifierType][]`                                                                   |           | Minifies additional attribute values, specifying attribute name pattern and minifier.                    |
| `sortSpaceSeparatedAttributeValues` | `boolean`                                                                                    | `false`   | Sorts space-separated attribute values like `class` or `rel`.                                            |
| `sortAttributes`                    | `boolean`                                                                                    | `false`   | Sorts all attributes of each element in reverse alphabetical order.                                      |
| `tagOmission`                       | `boolean`                                                                                    | `true`    | Omits optional end tags when valid per HTML spec.                                                        |
| `quotes`                            | `boolean`                                                                                    | `false`   | Always wrap attribute values in quotes.                                                                  |

For detailed type definitions and documentation, see [`src/minify-html-types.ts`](https://github.com/femincan/minify-html-css/blob/main/src/minify-html-types.ts).

### `minifyCSS(input: string, options?: MinifyCSSOptions): TransformResult`

**Description:**
Minifies CSS code by removing unnecessary whitespace, optimizing values, and applying various transformations.

> **Implementation note:**
> This function is a wrapper around the [`lightningcss`](https://github.com/parcel-bundler/lightningcss) package and uses its minification logic under the hood.

**Parameters:**

- `input` (`string`): The CSS code to minify.
- `options?` (`MinifyCSSOptions`): Configuration object for fine-grained control.

For detailed type definitions and documentation for options, see [`src/minify-css-types.ts`](https://github.com/femincan/minify-html-css/blob/main/src/minify-css-types.ts).

---

## TODO

- [x] Implement HTML minification function (`minifyHTML`) built on top of `@swc/html`
- [x] Implement CSS minification function (`minifyCSS`) built on top of `lightningcss`
- [ ] Implement CLI usage (command-line tool)

---

## Contributing

We welcome contributions!

**Requirements:**

- [Bun](https://bun.sh/) (make sure you have Bun installed)

**Steps:**

1. Fork this repository.
2. Create a new branch: `git switch -c my-feature`
3. Make your changes and add tests if possible.
4. Run `bun run lint && bun test` (This is automatically done when you open a pull request) to ensure everything passes.
5. Commit your changes: `git commit -m "Add my feature"`
6. Push to your fork and submit a pull request.

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

---

## License

This project is licensed under the [MIT License](LICENSE).

**Types License Notice:**

- The type definitions in [`src/minify-html-types.ts`](https://github.com/femincan/minify-html-css/blob/main/src/minify-html-types.ts) are adapted from the SWC Project and are licensed under the Apache License, Version 2.0.
- See the [NOTICE](./NOTICE) file and [LICENSE-APACHE](./LICENSE-APACHE) for more information and required attributions.

---

## Acknowledgements

- This project uses [`@swc/html`](https://github.com/swc-project/swc/tree/main/packages/html) under the hood for actual HTML minification.  
  We adapt and update their type definitions, add documentation, and keep their license and notice files in the repository for compliance and transparency. See the repository for more information.
