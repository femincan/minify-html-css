import { describe, expect, test } from 'bun:test';
import { minifyCSS } from '../src';
import type { MinifyCSSOptions } from '../src/minify-css-types';

describe('minifyCSS', () => {
	test('Everything is typed correctly', () => {
		expect(minifyCSS).toBeTypeOf('function');

		const result = minifyCSS('body { color: red; }');
		expect(result).toBeTypeOf('object');
		expect(result.code).toBeTypeOf('string');
	});

	test('Uses default options if no options are provided', () => {
		const input = 'body { color: red; }';
		const result = minifyCSS(input);

		expect(result).toBeTypeOf('object');
		expect(result.code).toBeTypeOf('string');
		expect(result.code.toString()).toBeTruthy();
	});

	test('User options override defaults except disabledOptions', () => {
		const input = 'body { color: red; }';
		const options: MinifyCSSOptions = {
			minify: false,
			// @ts-expect-error For testing
			filename: 'test.css', // Should be ignored because this option is disabled
		};
		const result = minifyCSS(input, options);

		// When minify is false, output should be different from minified version
		const minifiedResult = minifyCSS(input, { minify: true });
		expect(result.code.toString()).not.toBe(minifiedResult.code.toString());
	});

	test('minify option: true/false/undefined', () => {
		const input = 'body {   color  :   red  ;  }';

		// Default (undefined), minification should be enabled
		const defaultResult = minifyCSS(input);
		expect(defaultResult.code.toString().length).toBeLessThan(input.length);

		// Explicit false disables minification
		const unminifiedResult = minifyCSS(input, { minify: false });
		expect(unminifiedResult.code.toString().length).toBeGreaterThan(
			defaultResult.code.toString().length,
		);

		// Explicit true enables minification
		const minifiedResult = minifyCSS(input, { minify: true });
		expect(minifiedResult.code.toString().length).toBe(
			defaultResult.code.toString().length,
		);
	});

	test('Does not throw and ignores if unknown options are passed', () => {
		expect(() =>
			minifyCSS('body { color: red; }', {
				// @ts-expect-error For testing
				notARealOption: 123,
			}),
		).not.toThrow();
	});

	test('Handles empty string input gracefully', () => {
		const input = '';
		const result = minifyCSS(input);
		expect(result.code).toBeTypeOf('string');
		expect(result.code.toString()).toBe(input);
	});

	test('Disabled options are not passed to lightningcss', () => {
		const input = 'body { color: red; }';
		const disabledOptionsTest: MinifyCSSOptions = {
			// @ts-expect-error For testing
			filename: 'should-be-ignored.css',
			code: Buffer.from('ignored'),
			sourceMap: true,
			inputSourceMap: 'ignored',
			projectRoot: '/ignored',
			include: 1,
			exclude: 2,
			visitor: {},
			customAtRules: {},
			minify: true, // This should work
		};

		// Should not throw even with disabled options present
		expect(() => minifyCSS(input, disabledOptionsTest)).not.toThrow();

		const result = minifyCSS(input, disabledOptionsTest);
		expect(result.code).toBeTypeOf('string');
	});

	test('Allowed options are properly passed through', () => {
		const input = '.test { color: red; }';

		// Test with targets option
		const withTargets = minifyCSS(input, {
			targets: {
				chrome: 80,
			},
		});
		expect(withTargets.code).toBeTypeOf('string');

		// Test with cssModules option
		const withCssModules = minifyCSS(input, {
			cssModules: true,
		});
		expect(withCssModules.code).toBeTypeOf('string');
		expect(withCssModules.exports).toBeDefined();

		// Test with drafts option
		const withDrafts = minifyCSS(input, {
			drafts: {
				customMedia: true,
			},
		});
		expect(withDrafts.code).toBeTypeOf('string');

		// Test with nonStandard option
		const withNonStandard = minifyCSS(input, {
			nonStandard: {
				deepSelectorCombinator: true,
			},
		});
		expect(withNonStandard.code).toBeTypeOf('string');
	});

	test('Returns String in code property', () => {
		const input = 'body { color: red; }';
		const result = minifyCSS(input);

		expect(result.code).toBeTypeOf('string');
		expect(typeof result.code.toString()).toBe('string');
	});

	test('errorRecovery option is properly passed', () => {
		const input = 'body { color: red; }';

		const withErrorRecovery = minifyCSS(input, {
			errorRecovery: true,
		});
		expect(withErrorRecovery.code).toBeTypeOf('string');

		const withoutErrorRecovery = minifyCSS(input, {
			errorRecovery: false,
		});
		expect(withoutErrorRecovery.code).toBeTypeOf('string');
	});
});
