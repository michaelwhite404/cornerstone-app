/**
 * Creates a readable error for a client
 * @class
 */
class AppError extends Error {
  statusCode: number;
  status: "fail" | "error";
  isOperational: boolean;
  /**
   *
   * @param {string} message  A brief description of the error
   * @param {number} statusCode The status code of the error
   */
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
