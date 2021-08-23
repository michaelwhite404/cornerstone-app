import { NextFunction, Request, RequestHandler, Response } from "express";
import { FilterQuery, Types, UpdateQuery } from "mongoose";
import pluralize from "pluralize";
import Student from "../../models/studentModel";
import TextbookLog from "../../models/textbookLogModel";
import Textbook from "../../models/textbookModel";
import { TextbookLogModel } from "../../types/models/textbookLogTypes";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import * as factory from "./handlerFactory";

const Model = Textbook;
const key = "book";

/** `GET` - Gets all books
 *  - All authorized users can access this route
 */
export const getAllBooks: RequestHandler = factory.getAll(Model, `${key}s`, {}, {
  path: "textbookSet"
});

export const getBook: RequestHandler = factory.getOne(Model, key);

export const createBook: RequestHandler = factory.createOne(Model, key);

export const updateBook: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.status === "Checked Out" || req.body.checkedOut)
      return next(new AppError("This route is not for checking in and out", 400));
    const oldDoc = await Model.findOne(req.params);
    if (!oldDoc) {
      return next(new AppError("No book found with that ID", 400));
    }
    if (oldDoc.status === "Checked Out")
      return next(new AppError("Checked out book cannot be updated", 400));
    const newDoc = await Model.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        book: newDoc,
      },
    });
  }
);

export const checkOutTextbook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!Array.isArray(req.body.books))
      return next(new AppError("An array of book ids must be in a 'books' property", 400));
    const bodyBooks = req.body.books as any[];
    const [books, student] = await Promise.all([
      Textbook.find({ _id: { $in: bodyBooks }, active: true }).populate({
        path: "textbookSet",
        select: "_id title",
      }),
      Student.findById(req.params.student_id).populate("textbooksCheckedOut"),
    ]);
    // Make sure there are no invalid IDs
    const mappedBookIds = books.map((b) => b._id.toString());
    const badIds = bodyBooks.filter((b) => !mappedBookIds.includes(b));
    if (badIds.length > 0)
      return next(
        new AppError(`There are ${badIds.length} invalid book ids: ${badIds.join(", ")}`, 400)
      );
    // Make sure all textbooks are available
    const notAvailable = books.filter((b) => b.status !== "Available");
    if (notAvailable.length > 0) {
      const msgStart = notAvailable.length + ` book${notAvailable.length > 1 ? "s" : ""}`;
      return next(
        new AppError(
          `${msgStart} cannot be checked out: ${notAvailable
            .map((o) => o._id)
            .join(", ")}. Please check the status for each book.`,
          400
        )
      );
    }
    // Make sure student exists
    if (!student) return next(new AppError("There is no student with this ID", 404));
    // Student should not have multiple books from one textbook set
    const checkedSetIds = student.textbooksCheckedOut!.map((t) => t.textbookSet.toString());
    const invalidBooks = books.filter((b) => checkedSetIds.includes(b.textbookSet._id.toString()));
    if (invalidBooks.length > 0) {
      const problems = invalidBooks.map((b) => `${b.textbookSet.title} (${b._id})`).join(", ");
      const msg = `${student.fullName} already has a book from: ${problems}`;
      return next(new AppError(msg, 404));
    }
    /// GOOD TO GO
    await Textbook.updateMany(
      { _id: { $in: bodyBooks } },
      { status: "Checked Out", lastUser: req.params.student_id, teacherCheckOut: req.employee._id },
      { new: true }
    );

    const createLogs = books.map((b) => ({
      checkedIn: false,
      textbook: b._id,
      student: req.params.student_id,
      checkOutDate: new Date(req.requestTime),
      teacherCheckOut: req.employee._id,
      qualityOut: b.quality,
    }));

    await TextbookLog.create(createLogs);

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      message: `${student.fullName} checked out ${pluralize("textbook", bodyBooks.length, true)}`,
    });
  }
);

export const checkInTextbook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let errMsg: string;
    if (!Array.isArray(req.body.books)) {
      errMsg =
        "An array of book ids must be in a 'books' property. Each index in the array should have an object with an `(id)` property for the id of the textbook and a `(quality)` property for the quality of each textbook";
      return next(new AppError(errMsg, 400));
    }
    // Check if each array index has an object with `id` and `quality`
    if (!allHaveIdandQuality(req.body.books)) {
      errMsg =
        "Each index in the array should have an object with an `(id)` property for the id of the textbook and a `(quality)` property for the quality of each textbook, which must be: Excellent, Good, Acceptable, or Poor";
      return next(new AppError(errMsg, 400));
    }
    const bodyBooks = req.body.books as { id: string; quality: string }[];
    // Make sure student exists
    const student = await Student.findById(req.params.student_id)
      .populate("textbooksCheckedOut")
      .select("_id fullName textbooksCheckedOut");
    if (!student) return next(new AppError("There is no student with this ID", 404));
    // Get checked out book IDs
    const checkedOutBooksIds: string[] = student.textbooksCheckedOut!.map((t) => t._id.toString());
    // Get ids not checked out
    const idsNotCheckedOut = bodyBooks.filter((b) => !checkedOutBooksIds.includes(b.id));
    if (idsNotCheckedOut.length > 0) {
      errMsg = `${student.fullName} has not checked out books with these ids: ${idsNotCheckedOut
        .map((b) => b.id)
        .join(", ")}`;
      return next(new AppError(errMsg, 400));
    }
    // Good to go
    const textbookBulkArr = bodyBooks.map((book) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(book.id) },
        update: { status: "Available", quality: book.quality },
      },
    }));
    await Textbook.bulkWrite(textbookBulkArr);

    const logBulkArr = bodyBooks.map((book) => ({
      updateOne: {
        filter: {
          textbook: new Types.ObjectId(book.id),
          checkedIn: false,
        } as FilterQuery<TextbookLogModel>,
        update: {
          checkedIn: true,
          checkInDate: new Date(req.requestTime),
          teacherCheckIn: req.employee._id,
          qualityIn: book.quality,
        } as UpdateQuery<TextbookLogModel>,
      },
    }));

    await TextbookLog.bulkWrite(logBulkArr);

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      message: `${student.fullName} checked in ${pluralize("textbook", bodyBooks.length, true)}`,
    });
  }
);

const allHaveIdandQuality = (array: any[]): boolean => {
  return (
    array.filter((obj) => {
      // Index must be an object
      if (!(typeof obj === "object" || obj !== null || !Array.isArray(obj))) return true;
      // Id must be a string
      if (typeof obj.id !== "string") return true;
      // Quality be a a TextbookQuality type
      if (!["Excellent", "Good", "Acceptable", "Poor"].includes(obj.quality)) return true;
      return false;
    }).length === 0
  );
};