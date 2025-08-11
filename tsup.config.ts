import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	target: 'node18',
	platform: 'node',
	dts: true,
	splitting: false,
	sourcemap: false,
	clean: true,
	minify: false,
});
