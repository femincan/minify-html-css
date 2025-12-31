#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { minifyCSS, minifyHTML } from './index';
import { detectFileType, type FileType, parseOptions } from './utils/cli-utils';

const helpText = `
Usage: minify-html-css <input> [options]

Positional arguments:
	<input>                Input file path (can be provided as a positional argument or with -i/--input)

Options:
	-i, --input <file>     Input file path (required unless provided as a positional argument)
	-o, --output <file>    Output file path (optional, defaults to stdout)
	-t, --type <type>      File type: html or css (auto-detected if not specified)
	-h, --help             Display this help message
	-v, --version          Display version number

Examples:
	minify-html-css input.html -o output.html
	minify-html-css -i input.html -o output.html
	minify-html-css -i styles.css -o styles.min.css
	minify-html-css -i index.html -t html
	minify-html-css input.html > output.html
	minify-html-css -i input.html > output.html
	minify-html-css ./path/to/file.css -o ./path/to/file.min.css
`;

function main() {
	const args = process.argv.slice(2);
	const options = parseOptions(args);

	if (options.help) {
		console.log(helpText);
		process.exit(0);
	}

	if (options.version) {
		console.log(process.env.VERSION);
		process.exit(0);
	}

	if (!options.input) {
		console.error('Error: Input file is required');
		console.log(helpText);
		process.exit(1);
	}

	try {
		const inputPath = resolve(process.cwd(), options.input);
		const content = readFileSync(inputPath, 'utf-8');

		let fileType: FileType;
		if (options.type) {
			const normalizedType = options.type.toLowerCase();
			if (normalizedType !== 'html' && normalizedType !== 'css') {
				console.error(
					'Error: Invalid file type. The file type must be "html" or "css"',
				);
				process.exit(1);
			}

			fileType = normalizedType;
		} else {
			const detectedFileType = detectFileType(options.input);
			if (!detectedFileType) {
				console.error(
					'Error: Could not detect file type. Please specify using -t option',
				);
				process.exit(1);
			}

			fileType = detectedFileType;
		}

		let result: ReturnType<typeof minifyHTML> | ReturnType<typeof minifyCSS>;
		switch (fileType) {
			case 'html':
				result = minifyHTML(content);
				break;
			case 'css':
				result = minifyCSS(content);
				break;
			default:
				throw new Error('Unexpected file type');
		}

		if (options.output) {
			const outputPath = resolve(process.cwd(), options.output);
			writeFileSync(outputPath, result.code, 'utf-8');
			console.log(`Minified ${options.input} written to: ${outputPath}`);
		} else {
			// Write to stdout
			console.log(result.code);
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error: ${error.message}`);
		} else {
			console.error('An unknown error occurred');
		}
		process.exit(1);
	}
}

main();
