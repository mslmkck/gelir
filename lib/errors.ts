export class HttpError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
    this.name = new.target.name;
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Invalid request", details?: unknown) {
    super(400, message, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Conflict detected") {
    super(409, message);
  }
}
