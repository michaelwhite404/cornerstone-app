"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTimesheetEntry = exports.updateTimesheetEntry = exports.createTimeSheetEntry = exports.getOneTimeSheetEntry = exports.getAllTimeSheetEntries = void 0;
const timesheetEntryModel_1 = __importDefault(require("../../models/timesheetEntryModel"));
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const factory = __importStar(require("./handlerFactory"));
const Model = timesheetEntryModel_1.default;
const key = "timesheetEntry";
/** `GET` - Gets all timesheet entries
 *  - TODO: Who can access this controller??
 */
exports.getAllTimeSheetEntries = factory.getAll(Model, key);
/** `GET` - Gets a timesheet entry
 *  - TODO: Who can access this controller??
 */
exports.getOneTimeSheetEntry = factory.getOneById(Model, key);
/** `POST` - Creates a new timesheet entry
 *  - Only users with timesheet enabled can use this
 */
exports.createTimeSheetEntry = catchAsync_1.default(async (req, res, next) => {
    if (!req.employee.timesheetEnabled)
        return next(new appError_1.default("You are not authorized to create timesheet entries", 403));
    const timesheetEntry = await Model.create({
        employeeId: req.employee._id,
        timeStart: req.body.timeStart,
        timeEnd: req.body.timeEnd,
        description: req.body.description,
    });
    res.status(201).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
            timesheetEntry,
        },
    });
});
exports.updateTimesheetEntry = catchAsync_1.default(async (req, res, next) => {
    const timesheetEntry = await timesheetEntryModel_1.default.findById(req.params.id);
    if (!timesheetEntry)
        return next(new appError_1.default("No timesheet entry found with that ID", 404));
    if (timesheetEntry.approved)
        return next(new appError_1.default("Approved timesheet entries cannot be updated", 403));
    req.body.timeStart ? (timesheetEntry.timeStart = req.body.timeStart) : "";
    req.body.timeEnd ? (timesheetEntry.timeEnd = req.body.timeEnd) : "";
    req.body.description ? (timesheetEntry.description = req.body.description) : "";
    await timesheetEntry.save({ validateBeforeSave: true });
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
            timesheetEntry: timesheetEntry,
        },
    });
});
exports.deleteTimesheetEntry = catchAsync_1.default(async (req, res, next) => {
    const timesheetEntry = await timesheetEntryModel_1.default.findById(req.params.id);
    if (!timesheetEntry)
        return next(new appError_1.default("No timesheet entry found with that ID", 404));
    if (timesheetEntry.approved)
        return next(new appError_1.default("Approved timesheet entries cannot be deleted", 403));
    await timesheetEntry.remove();
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        message: "1 timesheet entry has been deleted",
    });
});
