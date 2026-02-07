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
    keys.forEach((k) => (req.body[k] = req.params[k]));
    next();
  };
};

export const addDeviceToQuery: RequestHandler = (req, _, next) => {
  if (req.params.device) req.query.device = req.params.device;
  next();
};

export const addKeyToQuery = (key: string): RequestHandler => {
  return (req, _, next) => {
    if (req.params[key]) req.query[key] = req.params[key];
    next();
  };
};
