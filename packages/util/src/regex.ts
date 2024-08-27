export const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const passwordLowercaseRegex = /^.*[a-z]+.*$/;
export const passwordUppercaseRegex = /^.*[A-Z]+.*$/;
export const passwordNumericRegex = /^.*[0-9]+.*$/;
export const passwordSpecialRegex = /^.*[#?!@$%^&*-]+.*$/;

export const osuEmailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@oregonstate\.edu$/;

export const usPhoneRegex = /^(\+0?1)?\s?\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})$/;
