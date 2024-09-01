import { randomInt, randomBytes } from 'node:crypto';
import { otpCodeLength } from '~/consts';

/**
 * Generates a 6 digit verification code.
 *
 * @returns The generated verification code as a string.
 */
export function createOtpCode() {
  return randomInt(10 ** otpCodeLength).toLocaleString('en-US', {
    minimumIntegerDigits: otpCodeLength,
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
