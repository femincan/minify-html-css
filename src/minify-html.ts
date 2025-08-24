import { type FragmentOptions, minifyFragmentSync } from '@swc/html';
import type { TransformOutput } from '@swc/html/binding';
import type { MinifyHTMLOptions } from './minify-html-types';
import { mergeOptions } from './utils/merge-options';

const disabledOptions = [
	'context-element',
	'filename',
	'forceSetHtml5Doctype',
	'form_element',
	'iframeSrcdoc',
	'mode',
	'scriptingEnabled',
	'selfClosingVoidElements',
];

/**
 * Minifies HTML content using SWC's HTML minifier.
 *
 * @param input - The HTML string to be minified.
 * @param {MinifyHTMLOptions} options - Optional configuration for the minification process.
 * @returns An object containing the minified HTML and any errors encountered during processing.
 *
 * @example
 * const result = minifyHTML('<p>   Hello World!         </p>');
 * console.log(result.code); // Outputs: '<p>Hello World!</p>'
 */
export function minifyHTML(
	input: string,
	options?: MinifyHTMLOptions,
): TransformOutput {
	const baseOptions: FragmentOptions = {
		collapseWhitespaces: 'all',
		sortSpaceSeparatedAttributeValues: false,
		minifyCss: { lib: 'lightningcss' },
	};

	let mergedOptions = baseOptions;
	if (options) {
		mergedOptions = mergeOptions(
			baseOptions,
			options,
			disabledOptions,
			(key, targetValue, sourceValue) => {
				if (key === 'minifyCss') {
					if (sourceValue === true) {
						return targetValue;
					} else {
						return false;
					}
				}
			},
		);
	}

	const transformOutput = minifyFragmentSync(input, mergedOptions);

	return transformOutput;
}
