import { Router } from "express";
import textbookRouter from "./textbookRoutes";
import singleTextbookRouter from "./singleTextbookRoutes";
import studentRouter from "./studentRoutes";
import employeeRouter from "./employeeRoutes";
import deviceRouter from "./deviceRoutes";
import deviceLogRouter from "./deviceLogRoutes";
import deviceErrorLogRouter from "./deviceErrorLogRoutes";
import roomRouter from "./roomRoutes";
import timesheetRouter from "./timesheetRoutes";
import departmentRouter from "./departmentRoutes";
import orgUnitRouter from "./orgUnitRoutes";
import schoolYearRouter from "./schoolYearRoutes";
import shortUrlRouter from "./shortUrlRoutes";
import aftercareRouter from "./aftercareRoutes";
import groupRouter from "./groupRoutes";
import ticketRouter from "./ticketRoutes";
import reimbursementRouter from "./reimbursementRoutes";
import leaveRouter from "./leaveRoutes";
import testRouter from "./testRoutes";

const v2Router = Router();

v2Router.use("/students", studentRouter);
v2Router.use("/users", employeeRouter);
v2Router.use("/devices", deviceRouter);
v2Router.use("/textbooks", textbookRouter);
v2Router.use("/rooms", roomRouter);
v2Router.use("/timesheets", timesheetRouter);
v2Router.use("/departments", departmentRouter);
v2Router.use("/org-units", orgUnitRouter);
v2Router.use("/short", shortUrlRouter);
v2Router.use("/aftercare", aftercareRouter);
v2Router.use("/groups", groupRouter);
v2Router.use("/tickets", ticketRouter);
v2Router.use("/reimbursements", reimbursementRouter);
v2Router.use("/leaves", leaveRouter);
v2Router.use("/tests", testRouter);
v2Router.use("/school-year", schoolYearRouter);
// v2Router.use("/ideas" /* ,ideaRouter */);

export {
  textbookRouter,
  singleTextbookRouter,
  studentRouter,
  employeeRouter,
  deviceRouter,
  deviceLogRouter,
  deviceErrorLogRouter,
  roomRouter,
  timesheetRouter,
  departmentRouter,
  orgUnitRouter,
  shortUrlRouter,
};
export default v2Router;
