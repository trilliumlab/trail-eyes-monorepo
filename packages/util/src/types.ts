// This is where all my really cursed types go :)

/**
 * Narrows `T` to a literal
 */
export type Narrow<T> = { [Key in keyof T]: T[Key] };
/**
 * Type of `T` with the keys and values swapped
 */
export type Reverse<T extends Record<PropertyKey, PropertyKey | undefined>> = {
  [Key in keyof T as T[Key] extends PropertyKey ? T[Key] : never]: Key;
};
/**
 * Evaluates to `Y` if `T` and `U` are same type, otherwise evaluates to `N`
 */
export type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <
  G,
>() => G extends U ? 1 : 2
  ? Y
  : N;

/**
 * Gets the length of string literal `T`
 */
export type LengthOfString<
  T extends string,
  TLenAcum extends string[] = [],
> = T extends `${string}${infer TRest}`
  ? LengthOfString<TRest, [...TLenAcum, string]>
  : TLenAcum['length'];

/**
 * Gets the first `TLen` characters of `T`, where `T` is a string literal and `TLen` is a number literal
 */
export type TruncateTo<
  T extends string,
  TLen extends number,
  TLenAcum extends number[] = [],
  TStrAcum extends string = '',
> = TLen extends TLenAcum['length']
  ? TStrAcum
  : T extends `${infer TFirst}${infer TRest}`
    ? TruncateTo<TRest, TLen, [0, ...TLenAcum], `${TStrAcum}${TFirst}`>
    : TStrAcum;

/**
 * Removes the string literal prefix `TPrefix` from the string literal `T`
 */
export type WithoutPrefixInsensitive<
  T extends string,
  TPrefix extends string,
> = Lowercase<T> extends `${Lowercase<TPrefix>}${string}`
  ? T extends `${TruncateTo<T, LengthOfString<TPrefix>>}${infer TInner}`
    ? TInner
    : T
  : T;
