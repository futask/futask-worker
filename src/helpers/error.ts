export const HTTP_ERROR_CODES = {
  unauthorized: 401,
  badRequest: 400,
  notFound: 404,
  internalServerError: 500,
  rateLimit: 429
};

export default class AppError {
  message: string;
  status?: number;
  properties?: Record<string, unknown>;

  constructor(message: string, status?: number, properties?: Record<string, unknown>) {
    this.message = message;
    this.properties = properties;
    this.status = status;
  }

  static unauthorized(message = 'Not authorised.') {
    return new AppError(message, HTTP_ERROR_CODES.unauthorized);
  }

  static badRequest(message = 'Bad Request.') {
    return new AppError(message, HTTP_ERROR_CODES.badRequest);
  }

  static notFound(message = 'Not Found.') {
    return new AppError(message, HTTP_ERROR_CODES.notFound);
  }

  static internalServerError(message = 'Internal Server Error.') {
    return new AppError(message, HTTP_ERROR_CODES.internalServerError);
  }
}
