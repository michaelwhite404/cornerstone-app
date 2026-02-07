import { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import Employee from "../../models/employeeModel";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";

export const getAllEmployees = catchAsync(async (_: Request, res: Response) => {
  const employees = await Employee.find();

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: Date(),
    results: employees.length,
    data: {
      employees,
    },
  });
});

export const getEmployee = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: Date(),
    data: {
      employee,
    },
  });
});
// TODO: Finish Method
export const updateMe = catchAsync(async (req: Request, _: Response, next: NextFunction) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("This route is not for password updates. Please use /update-password.", 400)
    );
  }
});

export const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!employee) {
    return next(new AppError("No user found with that ID", 404));
  }

  employee.fullName = `${employee.firstName} ${employee.lastName}`;
  employee.slug = slugify(`${employee.fullName}`, { lower: true });
  await employee.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    requestedAt: Date(),
    data: {
      employee,
    },
  });
});
