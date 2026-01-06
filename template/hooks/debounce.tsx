import { useState, useEffect } from 'react';

/**
 * Debounce hook for inputs to prevent too many requests against a database, server etc.
 * It can be used in every React component like this:
 * @example
 * ```tsx
 *   const [query, setQuery] = useState<string>("");
 *   const debouncedQuery = useDebounce(query, 200);
 * ```
 * @param value The value to debounce.
 * @param delay The delay in milliseconds.
 * @returns The debounced value.
 */
function useDebounce(value: string, delay: number): string {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default useDebounce;
