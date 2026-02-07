import { NextFunction, Request, RequestHandler, Response } from "express";
import { Device, ErrorLog } from "@models";
import { AppError, catchAsync } from "@utils";
import * as factory from "./handlerFactory";

const Model = ErrorLog;
const key = "errorLog";

export const setCreateData: RequestHandler = (req, _, next) => {
  req.body.updates = undefined;
  req.body.final = false;
  req.body.checkInInfo = undefined;
  req.body.status = "Broken";
  if (req.params.device) req.body.device = req.params.device;
  next();
};

export const getAllDeviceErrorLogs = factory.getAll(Model, `${key}s`);

export const getDeviceErrorLog = factory.getOne(Model, key);

export const createErrorLog = catchAsync(async (req, res) => {
  const errorLog = new Model(req.body);
  errorLog.$locals.notCheckOut = true;
  await errorLog.save();
  res.status(201).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      errorLog,
    },
  });
});

export const updateErrorLog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const errorLog = await ErrorLog.findOne(req.params);

    if (!errorLog) return next(new AppError("No error log found with that ID", 404));
    if (errorLog.final) return next(new AppError("This error has been finalized", 400));

    const { status, description } = req.body;
    errorLog.updates.push({
      description,
      status,
      createdAt: new Date(req.requestTime),
    });
    errorLog.status = req.body.status;
    let saved = false;
    // If error will be finalized
    if (status === "Fixed" || status === "Unfixable") {
      errorLog.final = true;
      const device = await Device.findById(errorLog.device);
      if (device) {
        const unfinishedErrorsByDevice = await ErrorLog.find({
          device: device._id,
          final: false,
        });
        if (unfinishedErrorsByDevice.length === 1) {
          status === "Fixed" ? (device.status = "Available") : (device.status = "Not Available");
          await errorLog.save({ validateBeforeSave: true });
          saved = true;
          await device.save({ validateBeforeSave: true });
        }
      }
    }

    saved === false && (await errorLog.save({ validateBeforeSave: true }));

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        errorLog,
      },
    });
  }
);
