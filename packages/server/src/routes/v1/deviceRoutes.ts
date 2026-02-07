import { Router } from "express";
import * as deviceController from "../../controllers/v1/deviceController";
import * as authController from "../../controllers/v1/authController";

const router = Router();

router.use(authController.protect);

router.route("/").get(deviceController.getAllDevices).post(deviceController.createDevice);

router
  .route("/:id")
  .get(deviceController.getDevice)
  .patch(deviceController.updateDevice)
  .delete(deviceController.deleteDevice);

router.route("/:id/check-out").patch(deviceController.checkOutDevice);

router.route("/:id/check-in").patch(deviceController.checkInDevice);

router.get("/test/group", deviceController.testStatusGroup);

export default router;
