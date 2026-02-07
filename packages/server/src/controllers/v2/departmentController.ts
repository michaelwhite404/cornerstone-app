import { RequestHandler } from "express";
import { Department, DepartmentAvailableSetting } from "@models";
import * as factory from "./handlerFactory";
import { catchAsync, getUserLeaders } from "@utils";
import { DepartmentDocument } from "@@types/models";

const Model = Department;
const key = "department";

/** `GET` - Gets all departments
 *  - All authernicated users can access this route
 */
export const getAllDepartments: RequestHandler = factory.getAll(
  Model,
  `${key}s`,
  {},
  { path: "membersCount" }
);

/** `GET` - Gets a single department
 *  - All authernicated users can access this route
 */
export const getOneDepartment: RequestHandler = factory.getOneById(Model, key, {
  path: "members membersCount",
});

/** `POST` - Creates a new department
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
export const createDepartment: RequestHandler = factory.createOne(Model, key);

export const getMyLeaders = catchAsync(async (req, res) => {
  const leaders = await getUserLeaders(req.employee);
  res.sendJson(200, { leaders });
});

export const getAllowTicketsDepartments = catchAsync(async (_, res) => {
  // @ts-ignore
  const departments: DepartmentDocument[] = await DepartmentAvailableSetting.allowTickets();

  res.sendJson(200, { departments });
});
