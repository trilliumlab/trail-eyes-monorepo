export const hashAlgo = {
  algorithm: 'argon2id',
  memoryCost: 19456,
  timeCost: 2,
} as const;

export const otpCodeLength = 6;

export const verificationTimeoutSeconds = 1.5 * 60;
export const verificationExpirationMinutes = 60;
export const verificationRefreshMinutes = 55;

export const maxOtpAttempts = 5;
export const otpTimeoutSeconds = 2.5 * 60;
