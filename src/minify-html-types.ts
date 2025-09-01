/**
 * This file is derived from the SWC Project (Apache 2.0).
 * Original types: https://github.com/swc-project/swc/blob/main/packages/html/index.ts
 * Documentation adapted from: https://github.com/swc-project/swc/blob/main/crates/swc_html_minifier/src/option.rs
 *
 * - Documentation for the options in this file is adapted from the Rust source comments
 *   in `option.rs` to provide accurate and detailed JSDoc for TypeScript consumers.
 * - Some options have been removed or modified for this project’s requirements.
 * - See the SWC repository for the original, unmodified sources.
 *
 * Copyright 2024 SWC contributors.
 * Licensed under the Apache License, Version 2.0. The full license text is provided in LICENSE-APACHE.
 * Modifications by contributors of minify-html-css project, 2025.
 */

/**
 * Specifies the type of content to be minified.
 * - 'js-module': JavaScript module code
 * - 'js-script': Classic JavaScript script (non-module)
 * - 'json': JSON data
 * - 'css': CSS styles
 * - 'html': HTML markup
 */
export type MinifierType = 'js-module' | 'js-script' | 'json' | 'css' | 'html';

/**
 * Configuration options for HTML minification.
 *
 * Each option allows you fine-grained control over how the minifier processes and optimizes your HTML, CSS, JS, and embedded assets.
 */
