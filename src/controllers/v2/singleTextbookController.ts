import { NextFunction, Request, RequestHandler, Response } from "express";
import { FilterQuery, Types, UpdateQuery } from "mongoose";
import pluralize from "pluralize";
import isPlainObject from "lodash.isplainobject";
import { Student, Textbook, TextbookLog } from "@models";
import { AppError, catchAsync } from "@utils";
import { TextbookModel, TextbookLogModel } from "@@types/models";
import * as factory from "./handlerFactory";
import { textbookEvent } from "@events";

const Model = Textbook;
const key = "book";

/** `GET` - Gets all books
 *  - All authorized users can access this route
 */
export const getAllBooks: RequestHandler = factory.getAll(
  Model,
  `${key}s`,
  {},
  {
    path: "textbookSet lastUser",
  }
);

export const getBook: RequestHandler = factory.getOne(Model, key);

export const createBook: RequestHandler = factory.createOne(Model, key);

export const createBooks = catchAsync(async (req, res, next) => {
  const books = req.body.books;
  if (!books || !Array.isArray(books)) {
    return next(
      new AppError("There must be a books property, which contains an array of books to add", 400)
    );
  }
  const mappedBooks = books.map((book) => ({
    textbookSet: book.textbookSet || req.body.textbookSet,
    bookNumber: book.bookNumber,
    quality: book.quality,
    status: book.status,
  }));

  const createdBooks = await Model.create(mappedBooks);

  res.status(201).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      books: createdBooks,
    },
  });
});

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

export const checkOutTextbookByStudent = catchAsync(
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

    res.status(201).json({
      status: "success",
      requestedAt: req.requestTime,
      message: `${student.fullName} checked out ${pluralize("textbook", bodyBooks.length, true)}`,
    });
  }
);

export const checkInTextbookByStudent = catchAsync(
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
    textbookEvent.checkIn(bodyBooks.map(({ id }) => id));
  }
);

export const checkOutTextbooks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Data must be an array
    if (!Array.isArray(req.body.data))
      return next(new AppError("The 'data' property must be an array", 400));
    type Data = { book: string; student: string };
    const { data }: { data: Data[] } = req.body;
    // Each item in the array must be an object with 'book' and 'student'
    if (data.every((value) => !(isPlainObject(value) && value.book && value.student))) {
      return next(
        new AppError(
          "Each index in the 'data' array must be an object with a 'book' and a 'student' value",
          400
        )
      );
    }
    // Get book ids
    const bookIds = data.map((obj) => obj.book);
    // No book duplicates
    if (checkIfDuplicateExists(bookIds))
      return next(new AppError("All book values must be unique", 400));
    // Remove student duplicates
    const studentIds = [...new Set(data.map((obj) => obj.student))];
    // Get books and students
    const [books, students] = await Promise.all([
      Textbook.find({ _id: { $in: bookIds }, active: true }).populate({
        path: "textbookSet",
        select: "_id title",
      }),
      Student.find({ _id: { $in: studentIds }, status: "Active" }).populate("textbooksCheckedOut"),
    ]);
    // Make sure all book ids are valid
    const returnedBooksIds = books.map((b) => b._id.toString());
    const invalidBooks = notInArray(returnedBooksIds, bookIds);
    if (invalidBooks.length > 0)
      return next(
        new AppError(
          `There are ${invalidBooks.length} invalid book ids: ${invalidBooks.join(", ")}`,
          400
        )
      );
    // All books can be checked out
    const notAvailable = books.filter((b) => b.status !== "Available");
    if (notAvailable.length > 0) {
      const msgStart = notAvailable.length + ` book${notAvailable.length > 1 ? "s" : ""}`;
      return next(
        new AppError(
          `${msgStart} cannot be checked out: ${notAvailable
            .map((o) => `${o.textbookSet.title} (Book ${o.bookNumber})`)
            .join(", ")}. Please check the status for each book.`,
          400
        )
      );
    }
    // Students are valid
    const returnedStudentIds = students.map((s) => s._id.toString());
    const invalidStudents = notInArray(returnedStudentIds, studentIds);
    if (invalidStudents.length > 0)
      return next(
        new AppError(
          `There are ${invalidStudents.length} invalid student ids: ${invalidStudents.join(", ")}`,
          400
        )
      );
    // TODO: Student textbook set restriction
    // GOOD TO GO !!
    const getBook = (id: string) => books.find((book) => book._id.toString() === id);
    // Update textbooks' propertirs
    const textbookBulkArr = data.map((obj) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(obj.book) } as FilterQuery<TextbookModel>,
        update: {
          status: "Checked Out",
          lastUser: obj.student,
          teacherCheckOut: req.employee._id,
        } as UpdateQuery<TextbookModel>,
      },
    }));

    // Create logs
    const createLogs = data.map<Omit<TextbookLogModel, "_id">>((obj) => ({
      checkedIn: false,
      textbook: obj.book,
      student: obj.student,
      checkOutDate: new Date(req.requestTime),
      teacherCheckOut: req.employee._id,
      qualityOut: getBook(obj.book)!.quality,
    }));
    await Promise.all([Textbook.bulkWrite(textbookBulkArr), TextbookLog.create(createLogs)]);
    //-------------
    const hasOrHave = (num: number) => (num > 1 ? "have" : "has");
    res.status(200).json({
      status: "sucess",
      message: `${pluralize("textbooks", data.length, true)} ${hasOrHave(
        data.length
      )} been checked out`,
    });
  }
);

export const checkInTextbooks = catchAsync(
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
    const data = req.body.books as { id: string; quality: string }[];
    // HANDLE REST ON FRONT END
    // Update Textbooks
    const textbookBulkArr = data.map((book) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(book.id) },
        update: { status: "Available", quality: book.quality },
      },
    }));
    // Update Logs
    const logBulkArr = data.map((book) => ({
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

    await Textbook.bulkWrite(textbookBulkArr);
    await TextbookLog.bulkWrite(logBulkArr);

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      message: `${pluralize("textbook", data.length, true)} checked in!`,
    });
    textbookEvent.checkIn(data.map(({ id }) => id));
  }
);

export const addTextbookSetToBody: RequestHandler = (req, _, next) => {
  if (req.params.textbookSet) req.body.textbookSet = req.params.textbookSet;
  next();
};

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

const checkIfDuplicateExists = (arr: any[]) => {
  return new Set(arr).size !== arr.length;
};

/**
 *
 * @param target The array of values being checked against
 * @param arr The array of values being tested
 * @returns The values in the second argument that are not in the first
 */
const notInArray = (target: any[], arr: any[]) => {
  return arr.filter((value) => !target.includes(value));
};
