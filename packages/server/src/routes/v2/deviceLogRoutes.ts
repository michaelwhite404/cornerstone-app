import { Router } from "express";
import { helpers, deviceLogController } from "@controllers/v2";

const router = Router({ mergeParams: true });

router.get("/", helpers.addKeyToQuery("device"), deviceLogController.getAllLogs);
router.get("/:_id", deviceLogController.getOneLog);

export default router;
