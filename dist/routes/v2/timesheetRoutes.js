"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../../controllers/v1/authController");
const timesheetController_1 = require("../../controllers/v2/timesheetController");
const router = express_1.Router();
router.use(authController_1.protect);
router.route("/").get(timesheetController_1.getAllTimeSheetEntries).post(timesheetController_1.createTimeSheetEntry);
router
    .route("/:id")
    .get(timesheetController_1.getOneTimeSheetEntry)
    .patch(timesheetController_1.updateTimesheetEntry)
    .delete(timesheetController_1.deleteTimesheetEntry);
exports.default = router;
