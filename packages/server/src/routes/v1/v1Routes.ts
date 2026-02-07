import { Router } from "express";
import deviceRouter from "../v1/deviceRoutes";
import logRouter from "../v1/logRoutes";
import errorLogRouter from "../v1/errorLogRoutes";
import employeeRouter from "../v1/employeeRoutes";
import studentRouter from "../v1/studentRoutes";
import CustomRequest from "../../types/customRequest";

const v1Router = Router();

v1Router.use(
  "/chromebooks",
  (req, _, next) => {
    (req as CustomRequest).device = "chromebook";
    next();
  },
  deviceRouter
);
v1Router.use(
  "/tablets",
  (req, _, next) => {
    (req as CustomRequest).device = "tablet";
    next();
  },
  deviceRouter
);
v1Router.use(
  "/error-logs",
  (req, _, next) => {
    (req as CustomRequest).key = "error";
    next();
  },
  errorLogRouter
);
v1Router.use(
  "/logs",
  (req, _, next) => {
    (req as CustomRequest).key = "log";
    next();
  },
  logRouter
);
v1Router.use("/users", employeeRouter);
v1Router.use("/students", studentRouter);

export default v1Router;
