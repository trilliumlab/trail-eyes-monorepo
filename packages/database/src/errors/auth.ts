class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class RegistrationConflictError extends BaseError {
  constructor() {
    super('Email already registered.');
  }
}

export class UserNotFoundError extends BaseError {
  constructor() {
    super('User not found.');
  }
}

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super('Invalid credentials.');
  }
}
