import { Router } from "express";
import * as logController from "../../controllers/v1/logController";
import * as authController from "../../controllers/v1/authController";

const router = Router();

router.use(authController.protect);

router.get("/", logController.getAllLogs);
router.get("/:id", logController.getLog);
router.get("/device/:device", logController.getLogsByDevice);

export default router;
