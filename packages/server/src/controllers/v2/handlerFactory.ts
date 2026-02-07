import { Mongoose } from "mongoose";
import { NextFunction, Request, Response } from "express";
import pluralize from "pluralize";
import { APIFeatures, AppError, camelCaseToText, catchAsync } from "@utils";
import { ExtractDocumentModel, PopOptions } from "@@types";

export const getAll = <T extends Mongoose["Model"]>(
  Model: T,
  key: string,
  filter: Partial<ExtractDocumentModel<T>> = {},
  populate?: PopOptions
) =>
  catchAsync(async (req: Request, res: Response) => {
    const query = Model.find(filter);
    if (populate) query.populate(populate);
    const features = new APIFeatures(query, req.query).filter().limitFields().sort().paginate();
    const docs = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: docs.length,
      data: {
        [pluralize(key)]: docs,
      },
    });
  });
export const getOneById = <T extends Mongoose["Model"]>(
  Model: T,
  key: string,
  popOptions?: PopOptions | PopOptions[]
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(`No ${camelCaseToText(key, true)} found with that ID`, 404));
    }

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        [key]: doc,
      },
    });
  });

export const getOne = <T extends Mongoose["Model"]>(
  Model: T,
  key: string,
  popOptions?: { path: any; select?: any }
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findOne(req.params);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(`No ${camelCaseToText(key, true)} found`, 404));
    }

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        [key]: doc,
      },
    });
  });

export const createOne = (Model: Mongoose["Model"], key: string) =>
  catchAsync(async (req: Request, res: Response) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        [key]: newDoc,
      },
    });
  });

export const updateOne = (Model: Mongoose["Model"], key: string) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`No ${camelCaseToText(key, true)} found with that ID`, 404));
    }

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        [key]: doc,
      },
    });
  });

export const deleteOne = (Model: Mongoose["Model"], key: string) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`No ${camelCaseToText(key, true)} found with that ID`, 404));
    }

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      message: `1 ${key} has been deleted`,
    });
  });
