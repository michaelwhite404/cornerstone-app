import { departmentSettingsController } from "@controllers/v2";
import { Router } from "express";

const settingsRouter = Router({ mergeParams: true });

settingsRouter
  .route("/")
  .get(departmentSettingsController.getAllDepartmentSettings)
  .post(
    departmentSettingsController.addDepartmentToBody,
    departmentSettingsController.createDepartmentSetting
  );

export default settingsRouter;
