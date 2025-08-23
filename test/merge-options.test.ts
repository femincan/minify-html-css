import { describe, expect, test } from 'bun:test';
import { mergeOptions } from '../src/utils/merge-options';

describe('mergeOptions', () => {
	describe('mergeOptions (base)', () => {
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

	describe('mergeOptions (with callback)', () => {
		test('Callback can override merge result for a key', () => {
			const target = { a: 1, b: 2 };
			const source = { a: 10, b: 20, c: 30 };
			expect(
				mergeOptions(target, source, undefined, (key) => {
					if (key === 'a') {
						return 42;
					}
					return undefined;
				}),
			).toEqual({
				a: 42,
				b: 20,
				c: 30,
			});
		});

		test('Callback can prevent merging by returning target value', () => {
			const target = { foo: 'keep', bar: 'old' };
			const source = { foo: 'replace', bar: 'new' };
			expect(
				mergeOptions(target, source, undefined, (key, targetValue) => {
					if (key === 'foo') return targetValue;
					return undefined;
				}),
			).toEqual({
				foo: 'keep',
				bar: 'new',
			});
		});

		test('Callback can return undefined to use normal merge', () => {
			const target = { a: { x: 1 }, b: [1, 2] };
			const source = { a: { y: 2 }, b: [3, 4] };
			expect(mergeOptions(target, source, undefined, () => undefined)).toEqual({
				a: { x: 1, y: 2 },
				b: [3, 4],
			});
		});

		test('Callback receives correct arguments', () => {
			const key = 'foo';
			const target = { [key]: 1 };
			const source = { [key]: 2 };
			let args: unknown[] = [];
			mergeOptions(
				target,
				source,
				undefined,
				(key, targetValue, sourceValue, t, s) => {
					args = [key, targetValue, sourceValue, t, s];
					return undefined;
				},
			);
			expect(args[0]).toBe(key); // key
			expect(args[1]).toBe(target[key]); // targetValue
			expect(args[2]).toBe(source[key]); // sourceValue
			expect(args[3]).toBe(target); // targetOptions
			expect(args[4]).toBe(source); // sourceOptions
		});

		test('Callback is called only for keys that are present in sourceOptions', () => {
			const target = { a: 1, c: 3 };
			const source = { a: 2, d: 4 };
			const seenKeys: string[] = [];
			mergeOptions(target, source, undefined, (key) => {
				seenKeys.push(key);
				return undefined;
			});
			expect(seenKeys).not.toContain('c');
			expect(seenKeys).toEqual(Object.keys(source));
		});

		test('Callback is called only for keys that are not present in disabledOptions', () => {
			const target = { a: 1 };
			const source = { a: 2, c: 3 };
			const disabled = ['a', 'b'];
			const seenKeys: string[] = [];
			mergeOptions(target, source, disabled, (key) => {
				seenKeys.push(key);
				return undefined;
			});
			expect(seenKeys).not.toContainAnyValues(disabled);
		});

		test('Callback is only called at top-level, not for nested keys', () => {
			const target = { outer: { inner: 1 } };
			const source = { outer: { inner: 2 } };
			const seenKeys: string[] = [];
			mergeOptions(target, source, undefined, (key) => {
				seenKeys.push(key);
				return undefined;
			});
			expect(seenKeys).toContain('outer');
			expect(seenKeys).not.toContain('inner');
		});

		test('Callback can return falsy values (except undefined) and those are used as merge result', () => {
			const target = { a: 1, b: 2, c: 'not boolean' };
			const source = { a: 42, b: 100, c: true };
			expect(
				mergeOptions(target, source, undefined, (key) => {
					if (key === 'a') return 0;
					if (key === 'b') return null;
					if (key === 'c') return false;
					return undefined;
				}),
			).toEqual({
				a: 0,
				b: null,
				c: false,
			});
		});
	});
});
