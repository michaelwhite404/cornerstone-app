import { RequestHandler } from "express";

/**
 * Sanitizes an object by removing keys that start with '$' or contain '.'
 * to prevent NoSQL injection attacks.
 */
const sanitizeObject = (obj: Record<string, unknown>): void => {
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      sanitizeObject(obj[key] as Record<string, unknown>);
    } else if (Array.isArray(obj[key])) {
      for (const item of obj[key] as unknown[]) {
        if (item && typeof item === "object") {
          sanitizeObject(item as Record<string, unknown>);
        }
      }
    }
  }
};

/**
 * Express middleware that sanitizes req.body, req.query, and req.params
 * to prevent NoSQL injection by removing keys starting with '$' or containing '.'.
 * Compatible with Express 5 where req.query is a getter.
 */
const mongoSanitizeMiddleware: RequestHandler = (req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === "object") {
    sanitizeObject(req.query as Record<string, unknown>);
  }
  if (req.params && typeof req.params === "object") {
    sanitizeObject(req.params);
  }
  next();
};

export default mongoSanitizeMiddleware;
