import { Router } from "express";
import { authController, orgUnitController } from "@controllers/v2";

const { protect, restrictTo } = authController;
const { getAllOrgUnits } = orgUnitController;

const router = Router();

router.use(protect);

router.get("/", restrictTo("Super Admin"), getAllOrgUnits);

export default router;
