import { RequestHandler } from "express";
import CheckoutLog from "../../models/checkoutLogModel";
import PopOptions from "../../types/popOptions";
import * as factory from "./handlerFactory";

const Model = CheckoutLog;
const key = "deviceLog";
const pop = { path: "deviceUser teacherCheckOut teacherCheckIn", select: "fullName" } as PopOptions;

/** `GET` - Gets all device logs
 *  - All authorized users can access this route
 */
export const getAllLogs: RequestHandler = factory.getAll(Model, `${key}s`, {}, pop);

/** `GET` - Gets a single device log
 *  - All authorized users can access this route
 */
export const getOneLog = factory.getOne(Model, key);
