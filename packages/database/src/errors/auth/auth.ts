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
