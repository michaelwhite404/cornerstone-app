"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Router } = require("express");
const logController = require("../controllers/logController");
const authController = require("../controllers/authController");
const router = Router();
router.use(authController.protect);
router.get("/", logController.getAllLogs);
router.get("/:id", logController.getLog);
router.get("/device/:device", logController.getLogsByDevice);
exports.default = router;