export type MinifyHTMLOptions = {
	/**
	 * Specifies how whitespace should be collapsed and removed throughout the document.
	 * - 'none': Preserve all whitespace as is.
	 * - 'all' (**default**): Remove all whitespace possible.
	 * - 'smart': Collapse whitespace based on the CSS `display` property of elements.
	 * - 'conservative': Collapse consecutive whitespace into one, remove all whitespace in the `<head>`, and trim whitespace in the `<body>`.
	 * - 'advanced-conservative': Like 'conservative', but also removes whitespace between metadata elements (such as `<script>`, `<style>`, etc.).
	 * - 'only-metadata': Removes all whitespace in `<head>`, trims `<body>`, and removes whitespace between metadata elements (elements that are not rendered, like `<script>` or `<style>`).
	 *
	 * @default 'all'
	 */
	collapseWhitespaces?:
		| 'none'
		| 'all'
		| 'smart'
		| 'conservative'
		| 'advanced-conservative'
		| 'only-metadata';

	/**
	 * Removes empty metadata elements such as `<script>` and `<style>` when they have no content or `<meta>` and `<link>` when they have no attributes.
	 *
	 * @default true
	 */
	removeEmptyMetadataElements?: boolean;

	/**
	 * Removes all HTML comments from the output unless explicitly preserved by a pattern in `preserveComments`.
	 *
	 * @default true
	 */
	removeComments?: boolean;

	/**
	 * An array of string patterns, each interpreted as a regular expression.
	 * Comments matching any of these patterns will be preserved during minification.
	 *
	 * By default, the following types of comments are preserved:
	 * - License and legal notices (e.g. comments containing `@preserve`, `@copyright`, `@lic`, or `@cc_on`)
	 * - Custom comments starting with `!` (such as `<!--! Important -->`)
	 * - Server-side comments starting with `#`
	 * - Conditional Internet Explorer (IE) comments (e.g. `<!--[if ...]> ... <![endif]-->`)
	 *
	 * You can provide your own patterns as strings using regular expression syntax (e.g. `"^!"` or `"@preserve"`).
	 * All values must be strings; do not use RegExp objects (e.g. `/pattern/`). Each string will be treated as a regular expression.
	 *
	 * **Note:** If you provide any value for this option, the default configuration will be disabled and only your patterns will be used.
	 * To remove all comments, set this to an empty array: `preserveComments: []`.
	 */
	preserveComments?: string[];

	/**
	 * Minifies Internet Explorer conditional comments.
	 *
	 * @default true
	 */
	minifyConditionalComments?: boolean;

	/**
	 * Removes empty attributes from HTML tags when it is considered safe.
	 *
	 * This option removes only those empty attributes that are typically unnecessary,
	 * such as `style=""` or similar cases that do not affect rendering or behavior.
	 *
	 * **Caution:** In some edge cases, certain JavaScript libraries or frameworks may rely on the
	 * presence of empty attributes in the DOM (for example, by using string-based DOM manipulation
	 * or selectors that expect specific attributes to exist, even if empty). Removing these
	 * attributes could potentially break such code.
	 *
	 * If you need maximum compatibility with code that may expect empty attributes to be present,
	 * consider disabling this option.
	 *
	 * @default true
	 */
	removeEmptyAttributes?: boolean;

	/**
	 * Controls removal of redundant or default attributes on HTML elements.
	 * - 'none': Do not remove any redundant attributes.
	 * - 'all': Remove all redundant attributes.
	 * - 'smart' (**default**): Remove only safe/deprecated/SVG redundant attributes, e.g., `type="text/css"` on <style> or `xmlns` on SVG.
	 *
	 * @default 'smart'
	 */
	removeRedundantAttributes?: 'none' | 'all' | 'smart';

	/**
	 * Collapses boolean attributes to their short form (e.g., `checked="checked"` becomes `checked`).
	 *
	 * @default true
	 */
	collapseBooleanAttributes?: boolean;

	/**
	 * Cleans up attribute values by removing unnecessary spaces in lists separated by spaces or commas.
	 * For example, it will turn `class="foo   bar"` into `class="foo bar"` and `accept="image/gif,       image/jpeg"` into `accept="image/gif,image/jpeg"`.
	 * Also removes the `javascript:` prefix from event handler attributes like `onclick`.
	 *
	 * @default true
	 */
	normalizeAttributes?: boolean;

	/**
	 * Configures JSON minification for embedded <script type="application/json"> or similar.
	 * - If `true` (**default**): JSON content is minified (whitespace and unnecessary formatting are removed).
	 * - If `false`: JSON is left as is.
	 * - If an object: You can customize pretty-printing:
	 *   - `pretty`: If set to `true`, the JSON will be formatted with indentation and line breaks for readability.
	 *
	 * @default true
	 */
	minifyJson?: boolean | { pretty?: boolean };

	// Accepting an object as an option is disabled because the exact types are not currently known.
	// The option types should be extracted from the Rust code. See:
	// https://github.com/swc-project/swc/blob/main/crates/swc_html_minifier/src/option.rs
	// If users request advanced configuration in the future, support can be added accordingly.
	/**
	 * Configures JavaScript minification for inline scripts or event handler attributes.
	 * - If `true`, minifies inline JavaScript.
	 *
	 * @default true
	 */
	minifyJs?: boolean;

	// Accepting an object as an option is disabled because the exact types are not currently known.
	// The option types should be extracted from the Rust code. See:
	// https://github.com/swc-project/swc/blob/main/crates/swc_html_minifier/src/option.rs
	// If users request advanced configuration in the future, support can be added accordingly.
	/**
	 * Configures CSS minification for inline styles.
	 * - If `true`, minifies inline CSS using the default library.
	 *
	 * @default true
	 */
	minifyCss?: boolean;

	/**
	 * Specifies additional <script> elements whose content should be minified, based on matching the `type` attribute.
	 * Each entry is a tuple: [typeAttributePattern, minifierType]
	 * - `typeAttributePattern`: A string interpreted as a regular expression to match the `type` attribute of <script> elements.
	 * - `minifierType`: The minifier to apply to the matched element's content. Must be one of:
	 *   "js-module" | "js-script" | "json" | "css" | "html"
	 *
	 * Example: To minify the content of <script type="text/template"> as HTML, use: `[ "text/template", "html" ]`
	 */
	minifyAdditionalScriptsContent?: [
		typeAttributePattern: string,
		minifierType: MinifierType,
	][];

	/**
	 * Specifies additional attributes whose values should be minified, based on matching the attribute name.
	 * Each entry is a tuple: [attributeNamePattern, minifierType]
	 * - `attributeNamePattern`: A string interpreted as a regular expression to match attribute names.
	 * - `minifierType`: The minifier to apply to the attribute value. Must be one of:
	 *   "js-module" | "js-script" | "json" | "css" | "html"
	 *
	 * Example: To minify the value of attributes like `data-js` as JavaScript, use: `[ "data-js", "js-script" ]`
	 */
	minifyAdditionalAttributes?: [
		attributeNamePattern: string,
		minifierType: MinifierType,
	][];

	/**
	 * If true, sorts space-separated attribute values, such as those in `class` or `rel` attributes.
	 *
	 * @default false
	 */
	sortSpaceSeparatedAttributeValues?: boolean;

	/**
	 * If true, sorts all attributes in each element in reverse alphabetical order (Z–A) for consistent output.
	 *
	 * @default false
	 */
	sortAttributes?: boolean;

	/**
	 * If true, omits optional end tags and uses tag omission rules per the HTML specification to further reduce output size.
	 *
	 * @example
	 *   Input:  <ul><li>One</li><li>Two</li></ul>
	 *   Output: <ul><li>One<li>Two</ul>
	 *   // The </li> tags are optional and can be omitted according to HTML specs.
	 *
	 * @default true
	 */
	tagOmission?: boolean;

	/**
	 * If true, always wraps attribute values in quotes, even when not strictly required by the HTML specification.
	 *
	 * @default false
	 */
	quotes?: boolean;
};
