export type MinifierType = 'js-module' | 'js-script' | 'json' | 'css' | 'html';

export type MinifyHTMLOptions = {
	filename?: string;
	iframeSrcdoc?: boolean;
	scriptingEnabled?: boolean;
	forceSetHtml5Doctype?: boolean;
	collapseWhitespaces?:
		| 'none'
		| 'all'
		| 'smart'
		| 'conservative'
		| 'advanced-conservative'
		| 'only-metadata';
	removeEmptyMetadataElements?: boolean;
	removeComments?: boolean;
	preserveComments?: string[];
	minifyConditionalComments?: boolean;
	removeEmptyAttributes?: boolean;
	removeRedundantAttributes?: 'none' | 'all' | 'smart';
	collapseBooleanAttributes?: boolean;
	normalizeAttributes?: boolean;
	minifyJson?: boolean | { pretty?: boolean };
	// TODO improve me after typing `@swc/css`
	minifyJs?: boolean | { parser?: any; minifier?: any; codegen?: any };
	minifyCss?:
		| boolean
		| { lib: 'lightningcss' }
		| { lib: 'swc'; parser?: any; minifier?: any; codegen?: any };
	minifyAdditionalScriptsContent?: [string, MinifierType][];
	minifyAdditionalAttributes?: [string, MinifierType][];
	sortSpaceSeparatedAttributeValues?: boolean;
	sortAttributes?: boolean;
	tagOmission?: boolean;
	selfClosingVoidElements?: boolean;
	quotes?: boolean;
};
