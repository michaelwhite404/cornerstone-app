// definition types for express-subdomain
// by mademanix (https://github.com/mademanix/)
// todo: code improvement

import { RequestHandler } from "express";

type SubdomainCallback = (callback: (err: Error | null, allow?: boolean) => void) => void;

type SubdomainPromise = (callback: (req: any, res: any, next: any) => void) => void;

declare module "express-subdomain" {
  function subdomain(prefix: string | undefined, callbackFn: RequestHandler): SubdomainPromise;
  export = subdomain;
}
