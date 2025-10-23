import {
	type CustomAtRules,
	type TransformOptions,
	transform,
} from 'lightningcss';
import type { MinifyCSSOptions } from './minify-css-types';
import { mergeOptions } from './utils/merge-options';

const disabledOptions: (keyof TransformOptions<CustomAtRules>)[] = [
	'filename',
	'code',
	'sourceMap',
	'inputSourceMap',
	'projectRoot',
	'include',
	'exclude',
	'visitor',
	'customAtRules',
];

/**
 * Minifies CSS content using Lightning CSS.
 *
 * @param input - The CSS string to be minified.
 * @param {MinifyCSSOptions} options - Optional configuration for the minification process.
 * @returns An object containing the minified CSS code and optional exports for CSS modules.
 *
 * @example
 * const result = minifyCSS('body {   color  :   red  ;  }');
 * console.log(result.code); // Outputs: 'body{color:red}'
 */
export function minifyCSS(input: string, options?: MinifyCSSOptions) {
	const baseOptions: TransformOptions<CustomAtRules> = {
		filename: '',
		code: Buffer.from(input),
		minify: true,
		sourceMap: false,
	};

	let mergedOptions = baseOptions;
	if (options) {
		mergedOptions = mergeOptions(baseOptions, options, disabledOptions);
	}

	const transformResult = transform(mergedOptions);

	return { ...transformResult, code: transformResult.code.toString() };
}
