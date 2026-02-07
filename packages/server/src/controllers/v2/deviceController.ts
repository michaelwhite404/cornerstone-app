import capitalize from "capitalize";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { Types } from "mongoose";
import { CheckoutLog, Device, ErrorLog, Student } from "@models";
import { admin, AppError, catchAsync } from "@utils";
import { ErrorLogModel } from "@@types/models";
import * as factory from "./handlerFactory";
import { deviceEvent } from "@events";

const Model = Device;
const key = "device";
const pop = { path: "lastUser teacherCheckOut", select: "fullName grade email" };

/** `GET` - Gets all devices
 *  - All authorized users can access this route
 */
export const getAllDevices: RequestHandler = factory.getAll(Model, `${key}s`, {}, pop);
/** `GET` - Gets a single device
 *  - All authorized users can access this route
 */
export const getOneDevice: RequestHandler = factory.getOneById(Model, key, pop);
/** `POST` - Creates a new device
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
export const createDevice: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const device = await Device.create({
    name: req.body.name,
    brand: req.body.brand,
    model: req.body.model,
    serialNumber: req.body.serialNumber,
    macAddress: req.body.macAddress,
    directoryId: req.body.directoryId,
    deviceType: req.body.deviceType,
  });

  res.status(201).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      device,
    },
  });
});
/** `PATCH` - Updates a device
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
export const updateDevice: RequestHandler = factory.updateOne(Model, key);

/** `DELETE` - Deletes a device
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
export const deleteDevice: RequestHandler = factory.deleteOne(Model, "Device");

export const checkOutDevice: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const [device, student] = await Promise.all([
      Device.findById(req.params.id),
      Student.findById(req.params.student_id),
    ]);
    // If no device
    if (!device) return next(new AppError("No device found with that ID", 404));
    // If not Available or Assigned
    if (!["Assigned", "Available"].includes(device.status))
      return next(new AppError(`This device is ${device.status.toLowerCase()}`, 400));
    // No student
    if (!student) return next(new AppError("No student found with that ID", 404));

    // Device can be checked out
    device.checkedOut = true;
    device.status = "Checked Out";
    device.lastCheckOut = new Date(req.requestTime);
    device.lastUser = new Types.ObjectId(req.params.student_id);
    device.teacherCheckOut = new Types.ObjectId(req.employee!._id);
    device.dueDate = req.body.dueDate;

    // Save device
    await device.save({ validateBeforeSave: true });
    // Create checkout log
    await CheckoutLog.create({
      device: device._id,
      checkOutDate: req.requestTime,
      deviceUser: device.lastUser,
      teacherCheckOut: req.employee._id,
      checkedIn: false,
      dueDate: device.dueDate,
    });

    await Device.populate(device, pop);

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        device,
      },
    });
  }
);

export const checkInDevice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const device = await Device.findById(req.params.id).populate("lastUser");
  // If no Device
  if (!device) {
    return next(new AppError("No device found with that ID", 404));
  }

  // If Not Checked Out
  if (device.status !== "Checked Out") {
    return next(new AppError(`This device is ${device.status.toLowerCase()}`, 400));
  }

  device.checkedOut = false;
  device.lastCheckIn = new Date(req.requestTime);
  device.teacherCheckOut = undefined;
  device.dueDate = undefined;

  const log = await CheckoutLog.findOne({
    device: device._id,
    checkedIn: false,
  });
  let errorData: ErrorLogModel | undefined;
  // If error
  if (log) {
    log.checkInDate = new Date(req.requestTime);
    log.teacherCheckIn = req.employee!._id;
    log.checkedIn = true;

    if (req.body.error === true || req.body.error === "true") {
      const { title, description } = req.body;
      errorData = {
        title,
        description,
        device: device._id,
        checkInInfo: log._id,
        createdAt: req.body.checkInDate,
      } as ErrorLogModel;
      const errorLog = await ErrorLog.create(errorData);
      log.error = errorLog._id;
      device.status = "Broken";
    } else {
      if (req.body.assign === true || req.body.assign === "true") device.status = "Assigned";
      else device.status = "Available";
    }

    await device.save({ validateBeforeSave: false });
    await log.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      device,
    },
  });
  deviceEvent.checkIn(device, req.employee, errorData);
});

export const getAllDeviceTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await Device.aggregate([{ $group: { _id: "$deviceType" } }]);
  const types = result.map((r) => r._id);

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    types,
  });
});

export const getDevicesFromGoogle = catchAsync(async (_, res) => {
  const result = await admin.chromeosdevices.list({
    customerId: process.env.GOOGLE_CUSTOMER_ID,
    projection: "BASIC",
  });

  const devices = result.data.chromeosdevices;
  res.status(200).json({
    devices,
  });
});

export const getOneDeviceFromGoogle = catchAsync(async (req, res, next) => {
  try {
    const { data: device } = await admin.chromeosdevices.get({
      customerId: process.env.GOOGLE_CUSTOMER_ID,
      deviceId: req.params.id,
    });

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        device,
      },
    });
  } catch (err) {
    return next(new AppError((err as any).response.data.error.message, 500));
  }
});

export const resetDeviceFromGoogle = catchAsync(async (req, res) => {
  let command = "";
  switch (req.params.reset) {
    case "wipe":
      command = "WIPE_USERS";
      break;
    case "powerwash":
      command = "REMOTE_POWERWASH";
      break;
  }

  await admin.customer.devices.chromeos.issueCommand({
    customerId: process.env.GOOGLE_CUSTOMER_ID,
    deviceId: req.params.id,
    requestBody: {
      commandType: command,
    },
  });

  res.status(200).json({
    success: "success",
    requestedAt: req.requestTime,
    data: {
      message: "Device has been reset",
    },
  });
});

export const moveDeviceToOu = catchAsync(async (req, res) => {
  await admin.chromeosdevices.moveDevicesToOu({
    customerId: process.env.GOOGLE_CUSTOMER_ID,
    orgUnitPath: req.body.orgUnitPath,
    requestBody: {
      deviceIds: [req.params.id],
    },
  });

  res.status(200).json({
    success: "success",
    requestedAt: req.requestTime,
    data: {
      message: `Device has been moved to ${req.body.orgUnitPath}`,
    },
  });
});

export const deviceAction = catchAsync(async (req, res) => {
  await admin.chromeosdevices.action({
    customerId: process.env.GOOGLE_CUSTOMER_ID,
    resourceId: req.params.id,
    requestBody: {
      action: req.params.action,
    },
  });

  res.status(200).json({
    success: "success",
    requestedAt: req.requestTime,
    data: {
      message: `${capitalize(req.params.action)} action completed suceessfully`,
    },
  });
});

// /:device/assign
export const assignDevice = catchAsync(async (req, res, next) => {
  const device = await Model.findById(req.params.id);
  if (!device) return next(new AppError("No device found with that ID", 404));
  if (device.status === "Assigned")
    return next(new AppError("This device has already been assigned", 400));
  if (device.status !== "Available")
    return next(new AppError("This device cannot be assigned", 400));
  device.status = "Assigned";
  device.lastUser = req.body.student;
  device.$locals.assigned = true;
  device.$locals.student = req.body.student;
  await device.save();
  Device.populate(device, { path: "lastUser" }, function (_, device) {
    sendJson(res, 200, { device });
  });
});

export const unassignDevice = catchAsync(async (req, res, next) => {
  const device = await Model.findById(req.params.id);
  if (!device) return next(new AppError("No device found with that ID", 404));
  if (device.status !== "Assigned")
    return next(new AppError("This device is not assigned to a student", 400));
  device.status = "Available";
  await device.save();
  sendJson(res, 200, { device });
});

const sendJson = (response: Response, statusCode: number, dataObject: any) => {
  response.status(statusCode).json({
    status: "success",
    requestedAt: new Date(),
    data: dataObject,
  });
};

// const policy = google.chromepolicy({
//   version: "v1",
//   auth: googleAuthJWT(scopes, process.env.GOOGLE_ADMIN_EMAIL),
// });

// policy.customers.policies.orgunits.batchModify({
//   customer: "",
//   requestBody: {
//     requests: [
//       {
//         policyTargetKey: {
//           targetResource: "orgunits/03ph8a2z39jpy3t",
//         },
//         policyValue: {
//           policySchema: "chrome.users.URLBlocking",
//         },
//       },
//     ],
//   },
// });
