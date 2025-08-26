import { describe, expect, test } from 'bun:test';
import { minifyHTML } from '../src';
import type { MinifyHTMLOptions } from '../src/minify-html-types';

describe('minifyHTML', () => {
	test('Everything is typed correctly', () => {
		expect(minifyHTML).toBeTypeOf('function');

		const result = minifyHTML('<p>Hello World!</p>');
		expect(result).toBeTypeOf('object');
		expect(result.code).toBeTypeOf('string');
		expect(result.errors).toBeUndefined();
	});

	test('Uses default options if no options are provided', () => {
		const input = '<p>Hello World!</p>';
		const transformOutput = minifyHTML(input);

		expect(transformOutput.code).toBe(input);
		expect(transformOutput.errors).toBeUndefined();
	});

	test('User options override defaults except disabledOptions', () => {
		const input = '<p>   Hello World!         </p>';
		const options: MinifyHTMLOptions = {
			collapseWhitespaces: 'none',
			// @ts-expect-error For testing
			mode: 'quirks', // Should be ignored because this option is disabled
		};
		const result = minifyHTML(input, options);
		expect(result.code).toBe(input);
	});

	test('minifyCss option logic: true/false/undefined', () => {
		const input = '<style>h1{ color : red ; }</style>';
		const minifiedOutput = '<style>h1{color:red}</style>';
		// Default (undefined), as the default lightningcss will be setted as default minifier under the hood
		const defaultResult = minifyHTML(input);
		expect(defaultResult.code).toBe(minifiedOutput);
		// Explicit false disables CSS minification
		const unminifiedResult = minifyHTML(input, { minifyCss: false });
		expect(unminifiedResult.code).toBe(input);
		// Explicit true uses default minifier, again lightningcss is used as default
		const minifiedResult = minifyHTML(input, { minifyCss: true });
		expect(minifiedResult.code).toBe(minifiedOutput);
	});

	test('Returns errors array for malformed HTML', () => {
		const malformedInput = '<img></img>';
		const result = minifyHTML(malformedInput);
		expect(result).toBeTypeOf('object');
		expect(result.code).toBeTypeOf('string');
		expect(result.errors).toBeArray();
		// biome-ignore lint: if the errors array is non-existent the test already failed before this line
		expect(result.errors![0]).toBeTypeOf('object');
	});

	test('Does not throw and ignores if unknown options are passed', () => {
		expect(() =>
			minifyHTML('<p>test</p>', { notARealOption: 123 } as MinifyHTMLOptions),
		).not.toThrow();
	});

	test('Handles empty string input gracefully', () => {
		const input = '';
		const result = minifyHTML(input);
		expect(result.code).toBe(input);
		expect(result.errors).toBeUndefined();
	});
});
