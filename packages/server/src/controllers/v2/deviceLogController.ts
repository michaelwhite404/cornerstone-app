import { RequestHandler } from "express";
import { CheckoutLog } from "@models";
import { PopOptions } from "@@types";
import * as factory from "./handlerFactory";

const Model = CheckoutLog;
const key = "deviceLog";
const pop = {
  path: "device deviceUser teacherCheckOut teacherCheckIn",
  select: "name brand fullName",
} as PopOptions;

/** `GET` - Gets all device logs
 *  - All authorized users can access this route
 */
export const getAllLogs: RequestHandler = factory.getAll(Model, `${key}s`, {}, pop);

/** `GET` - Gets a single device log
 *  - All authorized users can access this route
 */
export const getOneLog = factory.getOne(Model, key);
