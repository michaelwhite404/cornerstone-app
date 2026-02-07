import { Router } from "express";
import * as errorLogController from "../../controllers/v1/errorLogController";
import * as authController from "../../controllers/v1/authController";

const router = Router();

router.use(authController.protect);

router.route("/").get(errorLogController.getAllErrorLogs).post(errorLogController.createErrorLog);

router.route("/:id").get(errorLogController.getErrorLog).patch(errorLogController.updateErrorLog);

router.get("/device/:device", errorLogController.getErrorLogsByDevice);

export default router;
