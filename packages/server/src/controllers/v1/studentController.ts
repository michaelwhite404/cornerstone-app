import { NextFunction, Request, Response } from "express";
import slugify from "slugify";
import Student from "../../models/studentModel";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";
import APIFeatures from "../../utils/apiFeatures";

export const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const features = new APIFeatures(Student.find(), req.query).filter().limitFields().paginate();

  const students = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: new Date().toISOString(),
    results: students.length,
    data: {
      students,
    },
  });
});

export const getStudent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new AppError("No student found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: Date(),
    data: {
      student,
    },
  });
});

export const createStudent = catchAsync(async (req: Request, res: Response) => {
  const newStudent = await Student.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      student: newStudent,
    },
  });
});

// Update Student (PATCH)
export const updateStudent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  req.body.fullName = `${req.body.firstName} ${req.body.lastName}`;
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!student) {
    return next(new AppError("No student found with that ID", 404));
  }

  student.fullName = `${student.firstName} ${student.lastName}`;
  student.slug = slugify(`${student.fullName}`, { lower: true });
  await student.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      student,
    },
  });
});

export const groupTest = catchAsync(async (_: Request, res: Response) => {
  const grades = await Student.aggregate([
    {
      $sort: { lastName: 1 },
    },
    {
      $group: {
        _id: "$grade",
        count: { $sum: 1 },
        students: { $push: { id: "$_id", fullName: "$fullName" } },
      },
    },
    {
      $project: {
        grade: "$_id",
        students: 1,
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { grade: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      grades,
    },
  });
});
