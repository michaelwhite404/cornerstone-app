import { Document } from "mongoose";
import { DepartmentMember } from "@models";
import { AppError, catchAsync, isObject, isObjectID } from "@utils";

export const getAllDepartmentMembers = catchAsync(async (req, res) => {
  const members = await DepartmentMember.find({ department: req.params.departmentId }).sort(
    "fullName"
  );
  res.sendJson(200, { members: members.map(makeMember) });
});

export const createDepartmentMembers = catchAsync(async (req, res, next) => {
  if (!req.body.users || !Array.isArray(req.body.users)) {
    return next(new AppError("The request body must have an array for the property `users`.", 400));
  }
  const validObjects = (req.body.users as any[]).filter(
    (user) =>
      isObject(user) &&
      typeof user.id === "string" &&
      isObjectID(user.id) &&
      typeof user.role == "string"
  );

  const requests = validObjects.map((obj) =>
    DepartmentMember.create({
      member: obj.id,
      department: req.params.departmentId,
      role: obj.role,
    })
  );

  const responses = await Promise.allSettled(requests);

  const fulfilled = responses.filter(
    (response) => response.status === "fulfilled"
  ) as PromiseFulfilledResult<Document>[];
  const dms = fulfilled.map((r) => r.value);
  const members = await DepartmentMember.populate(dms, { path: "member" });

  res.sendJson(200, { members: members.map(makeMember) });
});

export const getDepartmentMember = catchAsync(async (req, res, next) => {
  const member = await DepartmentMember.findOne({
    department: req.params.departmentId,
    member: req.params.id,
  }).populate({
    path: "member",
    select: "fullName email",
  });
  if (!member) return next(new AppError("No member found", 404));

  res.sendJson(200, { member: makeMember(member) });
});

export const removeDepartmentMember = catchAsync(async (req, res, next) => {
  const member = await DepartmentMember.findOneAndDelete({
    department: req.params.departmentId,
    member: req.params.id,
  });
  if (!member) return next(new AppError("No member found", 404));
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    message: "1 member removed from the department",
  });
});

export const updateDepartmentMember = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  if (!role)
    return next(new AppError("Only the role property can be updated with this route", 400));
  const member = await DepartmentMember.findOneAndUpdate(
    { department: req.params.departmentId, member: req.params.id },
    { role },
    { new: true, runValidators: true }
  ).populate({ path: "member", select: "fullName email" });
  if (!member) return next(new AppError("No member found", 404));
  res.sendJson(200, { member: makeMember(member) });
});

const makeMember = (info: any) => ({
  _id: info.member._id,
  fullName: info.member.fullName,
  email: info.member.email,
  role: info.role,
});
