import { randomInt, randomBytes } from 'node:crypto';
import { verificationCodeLength } from '~/consts';

/**
 * Generates a 6 digit verification code.
 * 
 * @returns The generated verification code as a string.
 */
export function createVerificationCode() {
  return randomInt(10 ** verificationCodeLength).toLocaleString('en-US', {
    minimumIntegerDigits: verificationCodeLength,
    useGrouping: false,
  });
}

/**
 * Generates a random 48 byte token.
 *
 * @returns A randomly generated token as a base64 string.
 */
export function createToken() {
  return randomBytes(48).toString('base64');
}
