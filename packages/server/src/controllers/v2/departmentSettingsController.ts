import { DepartmentAllowedSetting, DepartmentAvailableSetting, DepartmentSetting } from "@models";
import { AppError, catchAsync } from "@utils";
import { RequestHandler } from "express";
import validator from "validator";
import * as factory from "./handlerFactory";

export const getAllAvailableSettings = catchAsync(async (_, res) => {
  const availableSettings = await DepartmentAvailableSetting.aggregate([
    {
      $lookup: {
        from: "departmentallowedsettingvalues",
        localField: "_id",
        foreignField: "setting",
        as: "allowedValues",
      },
    },
    {
      $set: {
        allowedValues: {
          $cond: {
            if: {
              $eq: ["$constrained", true],
            },
            then: "$allowedValues",
            else: "$$REMOVE",
          },
        },
      },
    },
  ]);
  res.sendJson(200, { availableSettings });
});

export const getAvailableSetting = factory.getOneById(
  DepartmentAvailableSetting,
  "availableSetting"
);
export const createAvailableSetting = factory.createOne(
  DepartmentAvailableSetting,
  "availableSetting"
);

// =---------------------

export const getAllDepartmentSettings = catchAsync(async (req, res) => {
  const settings = await DepartmentSetting.getDepartmentSettings(req.params.departmentId);
  res.sendJson(200, { settings });
});

export const addDepartmentToBody: RequestHandler = (req, _, next) => {
  req.body.department = req.params.departmentId;
  next();
};

export const createDepartmentSetting = catchAsync(async (req, res, next) => {
  const { department, setting, allowedSettingValue, unconstrainedValue } = req.body;
  const availableSetting = await DepartmentAvailableSetting.findById(setting);
  if (!availableSetting) return next(new AppError("There is no setting with this id ", 400));
  const { dataType, constrained } = availableSetting;
  let departmentSetting;
  if (!constrained) {
    switch (dataType) {
      case "BOOLEAN":
        if (typeof unconstrainedValue !== "boolean")
          return next(new AppError("Value must be a boolean value", 400));
        break;
      case "NUMBER":
        if (typeof unconstrainedValue !== "number")
          return next(new AppError("Value must be a number", 400));
        break;
      case "STRING":
        if (typeof unconstrainedValue !== "string")
          return next(new AppError("Value must be a string", 400));
      case "COLOR":
        if (!validator.isHexColor(unconstrainedValue || ""))
          return next(new AppError("Value must be a hex color", 400));
        break;
    }
    // GTG
    departmentSetting = await DepartmentSetting.create({
      department,
      setting,
      unconstrainedValue,
    });
  } else {
    const allowedSetting = await DepartmentAllowedSetting.findOne({
      _id: allowedSettingValue,
      setting,
    });
    if (!allowedSetting)
      return next(
        new AppError("There is no allowed setting value with this id for this setting", 400)
      );

    departmentSetting = await DepartmentSetting.create({
      department,
      setting,
      allowedSettingValue,
    });
  }

  res.sendJson(201, { setting: departmentSetting });
});

// ------------------------------

export const createAllowedSettingValue = catchAsync(async (req, res, next) => {
  const { setting, value, caption } = req.body;
  const availableSetting = await DepartmentAvailableSetting.findById(setting);
  if (!availableSetting)
    return next(new AppError("There is no available setting with this id", 400));
  if (!availableSetting.constrained)
    return next(
      new AppError(
        "Allowed setting value can only be attached to available settings with constrained values",
        400
      )
    );
  switch (availableSetting.dataType) {
    case "BOOLEAN":
      if (typeof value !== "boolean")
        return next(new AppError("Value must be a boolean value", 400));
      break;
    case "NUMBER":
      if (typeof value !== "number") return next(new AppError("Value must be a number", 400));
      break;
    case "STRING":
      if (typeof value !== "string") return next(new AppError("Value must be a string", 400));
    case "COLOR":
      if (!validator.isHexColor(value || ""))
        return next(new AppError("Value must be a hex color", 400));
      break;
  }
  const allowedSetting = await DepartmentAllowedSetting.create({ setting, value, caption });
  res.sendJson(201, { allowedSetting });
});
