import { describe, expect, test } from 'bun:test';
import { mergeOptions } from '../src/utils/merge-options';

describe('mergeOptions', () => {
	describe('mergeOptions (base behavior)', () => {
		test('Correctly merges nested objects recursively', () => {
			const target = { a: { b: { c: 1 } } };
			const source = { a: { b: { d: 2 } } };
			const expected = { a: { b: { c: 1, d: 2 } } };
			expect(mergeOptions(target, source)).toEqual(expected);
		});

		test('Arrays are replaced with source, not merged', () => {
			const target = { arr: [1, 2, 3] };
			const source = { arr: [4, 5] };
			const expected = { arr: [4, 5] };
			expect(mergeOptions(target, source)).toEqual(expected);
		});

		test('Primitive values are replaced', () => {
			const target = { a: 1, b: 2 };
			const source = { b: 99, c: 3 };
			const expected = { a: 1, b: 99, c: 3 };
			expect(mergeOptions(target, source)).toEqual(expected);
		});

		test('Ignores keys present in disabledOptions', () => {
			const target = { x: 1, y: 2 };
			const source = { x: 42, y: 43, z: 99 };
			const disabled = ['x', 'z'];
			const expected = { x: 1, y: 43 };
			expect(mergeOptions(target, source, disabled)).toEqual(expected);
		});

		test('Handles null, undefined, and non-object values', () => {
			const target = { a: null, b: undefined, c: 1 };
			const source = { a: { nested: 2 }, b: 3, c: null, d: undefined };
			const expected = {
				a: { nested: 2 },
				b: 3,
				c: null,
				d: undefined,
			};
			expect(mergeOptions(target, source)).toEqual(expected);
		});

		test('Does not mutate input objects', () => {
			const target = { foo: { bar: 'baz' } };
			const source = { foo: { qux: 'quux' } };
			mergeOptions(target, source);
			expect(target).toEqual(target);
			expect(source).toEqual(source);
		});

		test('Recursively merges plain objects but not arrays', () => {
			const target = { obj: { a: 1, arr: [1, 2] } };
			const source = { obj: { b: 2, arr: [3, 4] } };
			const expected = {
				obj: { a: 1, b: 2, arr: [3, 4] },
			};
			expect(mergeOptions(target, source)).toEqual(expected);
		});

		test('Handles empty source or target', () => {
			expect(mergeOptions({}, { a: 1 })).toEqual({ a: 1 });
			expect(mergeOptions({ a: 1 }, {})).toEqual({ a: 1 });
		});

		test('Handles empty source and target', () => {
			expect(mergeOptions({}, {})).toEqual({});
		});
	});
});
