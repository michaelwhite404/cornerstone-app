import { RequestHandler } from "express";

declare module "xss-clean" {
  const value: () => RequestHandler;
  export default value;
}
