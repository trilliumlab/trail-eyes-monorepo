export const hashAlgo = {
  algorithm: 'argon2id',
  memoryCost: 19456,
  timeCost: 2,
} as const;

export const verificationCodeLength = 6;

export const verificationRequestTimeoutSeconds = 90;
export const verificationCodeExpirationMinutes = 60;
export const verificationCodeRenewMinutes = 55;
