export * from './memoize';

/**
 * Capitalizes the first letter of a string (respecting utf16 characters).
 *
 * @param str - The string to capitalize.
 * @returns The string with the first letter capitalized.
 */
export function capitalizeFirstLetter(str: string) {
  const firstCodePoint = str.codePointAt(0);
  if (!firstCodePoint) return '';

  const index = firstCodePoint > 0xffff ? 2 : 1;

  return String.fromCodePoint(firstCodePoint).toUpperCase() + str.slice(index);
}
