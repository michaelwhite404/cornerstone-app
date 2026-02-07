import { Router } from "express";
import { deviceController, helpers, authController } from "@controllers/v2";

import deviceLogRouter from "./deviceLogRoutes";
import deviceErrorLogRouter from "./deviceErrorLogRoutes";

const { protect, restrictTo } = authController;

const deviceRouter = Router();

const nonManualUpdateKeys = [
  "dueDate",
  "deviceType",
  "checkedOut",
  "lastUser",
  "teacherCheckOut",
  "lastCheckOut",
  "lastCheckIn",
  "slug",
  "status",
];
deviceRouter.use(protect);

deviceRouter.use("/logs", deviceLogRouter);
deviceRouter.use("/:device/logs", deviceLogRouter);
deviceRouter.use("/errors", deviceErrorLogRouter);
deviceRouter.use("/:device/errors", deviceErrorLogRouter);

deviceRouter.route("/").get(deviceController.getAllDevices).post(deviceController.createDevice);

deviceRouter.get("/types", deviceController.getAllDeviceTypes);

deviceRouter.get(
  "/from-google",
  restrictTo("Super Admin", "Admin"),
  deviceController.getDevicesFromGoogle
);
deviceRouter.get(
  "/from-google/:id",
  restrictTo("Super Admin", "Admin"),
  deviceController.getOneDeviceFromGoogle
);
deviceRouter.post(
  "/from-google/:id/:reset(wipe|powerwash)",
  restrictTo("Super Admin"),
  deviceController.resetDeviceFromGoogle
);
deviceRouter.post(
  "/from-google/:id/move",
  restrictTo("Super Admin"),
  deviceController.moveDeviceToOu
);
deviceRouter.post(
  "/from-google/:id/:action(disable|reenable|deprovision)",
  restrictTo("Super Admin"),
  deviceController.deviceAction
);

deviceRouter
  .route("/:id")
  .get(deviceController.getOneDevice)
  .patch(
    restrictTo("Super Admin", "Admin"),
    helpers.omitFromBody(...nonManualUpdateKeys),
    deviceController.updateDevice
  )
  .delete(restrictTo("Super Admin"), deviceController.deleteDevice);

deviceRouter.post("/:id/check-out/student/:student_id", deviceController.checkOutDevice);
deviceRouter.post("/:id/check-in", deviceController.checkInDevice);
deviceRouter.post("/:id/assign", deviceController.assignDevice);
deviceRouter.post("/:id/unassign", deviceController.unassignDevice);

export default deviceRouter;
