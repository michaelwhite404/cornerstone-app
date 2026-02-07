import { Router } from "express";
import * as v1auth from "@controllers/v1/authController";
import { authController as v2auth } from "@controllers/v2";
import { departmentController as dC } from "@controllers/v2";
import memberRouter from "./departmentMemberRoutes";
import availableSettingsRouter from "./departmentAvailableSettingsRoutes";
import departmentSettingsRouter from "./departmentSettingsRoutes";
const {
  createDepartment,
  getAllDepartments,
  getOneDepartment,
  getMyLeaders,
  getAllowTicketsDepartments,
} = dC;

const router = Router();

router.use(v2auth.protect);
router.get("/my-leaders", getMyLeaders);
router.get("/allow-tickets", getAllowTicketsDepartments);

router.use(v1auth.restrictTo("Super Admin", "Admin"));

router.use("/settings", availableSettingsRouter);
router.use("/:departmentId/settings", departmentSettingsRouter);
router.use("/:departmentId/members", memberRouter);

router.route("/").get(getAllDepartments).post(createDepartment);
router.route("/:id").get(getOneDepartment).patch().delete();

export default router;
