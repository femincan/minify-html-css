import { extname } from 'node:path';

export type FileType = 'html' | 'css';
export type CLIOptions = {
	input?: string;
	output?: string;
	type?: string;
	help?: boolean;
	version?: boolean;
};

export function parseOptions(args: string[]): CLIOptions {
	const options: CLIOptions = {};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i] as string;

		switch (arg) {
			case '-i':
			case '--input':
				options.input = args[++i];
				break;
			case '-o':
			case '--output':
				options.output = args[++i];
				break;
			case '-t':
			case '--type':
				options.type = args[++i];
				break;
			case '-h':
			case '--help':
				options.help = true;
				break;
			case '-v':
			case '--version':
				options.version = true;
				break;
			default:
				if (arg.startsWith('-')) {
					console.error(`Unknown option: ${arg}.`);
					process.exit(1);
				}

				if (options.input) {
					console.error(`Unknown positional argument: ${arg}.`);
					process.exit(1);
				}

				// Positional argument (input file)
				options.input = arg;
		}
	}

	return options;
}

export function detectFileType(filePath: string): 'html' | 'css' | null {
	const ext = extname(filePath).toLowerCase();
	if (ext === '.html' || ext === '.htm') return 'html';
	if (ext === '.css') return 'css';
	return null;
}
