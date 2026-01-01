export type MinifyCSSOptions = {
	/**
	 * Whether to enable minification.
	 * @default true
	 */
	minify?: boolean;
	/** The browser targets for the generated code. */
	targets?: {
		android?: number;
		chrome?: number;
		edge?: number;
		firefox?: number;
		ie?: number;
		ios_saf?: number;
		opera?: number;
		safari?: number;
		samsung?: number;
	};
	/** Whether to enable parsing various draft syntax. */
	drafts?: {
		/** Whether to enable `@custom-media` rules. */
		customMedia?: boolean;
	};
	/** Whether to enable various non-standard syntax. */
	nonStandard?: {
		/** Whether to enable the non-standard `>>>` and `/deep/` selector combinators used by Angular and Vue. */
		deepSelectorCombinator?: boolean;
	};
	/** Whether to compile this file as a CSS module. */
	cssModules?:
		| boolean
		| {
				/** The pattern to use when renaming class names and other identifiers. Default is `[hash]_[local]`. */
				pattern?: string;
				/** Whether to rename dashed identifiers, e.g. custom properties. */
				dashedIdents?: boolean;
				/** Whether to enable hashing for `@keyframes`. */
				animation?: boolean;
				/** Whether to enable hashing for CSS grid identifiers. */
				grid?: boolean;
				/** Whether to enable hashing for `@container` names. */
				container?: boolean;
				/** Whether to enable hashing for custom identifiers. */
				customIdents?: boolean;
				/** Whether to require at least one class or id selector in each rule. */
				pure?: boolean;
		  };
	/**
	 * Whether to analyze dependencies (e.g. `@import` and `url()`).
	 * When enabled, `@import` rules are removed, and `url()` dependencies
	 * are replaced with hashed placeholders that can be replaced with the final
	 * urls later (after bundling). Dependencies are returned as part of the result.
	 */
	analyzeDependencies?:
		| boolean
		| {
				/** Whether to preserve `@import` rules rather than removing them. */
				preserveImports?: boolean;
		  };
	/**
	 * Replaces user action pseudo classes with class names that can be applied from JavaScript.
	 * This is useful for polyfills, for example.
	 */
	pseudoClasses?: {
		hover?: string;
		active?: string;
		focus?: string;
		focusVisible?: string;
		focusWithin?: string;
	};
	/**
	 * A list of class names, ids, and custom identifiers (e.g. `@keyframes`) that are known
	 * to be unused. These will be removed during minification. Note that these are not
	 * selectors but individual names (without any `.` or `#` prefixes).
	 */
	unusedSymbols?: string[];
	/**
	 * Whether to ignore invalid rules and declarations rather than erroring.
	 * When enabled, warnings are returned, and the invalid rule or declaration is
	 * omitted from the output code.
	 */
	errorRecovery?: boolean;
};
