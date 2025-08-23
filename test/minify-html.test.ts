import { describe, expect, test } from 'bun:test';
import { minifyHTML } from '../src';
import type { MinifyHTMLOptions } from '../src/minify-html-types';

describe('minifyHTML', () => {
	test('Everything has correct types', () => {
		const input = '<p>Hello World!</p>';
		expect(minifyHTML).toBeTypeOf('function');

		const result = minifyHTML(input);
		expect(result).toBeTypeOf('object');
		expect(result.code).toBeTypeOf('string');
		expect(result.errors).toBeUndefined();

		const inputWithErrors = '<img></img>';
		const resultWithErrors = minifyHTML(inputWithErrors);
		expect(resultWithErrors).toBeTypeOf('object');
		expect(resultWithErrors.code).toBeTypeOf('string');
		expect(resultWithErrors.errors).toBeArray();
		// biome-ignore lint: if the errors array is non-existent the test already failed before this line
		expect(resultWithErrors.errors![0]).toBeTypeOf('object');
	});
	test('It works gracefully without providing options object', () => {
		const input = '<p>Hello World!</p>';
		const transformOutput = minifyHTML(input);

		expect(transformOutput.code).toBe(input);
		expect(transformOutput.errors).toBeUndefined();
	});
	test('It works gracefully if you provide options object', () => {
		const input = '<p>   Hello World!         </p>';
		const expectedOutput = '<p>Hello World!</p>';
		const options: MinifyHTMLOptions = {
			collapseWhitespaces: 'all',
		};
		const transformOutput = minifyHTML(input, options);

		expect(transformOutput.code).toBe(expectedOutput);
		expect(transformOutput.errors).toBeUndefined();
	});
});
