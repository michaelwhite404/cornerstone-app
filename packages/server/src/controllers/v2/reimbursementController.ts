import { Reimbursement } from "@models";
import { ReimbursementDocument } from "@@types/models";
import { APIFeatures, AppError, catchAsync, getUserLeaders, s3 } from "@utils";
import { FilterQuery, PopulateOptions } from "mongoose";
import { reimbursementEvent } from "@events";

const Model = Reimbursement;

const getFilter = (employee: Employee): FilterQuery<ReimbursementDocument> =>
  employee.isLeader("Finance") ? {} : { $or: [{ sendTo: employee._id }, { user: employee._id }] };

const populateOptions: Array<PopulateOptions> = [
  { path: "user sendTo", select: "fullName slug email" },
  { path: "approval", populate: { path: "user", select: "fullName email" } },
];

export const getAllReimbursements = catchAsync(async (req, res) => {
  const query = Model.find(getFilter(req.employee)).populate(populateOptions);
  const features = new APIFeatures(query, req.query).filter().limitFields().sort().paginate();
  const reimbursements = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: reimbursements.length,
    data: {
      reimbursements,
    },
  });
});

export const getReimbursement = catchAsync(async (req, res, next) => {
  const reimbursement = await Model.findOne({
    ...getFilter(req.employee),
    _id: req.params.id,
  }).populate(populateOptions);
  if (!reimbursement) return next(new AppError("There is no reimbursement with this ID", 404));
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      reimbursement,
    },
  });
});

export const checkCanApprove = catchAsync(async (req, res, next) => {
  const reimbursement = await Reimbursement.findById(req.params.id).populate({
    path: "user sendTo",
    select: "fullName slug email",
  });
  if (!reimbursement) return next(new AppError("There is no reimbursement with this id", 404));
  if (reimbursement.sendTo._id.toString() !== req.employee._id.toString()) {
    return next(new AppError("You are not authorized to approve this reimbursement", 403));
  }
  if (reimbursement.approval?.date)
    return next(new AppError("This reimbursement request has already been finalized", 400));
  res.locals.reimbursement = reimbursement;
  next();
});

export const approveReimbursement = catchAsync(async (req, res, next) => {
  // BODY: { approved: true } || { approved: false }
  const { approved } = req.body;
  if (approved === undefined || approved === null)
    return next(new AppError("Please set the property `approved` as a boolean value", 400));
  // If value not valid
  let value: boolean | undefined = undefined;
  new Set([true, "true", 1, "1", "yes"]).has(approved) && (value = true);
  new Set([false, "false", 0, "0", "no"]).has(approved) && (value = false);
  if (value === undefined)
    return next(new AppError("The property `approved` should be a boolean value", 400));
  // VALID
  const reimbursement = res.locals.reimbursement as ReimbursementDocument;

  reimbursement.approval = {
    user: req.employee._id,
    date: new Date(req.requestTime),
    approved,
  };
  await reimbursement.save();
  const jsonReimbursement = reimbursement.toJSON();
  jsonReimbursement.approval!.user = {
    _id: req.employee._id,
    fullName: req.employee.fullName,
    email: req.employee.email,
  };
  res.sendJson(200, { reimbursement: jsonReimbursement });
  reimbursementEvent.finalize(reimbursement);
});

export const createReimbursement = catchAsync(async (req, res, next) => {
  const { date, amount, address, purpose, payee, specialInstructions, dateNeeded, sendTo } =
    req.body;
  if (!(req.file?.fieldname === "receipt")) {
    return next(new AppError("Each reimbursement must have a receipt to upload", 400));
  }
  // Is user leader
  const leaders = await getUserLeaders(req.employee);
  if (!leaders.map((l) => l._id.toString() as string).includes(sendTo)) {
    return next(
      new AppError("Please send your leave request to a person who leads your department", 400)
    );
  }

  let reimbursement = await Model.create({
    user: req.employee._id,
    payee,
    date,
    amount,
    address,
    purpose,
    specialInstructions,
    dateNeeded,
    sendTo,
    createdAt: new Date(),
  });
  try {
    const fileKey = `receipts/${reimbursement._id}`;
    const { Key } = await s3.uploadFile(req.file, fileKey);
    reimbursement.receipt = `${req.protocol}://${req.headers.host}/images/${Key}`;
    await reimbursement.save();
    reimbursement = await Reimbursement.populate(reimbursement, {
      path: "user sendTo",
      select: "fullName slug email",
    });
  } catch (err) {
    await reimbursement.remove();
    throw err;
  }
  res.sendJson(201, { reimbursement });
  reimbursementEvent.submit(reimbursement);
});
