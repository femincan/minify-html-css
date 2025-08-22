/**
 * Deeply merges two option objects, copying all enumerable properties from the source object into the target object.
 *
 * - If a key exists in both objects and both values are plain objects (not arrays), they are merged recursively.
 * - Arrays and non-object (primitive) values from the source will overwrite those in the target.
 * - Properties whose keys are included in the `disabledOptions` array are skipped and left as-is in the target.
 * - **Note:** `disabledOptions` only applies to the top-level properties and does not prevent merging or overwriting of nested object keys.
 * - The original objects are not mutated; a new merged object is returned.
 *
 * @param {Record<string, unknown>} targetOptions The options object whose properties will be overwritten, extended, or merged with properties from `sourceOptions`.
 * @param {Record<string, unknown>} sourceOptions The options object whose properties will overwrite, extend, or merge with `targetOptions`.
 * @param {string[]} [disabledOptions] Optional array of keys that should not be merged at the top level; these keys are preserved from the target.
 * @returns {Record<string, unknown>} A new object representing a deep merge of `targetOptions` and `sourceOptions`, with `disabledOptions` respected at the top level only.
 */
export function mergeOptions(
	targetOptions: Record<string, unknown>,
	sourceOptions: Record<string, unknown>,
	disabledOptions?: string[],
): Record<string, unknown> {
	const mergedOptions = structuredClone(targetOptions);

	for (const key in sourceOptions) {
		if (disabledOptions?.includes(key)) {
			continue;
		}

		const sourceValue = sourceOptions[key];
		const targetValue = targetOptions[key];
		let mergedValue = sourceValue;

		// Check if the key corresponds to a plain object (not an array) and exists in targetOptions.
		// If both conditions are met, recursively merge the nested objects.
		// Note: Arrays are replaced directly from the source rather than merged.
		if (
			isPlainObject(sourceValue) &&
			Object.hasOwn(targetOptions, key) &&
			isPlainObject(targetValue)
		) {
			mergedValue = mergeOptions(targetValue, sourceValue);
		}

		mergedOptions[key] = mergedValue;
	}

	return mergedOptions;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && !Array.isArray(value) && value !== null;
}
