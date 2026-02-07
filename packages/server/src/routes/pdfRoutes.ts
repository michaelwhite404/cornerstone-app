import { Router } from "express";
import { createAveryLabel, getDeviceLogsPDF } from "../controllers/pdfController";
import { protect } from "../controllers/v2/authController";

const router = Router();

router.use(protect);
router.get("/device-logs", getDeviceLogsPDF);
router.get("/labels", createAveryLabel);

export default router;
