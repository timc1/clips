import ExtendableError from "extendable-error";

export class UnauthorizedError extends ExtendableError {
  constructor(
    message: string = "Unauthorized Request",
    public code: number = 401
  ) {
    super(message);
  }
}

export class TokenExpiredError extends ExtendableError {
  constructor(message: string = "Token Expired", public code: number = 498) {
    super(message);
  }
}

export class InvalidCredentialsError extends ExtendableError {
  constructor(
    message: string = "Invalid credentials",
    public code: number = 401
  ) {
    super(message);
  }
}

export class NotFoundError extends ExtendableError {
  constructor(message: string = "Not Found", public code: number = 404) {
    super(message);
  }
}

// Generally used for Joi validation errors, we can simply throw a regular Error
// but for consistency sake here's a ValidationError that you can throw!
export class ValidationError extends ExtendableError {
  constructor(message: string = "Validation Error", public code: number = 400) {
    super(message);
  }
}

// When the client sends a payload that doesn't change any values on the server.
export class NothingToUpdateError extends ExtendableError {
  constructor(
    message: string = "Nothing To Update",
    public code: number = 400
  ) {
    super(message);
  }
}

export class NetworkError extends ExtendableError {
  constructor(
    message: string = "A network error occurred",
    public code: number = 400
  ) {
    super(message);
  }
}

export class OfflineError extends ExtendableError {
  constructor(
    message: string = "You seem to be offline",
    public code: number = 400
  ) {
    super(message);
  }
}

export class SuspiciousRequestError extends ExtendableError {
  constructor(
    message: string = "Can't process because of suspicious activity",
    public code: number = 403
  ) {
    super(message);
  }
}

export class InvalidValidationRequestError extends ExtendableError {
  constructor(
    message: string = "No validation of this type exists",
    public code: number = 400
  ) {
    super(message);
  }
}
