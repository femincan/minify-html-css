import { describe, expect, test } from 'bun:test';
import { detectFileType, parseOptions } from '../src/utils/cli-utils';

describe('Utils', () => {
	describe('parseOptions', () => {
		test('Empty input returns empty options', () => {
			const opts = parseOptions([]);
			expect(Object.keys(opts).length).toBe(0);
		});

		test('Parses short flags with values', () => {
			const opts = parseOptions([
				'-i',
				'input.html',
				'-o',
				'out.html',
				'-t',
				'html',
			]);
			expect(opts.input).toBe('input.html');
			expect(opts.output).toBe('out.html');
			expect(opts.type).toBe('html');
		});

		test('Parses long flags with values', () => {
			const opts = parseOptions([
				'--input',
				'in.css',
				'--output',
				'out.css',
				'--type',
				'css',
			]);
			expect(opts.input).toBe('in.css');
			expect(opts.output).toBe('out.css');
			expect(opts.type).toBe('css');
		});

		test('Parses positional input file when -i/--input is omitted', () => {
			const opts = parseOptions(['input.html']);
			expect(opts.input).toBe('input.html');
		});

		test('Flags without values produce undefined for that key', () => {
			const opts = parseOptions(['-i']);
			expect('input' in opts).toBe(true);
			expect(opts.input).toBeUndefined();
		});

		test('Help and version flags set boolean', () => {
			expect(parseOptions(['-h']).help).toBe(true);
			expect(parseOptions(['--help']).help).toBe(true);
			expect(parseOptions(['-v']).version).toBe(true);
			expect(parseOptions(['--version']).version).toBe(true);
		});

		test('Unknown option triggers process.exit(1)', () => {
			const originalExit = process.exit;
			const originalConsole = console.error;
			let exitCalled = false;

			// Replace process.exit to throw so the test runner doesn't exit
			process.exit = (code) => {
				exitCalled = true;
				throw new Error(`EXIT:${code ?? 0}`);
			};
			console.error = () => undefined;

			expect(() => parseOptions(['--unknown', 'value'])).toThrow('EXIT:1');
			expect(exitCalled).toBe(true);

			// Restore original functions
			process.exit = originalExit;
			console.error = originalConsole;
		});

		test('Extra positional argument triggers process.exit(1)', () => {
			const originalExit = process.exit;
			const originalConsole = console.error;

			process.exit = (code) => {
				throw new Error(`EXIT:${code ?? 0}`);
			};
			console.error = () => undefined;

			expect(() => parseOptions(['input.html', 'extra.html'])).toThrow(
				'EXIT:1',
			);

			process.exit = originalExit;
			console.error = originalConsole;
		});

		test('Positional argument after -i/--input triggers process.exit(1)', () => {
			const originalExit = process.exit;
			const originalConsole = console.error;

			process.exit = (code) => {
				throw new Error(`EXIT:${code ?? 0}`);
			};
			console.error = () => undefined;

			expect(() => parseOptions(['-i', 'input.html', 'extra.html'])).toThrow(
				'EXIT:1',
			);

			process.exit = originalExit;
			console.error = originalConsole;
		});
	});

	describe('detectFileType', () => {
		test('Detects .html and .htm as html', () => {
			expect(detectFileType('index.html')).toBe('html');
			expect(detectFileType('index.htm')).toBe('html');
			expect(detectFileType('INDEX.HTML')).toBe('html');
		});

		test('Detects .css as css', () => {
			expect(detectFileType('styles.css')).toBe('css');
		});

		test('Returns null for unknown extensions', () => {
			expect(detectFileType('file.txt')).toBeNull();
			expect(detectFileType('noext')).toBeNull();
		});
	});
});
