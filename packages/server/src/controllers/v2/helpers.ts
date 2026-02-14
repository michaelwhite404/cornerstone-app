import { RequestHandler } from "express";
import { omitFromObject } from "@utils";

export const omitFromBody = (...keys: string[]): RequestHandler => {
  return (req, _, next) => {
    omitFromObject(req.body, ...keys);
    next();
  };
};

export const addParamsToBody = (...keys: string[]): RequestHandler => {
  return (req, _, next) => {
    keys.forEach((k) => {
      if (req.params[k]) {
        req.body[k] = req.params[k];
      }
    });
    next();
  };
};

/**
 * Middleware that adds route params to req.filterParams for use in queries.
 * Works around Express 5's immutable req.query by using a custom property.
 * Use with factory.getAll which merges req.filterParams into the query filter.
 */
export const addParamsToFilter = (...keys: string[]): RequestHandler => {
  return (req, _, next) => {
    if (!req.filterParams) {
      req.filterParams = {};
    }
    keys.forEach((k) => {
      const param = req.params[k];
      // In Express 5, wildcard params can be arrays - we only handle string params
      if (param && typeof param === "string") {
        req.filterParams![k] = param;
      }
    });
    next();
  };
};
