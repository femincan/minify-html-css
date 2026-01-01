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
- [CLI](#cli)
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

const result = minifyHTML(html).code;
console.log(result); // "<div><h1>Hello World!</h1><style>body{color:red}</style></div>"
```

```typescript
import { minifyCSS } from 'minify-html-css';

const css = `
  /* page styles */
  :root { --main-color: red; }

  body {
    color: var(--main-color);
    margin: 0;
    line-height: 1.4;
  }
`;

const result = minifyCSS(css).code;
console.log(result); // ":root{--main-color:red}body{color:var(--main-color);margin:0;line-height:1.4}"
```

---

## API Documentation

### `minifyHTML(input: string, options?: MinifyHTMLOptions): TransformOutput`

#### minifyHTML: What it does

Minifies an HTML string (whitespace, comments, attributes, inline assets depending on options).

#### minifyHTML: Return value

Returns the underlying `@swc/html` minifier result. In practice you’ll primarily use:

- `code`: the minified HTML
- `errors`: an array of parse/minification errors (if any)

> **Implementation note:**
> This is a small wrapper around [`@swc/html`](https://github.com/swc-project/swc/tree/main/packages/html) (SWC’s HTML minifier).

#### minifyHTML: Parameters

- `input` (`string`): HTML to minify.
- `options?` (`MinifyHTMLOptions`): Optional configuration.

#### minifyHTML: Options

This package keeps the inline docs for options in the type files (with full JSDoc and defaults). Start here:

- [`src/minify-html-types.ts`](src/minify-html-types.ts) (HTML options + `MinifierType`)

#### minifyHTML: Examples

```ts
import { minifyHTML } from 'minify-html-css';

const input = `
  <div>
    <!-- hi -->
    Again
  </div>
`;

// Keep HTML comments
const result = minifyHTML(input, { removeComments: false }).code;
console.log(result); // <div><!-- hi -->Again</div>
```

### `minifyCSS(input: string, options?: MinifyCSSOptions): TransformResult`

#### minifyCSS: What it does

Minifies CSS using Lightning CSS.

#### minifyCSS: Return value

Returns the underlying `lightningcss` transform result, with one convenience tweak: `code` is returned as a `string` (not a `Buffer`).

> **Implementation note:**
> This is a wrapper around [`lightningcss`](https://github.com/parcel-bundler/lightningcss).

#### minifyCSS: Parameters

- `input` (`string`): CSS to minify.
- `options?` (`MinifyCSSOptions`): Optional configuration.

#### minifyCSS: Options

See the full option surface (typed + documented) here:

- [`src/minify-css-types.ts`](src/minify-css-types.ts)

#### minifyCSS: Example

```ts
import { minifyCSS, minifyHTML } from 'minify-html-css';

const input = `
  body {
    color: red;
  }

  @keyframes slidein {
    from {
      transform: translateX(0%);
    }
    to {
      transform: translateX(100%);
    }
  }
`;

// Remove unused @keyframes 'slidein'
const result = minifyCSS(input, { unusedSymbols: ['slidein'] }).code;
console.log(result); // body{color:red}
```

---

### CLI

This package also ships a CLI binary named `minify-html-css`.

**Run via `npx` (no global install):**

```bash
npx minify-html-css -i input.html -o output.html
npx minify-html-css -i styles.css -o styles.min.css
```

**Or install globally:**

```bash
npm install -g minify-html-css
minify-html-css -i input.html -o output.html
```

**Options:**

- `-i, --input <file>`: input file path (alternatively you can pass the input file as the first positional argument)
- `-o, --output <file>`: output file path (if omitted, prints to stdout)
- `-t, --type <html|css>`: file type (auto-detected from extension if omitted)
- `-h, --help`: show help
- `-v, --version`: show version

**Examples:**

```bash
# Auto-detect file type from extension
minify-html-css index.html > index.min.html

# Force type when extension can't be detected
minify-html-css -i input -t html > output.html
```

---

## TODO

- [x] Implement HTML minification function (`minifyHTML`) built on top of `@swc/html`
- [x] Implement CSS minification function (`minifyCSS`) built on top of `lightningcss`
- [x] Implement CLI usage (command-line tool)

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
