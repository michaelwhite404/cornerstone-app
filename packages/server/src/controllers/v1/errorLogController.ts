import moment from "moment";
import { Request, Response, NextFunction } from "express";
import ErrorLog from "../../models/errorLogModel";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/v1/catchAsync";
import * as factory from "./handlerFactory";
import Device from "../../models/deviceModel";
import CustomRequest from "../../types/customRequest";
import { ErrorUpdate } from "../../types/models/errorLogTypes";

export const getAllErrorLogs = factory.getAll(ErrorLog);
export const getErrorLog = factory.getOne(ErrorLog);
export const getErrorLogsByDevice = factory.getAll(ErrorLog);

export const createErrorLog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const now = moment();
    req.body.updates = undefined;
    req.body.final = false;
    req.body.checkInInfo = undefined;
    req.body.status = "Broken";

    const device = await Device.findById(req.body.device);
    if (!device) {
      return next(new AppError("No device found with that ID", 404));
    }
    if (device.status === "Checked Out") {
      return next(new AppError(`Create an error when checking in ${device.deviceType}`, 400));
    }
    // If createdAt field is set
    if (req.body.createdAt)
      if (moment(req.body.createdAt).diff(now) > 0)
        // Check If createdAt is in the future
        return next(new AppError("Date cannot be in the future", 400));

    device.status = "Broken";
    const errorLog = await ErrorLog.create(req.body);
    await device.save({ validateBeforeSave: false });

    res.status(201).json({
      status: "success",
      requestedAt: Date(),
      data: {
        errorLog,
      },
    });
  }
);

export const updateErrorLog = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errorLog = await ErrorLog.findById(req.params.id);

    if (!errorLog) {
      return next(new AppError(`No ${req.device} found with that ID`, 404));
    }
    if (errorLog.final) {
      return next(new AppError("This error has been finalized", 400));
    }

    const { description, status } = req.body;
    const update = { description, status };

    errorLog.updates.push(update as ErrorUpdate);
    errorLog.status = status;

    if (status == "Fixed" || status == "Unfixable") {
      errorLog.final = true;
      const device = await Device.findById(errorLog.device);
      if (device) {
        const unfinishedErrorsByDevice = await ErrorLog.find({
          device: device._id,
          final: false,
        });
        if (unfinishedErrorsByDevice.length === 1) {
          status == "Fixed" ? (device.status = "Available") : (device.status = "Not Available");
          await device.save({ validateBeforeSave: true });
        }
      }
    }

    await errorLog.save({ validateBeforeSave: true });

    res.status(200).json({
      status: "success",
      requestedAt: Date(),
      data: {
        errorLog,
      },
    });
  }
);
