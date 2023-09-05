import { Router } from "express";
import { authController, schoolYearController } from "@controllers/v2";
const { protect } = authController;

const router = Router();

router.use(protect);

router
  .route("/")
  .get(schoolYearController.getAllSchoolYears)
  .post(schoolYearController.createSchoolYear);

router.route("/:id").get(schoolYearController.getSchoolYear);

export default router;
