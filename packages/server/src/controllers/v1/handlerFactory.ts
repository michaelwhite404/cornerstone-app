import catchAsync from "../../utils/v1/catchAsync";
import AppError from "../../utils/appError";
import APIFeatures from "../../utils/apiFeatures";
import pluralize from "pluralize";
import slugify from "slugify";
import { NextFunction, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { Mongoose } from "mongoose";
import CustomRequest from "../../types/customRequest";

const preCheck = (req: CustomRequest) => {
  // Init
  let key = "doc";
  let filter = {} as ParamsDictionary;

  if (req.params) {
    filter = { ...req.params };
    if (filter.id) {
      filter._id = filter.id;
      delete filter.id;
    }
  }

  if (req.device) {
    filter.deviceType = req.device;
    key = req.device;
  }
  if (req.key) key = req.key;

  let info = {
    filter,
    key,
  };

  return info;
};

export const deleteOne = (Model: Mongoose["Model"]) =>
  catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { filter, key } = preCheck(req);

    const doc = await Model.findOneAndDelete(filter);

    if (!doc) {
      return next(new AppError(`No ${key} found with that ID`, 404));
    }

    res.status(204).json({
      status: "success",
      requestedAt: Date(),
      data: null,
    });
  });

export const updateOne = (Model: Mongoose["Model"]) =>
  catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { filter, key } = preCheck(req);
    if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true });
    const doc = await Model.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`No ${key} found with that ID`, 404));
    }

    res.status(200).json({
      status: "success",
      requestedAt: Date(),
      data: {
        [key]: doc,
      },
    });
  });

export const createOne = (Model: Mongoose["Model"]) =>
  catchAsync(async (req: CustomRequest, res: Response) => {
    if (req.device) req.body.deviceType = req.device;
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      requestedAt: Date(),
      data: {
        [`${req.device || "doc"}`]: newDoc,
      },
    });
  });

export const getOne = (Model: Mongoose["Model"], popOptions?: { path: any; select?: any }) =>
  catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { filter, key } = preCheck(req);

    let query = Model.findOne(filter);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(`No ${key || "document"} found with that ID`, 404));
    }

    res.status(200).json({
      status: "success",
      requestedAt: Date(),
      data: {
        [key]: doc,
      },
    });
  });

export const getAll = (Model: Mongoose["Model"]) =>
  catchAsync(async (req: CustomRequest, res: Response) => {
    const { filter, key } = preCheck(req);

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    const docs = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      requestedAt: Date(),
      results: docs.length,
      data: {
        [pluralize(key)]: docs,
      },
    });
  });
