const express = require("express");

const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.isLoggedIn);

// Home Page (Login) - "/"
router.get("/", viewsController.getHomePage);

// Dashboard - "/dashboard"  (1/2 DONE!!)
router.get(
  "/dashboard",
  authController.protect,
  viewsController.getDashboardPage
);

// All Chromebooks - "/chromebooks" (DONE!!)
router.get(
  "/chromebooks",
  (req, res, next) => { req.device = "chromebook"; next(); },
  authController.protect,
  viewsController.getAllDevicesPage
);

// Add Chromebook - "/chromebooks/add" (DONE!!)
router.get(
  "/chromebooks/add",
  (req, res, next) => { req.device = "chromebook"; next(); },
  authController.protect,
  viewsController.addDevicePage
);

// Edit Chromebook - "/chromebooks/:slug/edit" (DONE!!)
router.get(
  "/chromebooks/:slug/edit",
  (req, res, next) => { req.device = "chromebook"; next(); },
  authController.protect,
  viewsController.editDevicePage
);

// One Chromebook "/chromebooks/:slug" (DONE!!)
router.get(
  "/chromebooks/:slug",
  (req, res, next) => { req.device = "chromebook"; next(); },
  authController.protect,
  viewsController.getDevicePage
);

// All Tablets - "/tablets" (DONE!!)
router.get(
  "/tablets",
  (req, res, next) => { req.device = "tablet"; next(); },
  authController.protect,
  viewsController.getAllDevicesPage
);

// Add Tablet - "/tablets/add" (DONE!!)
router.get(
  "/tablets/add",
  (req, res, next) => { req.device = "tablet"; next(); },
  authController.protect,
  viewsController.addDevicePage
);

// Edit Tablet - "/tablets/:slug/edit" (DONE!!)
router.get(
  "/tablets/:slug/edit",
  (req, res, next) => { req.device = "tablet"; next(); },
  authController.protect,
  viewsController.editDevicePage
);

// One Tablet "/tablets/:slug" (DONE!!)
router.get(
  "/tablets/:slug",
  (req, res, next) => { req.device = "tablet"; next(); },
  authController.protect,
  viewsController.getDevicePage
);

// All Users (Page not created) - "/users"

// Create user - "/users/new" (DONE!!)
router.get(
  "/users/new",
  authController.protect,
  viewsController.createUserPage
);

// User (Page not created) - "/user/:slug"

// Edit user - "/users/:slug/edit" (DONE!!)
router.get(
  "/users/:slug/edit",
  authController.protect,
  viewsController.editUserPage
);

// All students (Page not created) - "/students"

// Student (Page not created) - "/students/:slug"

// Create student - "/students/new" (DONE!!)
router.get(
  "/students/new",
  authController.protect,
  viewsController.createStudentPage
);

// Edit student - "/students/:slug/edit" (DONE!!)
router.get(
  "/students/:slug/edit",
  authController.protect,
  viewsController.editStudentPage
);

// New Password
router.get(
  "/new-password",
  authController.protect,
  viewsController.getNewPasswordPage
);

// Reset Password
router.get("/reset-password/:token");

// Test Route (DONE!!)
router.get("/test-group", viewsController.testGroup);

module.exports = router;
