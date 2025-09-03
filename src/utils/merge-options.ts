// biome-ignore-all lint/suspicious/noExplicitAny: the mergeOptions function is very dynamic and we should use any
/**
 * Deeply merges two option objects, copying all enumerable properties from the source object into the target object.
 *
 * - If a key exists in both objects and both values are plain objects (not arrays), they are merged recursively.
 * - Arrays and non-object (primitive) values from the source will overwrite those in the target.
 * - Properties whose keys are included in the `disabledOptions` array are skipped and left as-is in the target.
 * - **Note:** `disabledOptions` only applies to the top-level properties and does not prevent merging or overwriting of nested object keys.
 * - If a `callback` is provided, it is called **only for each top-level property in `sourceOptions`**. As a result, if a property exists in `targetOptions` but not in `sourceOptions`, the **callback will not be called** for that property, and it will be included in the merged result as is. The callback can **override the default merging behavior** for any property it processes.
 *   - If the `callback` returns a value other than `undefined`, that value is used for the merged property and the default logic is skipped for that property.
 *   - The callback receives `(key, targetValue, sourceValue, targetOptions, sourceOptions)`.
 * - The original objects are not mutated; a new merged object is returned.
 *
 * @param {TargetOptions} targetOptions
 * The options object whose properties will be overwritten, extended, or merged with properties from `sourceOptions`.
 * @param {SourceOptions} sourceOptions
 * The options object whose properties will overwrite, extend, or merge with `targetOptions`.
 * @param {string[]} [disabledOptions]
 * Optional array of keys that should not be merged at the top level; these keys are preserved from the target.
 * @param {(key: string, targetValue: any, sourceValue: any, targetOptions: TargetOptions, sourceOptions: SourceOptions) => any | undefined} [callback]
 * Optional function called for each top-level property in `sourceOptions`. If the callback returns a value other than `undefined`, that value is used as the merged property.
 *
 * **Caution:** The callback is not called for properties that exist only in `targetOptions` and not in `sourceOptions`; such properties are included in the merged result as is.
 * @returns {TargetOptions & SourceOptions}
 * A new object representing a deep merge of `targetOptions` and `sourceOptions`, with `disabledOptions` respected at the top level only, and with possible callback overrides at the top level only.
 */
export function mergeOptions<
	TargetOptions extends Record<PropertyKey, any>,
	SourceOptions extends Record<PropertyKey, any>,
>(
	targetOptions: TargetOptions,
	sourceOptions: SourceOptions,
	disabledOptions?: string[],
	callback?: <
		TargetValue extends TargetOptions[keyof TargetOptions],
		SourceValue extends SourceOptions[keyof SourceOptions],
	>(
		key: keyof SourceOptions,
		targetValue: TargetValue,
		sourceValue: SourceValue,
		targetOptions: TargetOptions,
		sourceOptions: SourceOptions,
	) => any | undefined,
): TargetOptions & SourceOptions {
	const mergedOptions = structuredClone(targetOptions);

	for (const key in sourceOptions) {
		if (disabledOptions?.includes(key)) {
			continue;
		}

		const targetValue = targetOptions[key];
		const sourceValue = sourceOptions[key];
		let mergedValue = sourceValue;

		if (callback) {
			const callbackResult = callback(
				key,
				targetValue,
				sourceValue,
				targetOptions,
				sourceOptions,
			);

			if (callbackResult !== undefined) {
				mergedValue = callbackResult;
				mergedOptions[key] = mergedValue;
				continue;
			}
		}

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
