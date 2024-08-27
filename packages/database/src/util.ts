import { randomInt, randomBytes } from 'node:crypto';
import { verificationCodeLength } from '~/consts';

export function createVerificationCode() {
  return randomInt(10 ** verificationCodeLength).toLocaleString('en-US', {
    minimumIntegerDigits: verificationCodeLength,
    useGrouping: false,
  });
}

export function createToken() {
  return randomBytes(48).toString('base64');
}
