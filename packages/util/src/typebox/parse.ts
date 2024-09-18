import { Kind, type TLiteral, type StaticDecode, type TSchema } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

/**
 * Parses a value from a Typebox schema.
 *
 * @param schema The Typebox schema.
 * @param value The value to parse.
 * @returns The parsed value.
 */
export function parse<T extends TSchema, R = StaticDecode<T>>(schema: T, value: unknown): R {
  const cloned = Value.Clone(value); // clone because value ops can be mutable
  const defaulted = Value.Default(schema, cloned); // initialize defaults for value
  const converted = Value.Convert(schema, defaulted); // convert mismatched types for value
  const cleaned = Value.Clean(schema, converted); // remove unknown properties
  return Value.Decode(schema, cleaned); // run decode transforms (optional)
}

/**
 * Converts an error schema to a friendly string type descriptor.
 *
 * @param schema The error schema
 * @returns The formated type string
 */
function getErrorTypeString(schema: TSchema): string {
  const kind = schema[Kind];
  const type = schema.type;

  // If anyOf, then we need one of string
  if (schema.anyOf) {
    const anyOf: TLiteral[] = schema.anyOf;
    let out = 'one of [';
    for (const literal of anyOf) {
      out += `'${literal.const}', `;
    }
    return `${out.slice(0, -2)}]`;
  }

  // Default to printing type
  return `of type '${type ?? kind}'`;
}
