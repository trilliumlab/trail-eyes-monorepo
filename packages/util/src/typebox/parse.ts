import { Kind, type TLiteral, type StaticDecode, type TSchema } from '@sinclair/typebox';
import { TransformDecodeCheckError, Value, ValueErrorType } from '@sinclair/typebox/value';

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

/**
 * Parses env variables from a Typebox schema and provides helpful error messages for missing variables.
 *
 * @param schema The Typebox schema of the env variables to parse.
 * @param envPath The path to the .env file the variables are loaded from. Used to generate more detailed errors.
 * @param additionalVars Additional variables to be parsed.
 * @returns The validated env variables.
 */
export function parseEnv<T extends TSchema, R = StaticDecode<T>>(
  schema: T,
  envPath?: string,
  additionalVars?: Record<string, unknown>,
): R {
  try {
    return parse(schema, { ...process.env, ...additionalVars }); // run decode transforms (optional)
  } catch (e) {
    if (e instanceof TransformDecodeCheckError) {
      const varName = e.error.path.substring(1);
      const varValue = e.error.value;
      const varType = getErrorTypeString(e.error.schema);

      if (e.error.type === ValueErrorType.ObjectRequiredProperty) {
        // Missing property error
        let message = `Missing required ENV variable '${varName}' '${varType}'.`;
        if (envPath) {
          message += `\n'${varName}' should be set in '${envPath}'.`;
          message += `\nSee '${envPath}.example' for example usage.`;
        }
        throw {
          name: 'MissingEnvVar',
          message,
        };
      }
      if (e.error.message.toLowerCase().startsWith('expected')) {
        let message = `Expected ENV variable '${varName}' to be ${varType}: value '${varValue}' cannot be coerced to type.`;
        if (envPath) {
          message += `\nSee '${envPath}.example' for example usage.`;
        }
        throw {
          name: 'InvalidEnvVar',
          message,
        };
      }
      console.error('Unknown TransformDecodeCheckError.');
    } else {
      console.error('Unknown parsing error.');
    }
    throw e;
  }
}
