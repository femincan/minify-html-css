import { readFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

export default defineConfig([
	// Library build
	{
		entry: ['src/index.ts'],
		format: ['esm', 'cjs'],
		target: 'node18',
		platform: 'node',
		dts: true,
		splitting: false,
		sourcemap: false,
		clean: true,
		minify: false,
	},
	// CLI build
	{
		entry: ['src/cli.ts'],
		format: ['esm'],
		target: 'node18',
		platform: 'node',
		dts: false,
		splitting: false,
		sourcemap: false,
		clean: false,
		minify: false,
		outDir: 'dist',
		env: {
			VERSION: JSON.parse(readFileSync('./package.json').toString()).version,
		},
	},
]);
