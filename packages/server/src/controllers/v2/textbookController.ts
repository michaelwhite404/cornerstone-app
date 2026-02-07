import { Request, Response, NextFunction } from "express";
import isPlainObject from "lodash.isplainobject";
import { Textbook, TextbookSet } from "@models";
import { AppError, catchAsync } from "@utils";
import { TextbookDocument } from "@@types/models";
import * as factory from "./handlerFactory";

const Model = TextbookSet;
const key = "textbook";

/** `GET` - Gets all textbooks */
export const getAllTextbooks = factory.getAll(Model, `${key}s`, {}, { path: "count" });
/** `GET` - Gets a single textbook */
export const getOneTextbook = factory.getOneById(Model, key, { path: "count" });
/** `POST` - Creates a single textbook */
export const createTextbook = factory.createOne(Model, key);
/** `PATCH` - Updates a single textbook */
export const updateTextbook = factory.updateOne(Model, key);
/** `DELETE` - Deletes textbook */
export const deleteTextbook = factory.deleteOne(Model, "Textbook");

export const createSetAndBooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!Array.isArray(req.body.books))
      return next(new AppError("The 'books' property must be an array", 400));
    const books = req.body.books as any[];
    if (
      books.every(
        (value) => !(isPlainObject(value) && value.bookNumber && value.quality && value.status)
      )
    ) {
      return next(
        new AppError(
          "Each index in the 'books' array must be an object with a 'bookNumber', 'quality' and 'status' value",
          400
        )
      );
    }

    const setData = {
      title: req.body.title,
      class: req.body.class,
      grade: req.body.grade,
    };
    const set = await TextbookSet.create(setData);
    const mappedBooks = books.map((b) => ({
      ...b,
      textbookSet: set._id,
    }));
    const textbooks = await Textbook.create<TextbookDocument[]>(mappedBooks);

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        textbook: set,
        books: textbooks,
      },
      // message: `Textbook added with ${pluralize("book", textbooks.length, true)}!`,
    });
  }
);
