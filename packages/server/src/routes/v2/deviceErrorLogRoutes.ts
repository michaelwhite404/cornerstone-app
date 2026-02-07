import { Router } from "express";
import { helpers, deviceErrorLogController } from "@controllers/v2";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(helpers.addKeyToQuery("device"), deviceErrorLogController.getAllDeviceErrorLogs)
  .post(deviceErrorLogController.setCreateData, deviceErrorLogController.createErrorLog);

router
  .route("/:_id")
  .get(deviceErrorLogController.getDeviceErrorLog)
  .patch(deviceErrorLogController.updateErrorLog);

export default router;
