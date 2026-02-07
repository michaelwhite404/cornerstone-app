import { departmentSettingsController } from "@controllers/v2";
import { Router } from "express";

const settingsRouter = Router();

settingsRouter
  .route("/")
  .get(departmentSettingsController.getAllAvailableSettings)
  .post(departmentSettingsController.createAvailableSetting);

settingsRouter.route("/allowed").post(departmentSettingsController.createAllowedSettingValue);

settingsRouter.route("/:id").get(departmentSettingsController.getAvailableSetting);

export default settingsRouter;
