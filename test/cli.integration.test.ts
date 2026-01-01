// biome-ignore-all lint/style/noNonNullAssertion: Used in tests only

import { describe, expect, test } from 'bun:test';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

async function createTestFile(
	name: string,
	extension: string,
	content?: string,
) {
	const hash = crypto.getRandomValues(new Uint8Array(4)).toHex();
	const path = join(tmpdir(), `${name}-${hash}.${extension}`);
	const file = Bun.file(path);

	if (content) {
		await file.write(content);
	}

	return file;
}

async function runCli(...args: string[]) {
	const root = resolve(import.meta.dir, '..');
	const cliPath = join(root, 'dist', 'cli.js');

	const isCliFileExists = await Bun.file(cliPath).exists();
	if (!isCliFileExists) {
		throw new Error(
			`dist/cli.js not found. Run "bun run build" or use "bun run test:all". Looked for: ${cliPath}`,
		);
	}

	const proc = Bun.spawn({
		cmd: ['bun', 'run', '--bun', cliPath, ...args],
		cwd: root,
		stderr: 'pipe',
	});

	const [stdout, stderr, exitCode] = await Promise.all([
		proc.stdout.text(),
		proc.stderr.text(),
		proc.exited,
	]);

	return {
		exitCode,
		stdout: stdout.trim(),
		stderr: stderr.trim(),
	};
}

describe.if(process.env.CLI_TESTS === '1')('CLI (integration)', () => {
	test('--help prints usage and exits 0', async () => {
		const result = await runCli('--help');

		expect(result.exitCode).toBe(0);
		expect(result.stdout).toContain('Usage: minify-html-css');
	});

	test('--version prints version and exits 0', async () => {
		const result = await runCli('--version');
		const version = JSON.parse(
			await Bun.file(resolve(import.meta.dir, '..', 'package.json')).text(),
		).version;

		expect(result.exitCode).toBe(0);
		expect(result.stdout).toBe(version);
	});

	test('No input exits 1 and prints help', async () => {
		const result = await runCli('-o', 'out.html', '-t', 'html');

		expect(result.exitCode).toBe(1);
		expect(result.stderr).toBe('Error: Input file is required.');
		expect(result.stdout).toContain('Usage: minify-html-css');
	});

	test('Minifies HTML via -i and prints to stdout when -o is omitted', async () => {
		const input = `
			<p>
				Hello World!
			</p>
		`;
		const output = `<p>Hello World!</p>`;

		const inputFile = await createTestFile('input', 'html', input);
		const result = await runCli('-i', inputFile.name!);
		await inputFile.delete();

		expect(result.exitCode).toBe(0);
		expect(result.stdout).toBe(output);
	});

	test('Minifies CSS via -i and writes to output file when -o is provided', async () => {
		const input = `
			body {
				color  :   red  ;
			}
		`;
		const output = `body{color:red}`;

		const [inputFile, outputFile] = await Promise.all([
			createTestFile('input', 'css', input),
			createTestFile('output', 'css'),
		]);
		const result = await runCli('-i', inputFile.name!, '-o', outputFile.name!);
		const outputContent = await outputFile.text();
		await Promise.all([inputFile.delete(), outputFile.delete()]);

		expect(result.exitCode).toBe(0);
		expect(result.stdout).toBe(
			`Minified ${inputFile.name!} written to: ${outputFile.name!}.`,
		);
		expect(outputContent).toBe(output);
	});

	test('Accepts positional input file argument', async () => {
		const input = `
			<div>
				<p>     Hello World!     </p>
				<span>  Some content   </span>
			</div>
		`;
		const output = `<div><p>Hello World!</p><span>Some content</span></div>`;

		const [inputFile, outputFile] = await Promise.all([
			createTestFile('input', 'html', input),
			createTestFile('output', 'html'),
		]);
		const result = await runCli(inputFile.name!, '-o', outputFile.name!);
		const outputContent = await outputFile.text();
		await Promise.all([inputFile.delete(), outputFile.delete()]);

		expect(result.exitCode).toBe(0);
		expect(outputContent).toBe(output);
	});

	test('Fails when file type cannot be detected and -t is not provided', async () => {
		const inputFile = await createTestFile('input', 'unknown', 'Some content');
		const result = await runCli('-i', inputFile.name!);
		await inputFile.delete();

		expect(result.exitCode).toBe(1);
		expect(result.stderr).toBe(
			'Error: Could not detect file type. Please specify using -t option.',
		);
	});

	test('Allows forcing type via -t when extension cannot be detected.', async () => {
		const input = `
			body {
				color:   red ;
			}
		`;
		const output = `body{color:red}`;

		const [inputFile, outputFile] = await Promise.all([
			createTestFile('input', 'unknown', input),
			createTestFile('output', 'css'),
		]);
		const result = await runCli(
			'-i',
			inputFile.name!,
			'-o',
			outputFile.name!,
			'-t',
			'css',
		);
		const outputContent = await outputFile.text();
		await Promise.all([inputFile.delete(), outputFile.delete()]);

		expect(result.exitCode).toBe(0);
		expect(outputContent).toBe(output);
	});

	test('Overrides detected file type when -t is provided.', async () => {
		const input = `
			<p>
				Hello     World!
			</p>
		`;
		const output = `<p>Hello World!</p>`;

		const [inputFile, outputFile] = await Promise.all([
			createTestFile('input', 'css', input),
			createTestFile('output', 'html'),
		]);
		const result = await runCli(
			'-i',
			inputFile.name!,
			'-o',
			outputFile.name!,
			'-t',
			'html',
		);
		const outputContent = await outputFile.text();
		await Promise.all([inputFile.delete(), outputFile.delete()]);

		expect(result.exitCode).toBe(0);
		expect(outputContent).toBe(output);
	});

	test('Invalid -t value exits 1', async () => {
		const inputFile = await createTestFile('input', 'html', '<p>Hello</p>');
		const result = await runCli('-i', inputFile.name!, '-t', 'invalidType');
		await inputFile.delete();

		expect(result.exitCode).toBe(1);
		expect(result.stderr).toBe(
			'Error: Invalid file type. The file type must be "html" or "css".',
		);
	});

	test('Unknown extra positional arguments exit 1', async () => {
		const unknownPosArg = 'positionalArg';
		const inputFile = await createTestFile('input', 'html', '<p>Hello</p>');
		const result = await runCli(inputFile.name!, unknownPosArg);
		await inputFile.delete();

		expect(result.exitCode).toBe(1);
		expect(result.stderr).toBe(
			`Unknown positional argument: ${unknownPosArg}.`,
		);
	});

	test('Unknown extra positional argument with -i option exits 1', async () => {
		const unknownPosArg = 'positionalArg';
		const inputFile = await createTestFile('input', 'html', '<p>Hello</p>');
		const result = await runCli(
			'-i',
			inputFile.name!,
			'-t',
			'html',
			unknownPosArg,
		);
		await inputFile.delete();

		expect(result.exitCode).toBe(1);
		expect(result.stderr).toBe(
			`Unknown positional argument: ${unknownPosArg}.`,
		);
	});

	test('Unknown option exits 1 and reports error', async () => {
		const unknownOption = '--unknown';
		const result = await runCli(unknownOption, 'value');

		expect(result.exitCode).toBe(1);
		expect(result.stderr).toBe(`Unknown option: ${unknownOption}.`);
	});
});
