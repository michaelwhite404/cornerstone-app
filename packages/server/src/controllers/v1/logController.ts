import CheckoutLog from "../../models/checkoutLogModel";
import * as factory from "./handlerFactory";

export const getAllLogs = factory.getAll(CheckoutLog);
export const getLog = factory.getOne(CheckoutLog, {
  path: "device deviceUser teacherCheckOut teacherCheckIn",
  select: "deviceType name fullName grade email",
});
export const getLogsByDevice = factory.getAll(CheckoutLog);
