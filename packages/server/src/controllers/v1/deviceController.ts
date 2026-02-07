import moment from "moment";
import { Response, NextFunction } from "express";
import Device from "../../models/deviceModel";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/v1/catchAsync";
import * as factory from "./handlerFactory";
import CheckoutLog from "../../models/checkoutLogModel";
import ErrorLog from "../../models/errorLogModel";
import CustomRequest from "../../types/customRequest";

export const getAllDevices = factory.getAll(Device);
export const getDevice = factory.getOne(Device);
export const createDevice = factory.createOne(Device);
export const updateDevice = factory.updateOne(Device);
export const deleteDevice = factory.deleteOne(Device);

export const checkOutDevice = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const device = await Device.findById(req.params.id);
    const now = moment().toDate();
    // If no Device
    if (!device) {
      return next(new AppError(`No ${req.device} found with that ID`, 404));
    }

    // If Not Available
    if (device.status !== "Available") {
      return next(new AppError(`This ${req.device} is ${device.status.toLowerCase()}`, 400));
    }
    let checkOutDate;
    device.checkedOut = true;
    req.body.lastCheckOut
      ? (device.lastCheckOut = req.body.lastCheckOut)
      : (device.lastCheckOut = now);
    device.lastUser = req.body.lastUser;
    device.teacherCheckOut = req.employee!._id;
    device.status = "Checked Out";

    // If Check Out Date is set
    if (req.body.lastCheckOut) {
      // Check If Check Out Date is in the future
      if (moment(req.body.lastCheckOut).diff(now) > 0)
        return next(new AppError("Check out date cannot be in the future", 400));
      checkOutDate = req.body.lastCheckOut;
      device.lastCheckOut = req.body.lastCheckOut;
    }
    // Else Check Out Date is Now
    else {
      checkOutDate = now;
      device.lastCheckOut = now;
    }

    // If Due Date Is Set
    if (req.body.dueDate) {
      // Check If Due Date is in the past
      if (moment(req.body.dueDate).diff(now) < 0) {
        return next(new AppError("Due date cannot be in the past", 400));
      }
      device.dueDate = req.body.dueDate;
    }

    await device.save({ validateBeforeSave: false });

    await CheckoutLog.create({
      device: device._id,
      checkOutDate,
      deviceUser: req.body.lastUser,
      teacherCheckOut: req.employee!._id,
      checkedIn: false,
      dueDate: req.body.dueDate,
    });

    res.status(200).json({
      status: "success",
      data: {
        [req.device!]: device,
      },
    });
  }
);

export const checkInDevice = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const device = await Device.findById(req.params.id);
    // If no Device
    if (!device) {
      return next(new AppError(`No ${req.device} found with that ID`, 404));
    }

    // If Not Checked Out
    if (device.status !== "Checked Out") {
      return next(new AppError(`This ${req.device} is ${device.status.toLowerCase()}`, 400));
    }

    if (req.body.checkInDate) {
      if (moment(req.body.checkInDate).diff(moment(device.lastCheckOut)) <= 0)
        return next(
          new AppError(`A ${req.device} cannot be checked in before it was checked out`, 400)
        );
      // Check If Check Out Date is in the future
      if (moment(req.body.checkInDate).diff(moment()) > 0)
        return next(new AppError("Check in date cannot be in the future", 400));
    }

    device.checkedOut = false;
    device.lastCheckIn = req.body.checkInDate ? req.body.checkInDate : Date.now();
    device.teacherCheckOut = undefined;
    device.dueDate = undefined;

    const log = await CheckoutLog.findOne({
      device: device._id,
      checkedIn: false,
    });
    if (log) {
      log.checkInDate = req.body.checkInDate ? req.body.checkInDate : Date.now();
      (log.teacherCheckIn = req.employee!._id), (log.checkedIn = true);

      if (req.body.error === true) {
        const { title, description } = req.body;
        const errorData = {
          title,
          description,
          device: device._id,
          checkInInfo: log._id,
          createdAt: req.body.checkInDate,
        };
        const errorLog = await ErrorLog.create(errorData);
        log.error = errorLog._id;
        device.status = "Broken";
      } else {
        device.status = "Available";
      }

      await device.save({ validateBeforeSave: false });
      await log.save({ validateBeforeSave: false });
    }
    res.status(200).json({
      status: "success",
      data: {
        [req.device!]: device,
      },
    });
  }
);

export const testStatusGroup = catchAsync(async (req: CustomRequest, res: Response) => {
  const deviceType = req.device;
  const brands = await Device.aggregate([
    {
      $match: { deviceType },
    },
    {
      $group: {
        _id: {
          brand: "$brand",
          status: "$status",
          model: "$model",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          brand: "$_id.brand",
          model: "$_id.model",
        },
        statuses: {
          $push: {
            status: "$_id.status",
            count: "$count",
          },
        },
        count: { $sum: "$count" },
      },
    },
    {
      $group: {
        _id: "$_id.brand",
        models: {
          $push: {
            model: "$_id.model",
            count: "$count",
            statuses: "$statuses",
          },
        },
        count: { $sum: "$count" },
      },
    },
    {
      $project: {
        brand: "$_id",
        count: 1,
        models: 1,
        _id: 0,
      },
    },
    {
      $sort: { brand: 1 },
    },
  ]);

  const statuses = await Device.aggregate([
    {
      $match: { deviceType },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        status: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ]);

  const totals = <{ count: number; statuses: any[] }>{};
  const totalCount = await Device.countDocuments({ deviceType });
  totals.count = totalCount;
  totals.statuses = statuses;

  res.status(200).json({
    status: "success",
    requestedAt: Date(),
    data: {
      brands,
      totals,
    },
  });
});
