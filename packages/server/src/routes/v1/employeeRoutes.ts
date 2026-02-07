import { Router } from "express";
import * as employeeController from "../../controllers/v1/employeeController";
import * as authController from "../../controllers/v1/authController";

const router = Router();

// router.post("/signup", authController.protect, authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);
router.post("/create", authController.protect, authController.createEmployee);

router.patch("/update-password", authController.protect, authController.updatePassword);

router.patch("/update-me", authController.protect, employeeController.updateMe);

router.route("/").get(employeeController.getAllEmployees);

router.route("/:id").get(employeeController.getEmployee).patch(employeeController.updateUser);
//   .delete(employeeController.deleteUser);

export default router;
