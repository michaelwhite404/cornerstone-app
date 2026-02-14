import { RequestHandler } from "express";
import xss, { IFilterXSSOptions } from "xss";

const options: IFilterXSSOptions = {
  whiteList: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script"],
};

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    return xss(value, options);
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === "object") {
    return sanitizeObject(value as Record<string, unknown>);
  }
  return value;
};

const sanitizeObject = (obj: Record<string, unknown>): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    sanitized[key] = sanitizeValue(obj[key]);
  }
  return sanitized;
};

/**
 * Express middleware that sanitizes req.body, req.query, and req.params
 * to prevent XSS attacks by stripping HTML tags and script content.
 */
const xssSanitize: RequestHandler = (req, _res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query) as typeof req.query;
  }
  if (req.params) {
    req.params = sanitizeValue(req.params) as typeof req.params;
  }
  next();
};

export default xssSanitize;
