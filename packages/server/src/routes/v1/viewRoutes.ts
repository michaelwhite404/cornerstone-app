import { Router } from "express";

import * as viewsController from "../../controllers/v1/viewsController";
import { isLoggedIn, protect } from "../../controllers/v1/authController";
import CustomRequest from "../../types/customRequest";

const router = Router();

router.use(isLoggedIn);

// Home Page (Login) - "/"
router.get("/", viewsController.getHomePage);

// Reset Password
router.get("/reset-password/:token");

router.use(protect);

// Dashboard - "/dashboard"  (1/2 DONE!!)
router.get("/dashboard", viewsController.getDashboardPage);

// All Chromebooks - "/chromebooks" (DONE!!)
router.get(
  "/chromebooks",
  (req, _, next) => {
    (req as CustomRequest).device = "chromebook";
    next();
  },
  viewsController.getAllDevicesPage
);

// Add Chromebook - "/chromebooks/add" (DONE!!)
router.get(
  "/chromebooks/add",
  (req, _, next) => {
    (req as CustomRequest).device = "chromebook";
    next();
  },
  viewsController.addDevicePage
);

// Chromebook Stats "/chromebooks/stats" (DONE!!)
router.get(
  "/chromebooks/stats",
  (req, _, next) => {
    (req as CustomRequest).device = "chromebook";
    next();
  },
  viewsController.getDeviceStatsPage
);

// Edit Chromebook - "/chromebooks/:slug/edit" (DONE!!)
router.get(
  "/chromebooks/:slug/edit",
  (req, _, next) => {
    (req as CustomRequest).device = "chromebook";
    next();
  },
  viewsController.editDevicePage
);

// One Chromebook "/chromebooks/:slug" (DONE!!)
router.get(
  "/chromebooks/:slug",
  (req, _, next) => {
    (req as CustomRequest).device = "chromebook";
    next();
  },
  viewsController.getDevicePage
);

// All Tablets - "/tablets" (DONE!!)
router.get(
  "/tablets",
  (req, _, next) => {
    (req as CustomRequest).device = "tablet";
    next();
  },
  viewsController.getAllDevicesPage
);

// Add Tablet - "/tablets/add" (DONE!!)
router.get(
  "/tablets/add",
  (req, _, next) => {
    (req as CustomRequest).device = "tablet";
    next();
  },
  viewsController.addDevicePage
);

// Tablet Stats "/tablets/stats" (DONE!!)
router.get(
  "/tablets/stats",
  (req, _, next) => {
    (req as CustomRequest).device = "tablet";
    next();
  },
  viewsController.getDeviceStatsPage
);

// Edit Tablet - "/tablets/:slug/edit" (DONE!!)
router.get(
  "/tablets/:slug/edit",
  (req, _, next) => {
    (req as CustomRequest).device = "tablet";
    next();
  },
  viewsController.editDevicePage
);

// One Tablet "/tablets/:slug" (DONE!!)
router.get(
  "/tablets/:slug",
  (req, _, next) => {
    (req as CustomRequest).device = "tablet";
    next();
  },
  viewsController.getDevicePage
);

// All Users (Page not created) - "/users"

// Create user - "/users/new" (DONE!!)
router.get("/users/new", viewsController.createUserPage);

// User (Page not created) - "/user/:slug"

// Edit user - "/users/:slug/edit" (DONE!!)
router.get("/users/:slug/edit", viewsController.editUserPage);

// All students (Page not created) - "/students"

// Student (Page not created) - "/students/:slug"

// Create student - "/students/new" (DONE!!)
router.get("/students/new", viewsController.createStudentPage);

// Edit student - "/students/:slug/edit" (DONE!!)
router.get("/students/:slug/edit", viewsController.editStudentPage);

// New Password
router.get("/new-password", viewsController.getNewPasswordPage);

// Test Route (DONE!!)
router.get("/test-group", viewsController.testGroup);

export default router;
