export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'HttpError';
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  static badRequest(message = 'Bad Request', code?: string): HttpError {
    return new HttpError(400, message, code ?? 'BAD_REQUEST');
  }

  static unauthorized(message = 'Unauthorized', code?: string): HttpError {
    return new HttpError(401, message, code ?? 'UNAUTHORIZED');
  }

  static forbidden(message = 'Forbidden', code?: string): HttpError {
    return new HttpError(403, message, code ?? 'FORBIDDEN');
  }

  static notFound(message = 'Not Found', code?: string): HttpError {
    return new HttpError(404, message, code ?? 'NOT_FOUND');
  }

  static conflict(message = 'Conflict', code?: string): HttpError {
    return new HttpError(409, message, code ?? 'CONFLICT');
  }

  static internal(message = 'Internal Server Error', code?: string): HttpError {
    return new HttpError(500, message, code ?? 'INTERNAL_ERROR');
  }
}
