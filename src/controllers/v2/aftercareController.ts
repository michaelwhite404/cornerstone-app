import { Student } from "@models";
import { AftercareSession, AftercareAttendanceEntry } from "@models";
import { StudentModel } from "@@types/models";
import { AppError, catchAsync, isObject, isObjectID, numberToGrade, sheets } from "@utils";
import { FilterQuery, Types, UpdateQuery } from "mongoose";
import * as factory from "./handlerFactory";
import pluralize from "pluralize";
import s3 from "@utils/s3";
import { RequestHandler } from "express";
import validator from "validator";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import { io } from "@server";
import { aftercareEvent } from "@events/AftercareEvent";

export const getAllAftercareStudents = factory.getAll(Student, "students", { aftercare: true });

export const modifyAftercareStudentStatus = catchAsync(async (req, res, next) => {
  if (!req.body.data || !Array.isArray(req.body.data))
    return next(new AppError("There must be an array of data", 400));

  const bodyData: any[] = req.body.data;

  if (!bodyData.every((obj) => isObject(obj) && "id" in obj && "op" in obj))
    return next(new AppError("Each object should have an `id` and `op` property", 400));
  const filteredData = bodyData.filter(
    (obj) => isObjectID(obj.id) && ["add", "remove"].includes(obj.op)
  );
  // Good to go

  const writes = filteredData.map((obj) => ({
    updateOne: {
      filter: {
        _id: new Types.ObjectId(obj.id),
      } as FilterQuery<StudentModel>,
      update: {
        aftercare: obj.op === "add" ? true : false,
      } as UpdateQuery<StudentModel>,
    },
  }));

  const result = await Student.bulkWrite(writes);

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    message: `${pluralize("status", result.modifiedCount, true)} updated`,
  });
});

export const putAftercareStudentStatus = catchAsync(async (req, res, next) => {
  if (!req.body.students || !Array.isArray(req.body.students))
    return next(new AppError("There must be an array of student ids", 400));

  const bodyStudents: any[] = req.body.students;

  if (!bodyStudents.every((student) => typeof student === "string"))
    return next(new AppError("Each id in the student array must be a string", 400));

  const filteredStudentIds: string[] = bodyStudents.filter((id) => isObjectID(id));

  await Student.updateMany({}, { aftercare: false });

  const result = await Student.updateMany(
    { _id: { $in: filteredStudentIds } },
    { aftercare: true }
  );

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    message: `${pluralize("status", result.nModified, true)} updated`,
  });
});

export const createAftercareSession = catchAsync(async (req, res, next) => {
  if (await AftercareSession.sessionToday())
    return next(new AppError("A session already exists today", 400));

  if (!req.body.students || !Array.isArray(req.body.students))
    return next(new AppError("There must be an array of student ids to create a session", 400));

  const bodyStudents: any[] = req.body.students;

  if (!bodyStudents.every((student) => typeof student === "string"))
    return next(new AppError("Each id in the student array must be a string", 400));

  const students = await Student.find({ _id: { $in: bodyStudents }, status: "Active" });

  const session = await AftercareSession.create({
    date: new Date().toISOString(),
    active: true,
    numAttended: students.length,
    dropIns: students.filter((s) => !s.aftercare).length,
  });

  const entryArray = students.map((student) => ({
    student,
    session,
    dropIn: !student.aftercare,
  }));

  const attendance = await AftercareAttendanceEntry.create(entryArray);
  const data = {
    session,
    attendance: attendance.map((entry) => ({
      _id: entry._id,
      student: {
        _id: entry.student._id,
        fullName: entry.student.fullName,
        schoolEmail: entry.student.schoolEmail,
      },
      dropIn: entry.dropIn,
    })),
  };

  io.emit("aftercareSessionStart", data);
  res.sendJson(201, data);
});

export const getAllAttendanceEntries = factory.getAll(
  AftercareAttendanceEntry,
  "entries",
  {},
  {
    path: "student",
    select: "fullName schoolEmail grade",
  }
);

export const getAftercareEntryById = factory.getOneById(AftercareAttendanceEntry, "entry", {
  path: "student",
  select: "fullName",
});

export const signOutStudent = catchAsync(async (req, res, next) => {
  const entry = await AftercareAttendanceEntry.findById(req.params.id).populate({
    path: "student",
    select: "fullName schoolEmail aftercare",
  });
  if (!entry) return next(new AppError("There is no entry with this id", 404));
  if (entry.signOutDate) return next(new AppError("This student has already been signed out", 400));
  const data = await s3.uploadBase64Image(req.body.signature, `signatures/aftercare/${entry._id}`);
  entry.signOutDate = new Date();
  entry.lateSignOut = new Date().getHours() >= 18;
  entry.signature = data.Key;
  await entry.save();
  res.sendJson(200, {
    entry,
  });
  io.emit("aftercareSignOutSuccess");
  aftercareEvent.signOut(entry);
});

export const createAttendanceEntries = catchAsync(async (req, res, next) => {
  const session = await AftercareSession.sessionToday();
  if (!session) return next(new AppError("No session has been created today.", 400));
  if (!session.active)
    return next(new AppError("Entries cannot be added after a session is over", 400));
  // Array of student ids
  if (!req.body.students || !Array.isArray(req.body.students))
    return next(new AppError("There must be an array of student ids to create a session", 400));

  const bodyStudents: any[] = req.body.students;

  if (!bodyStudents.every((id) => typeof id === "string" && isObjectID(id)))
    return next(new AppError("Each id in the student array must be a string ObjectId", 400));

  const [sessionEntries, students] = await Promise.all([
    AftercareAttendanceEntry.find({ session: session._id }),
    Student.find({ _id: { $in: bodyStudents } }),
  ]);

  const sessionEntriesStudentIds = sessionEntries.map((e) => e.student.toString());
  // const studentIds = students.map((s) => s._id.toString());

  const studentsToAdd = students.filter(
    (student) => !sessionEntriesStudentIds.includes(student._id.toString())
  );

  const entries = await AftercareAttendanceEntry.create(
    studentsToAdd.map((student) => ({
      student: student._id,
      session: session._id,
      dropIn: !student.aftercare,
    }))
  );
  io.emit("aftercareAddEntries");
  res.sendJson(200, {
    entries,
  });
});

export const getSessionToday = catchAsync(async (_, res) => {
  const session = await AftercareSession.sessionToday();
  const attendance = session
    ? await AftercareAttendanceEntry.find({ session }).populate({
        path: "student",
        select: "fullName schoolEmail",
      })
    : [];
  res.sendJson(200, {
    session,
    attendance,
  });
});

export const getAllAftercareSessions = factory.getAll(
  AftercareSession,
  "sessions",
  {},
  {
    path: "numAttended dropIns",
  }
);

export const getAftercareSession = factory.getOneById(AftercareSession, "session", {
  path: "numAttended dropIns",
});

export const addDateToParams: RequestHandler = (req, _, next) => {
  let { year, month, day } = req.params;
  if (month.length === 1) month = `0${month}`;
  if (day.length === 1) day = `0${day}`;

  // If date is not valid
  if (!validator.isDate(`${year}-${month}-${day}`, { format: "YYYY/MM/DD" })) {
    return next(new AppError("Invalid Date", 400));
  }
  const date = new Date(+year, +month - 1, +day);
  const nextDay = addDays(date, 1);
  req.query.signOutDate = {
    gte: date.toISOString(),
    lte: nextDay.toISOString(),
  };
  next();
};

export const getAttendanceStats = catchAsync(async (_, res) => {
  const stats = await AftercareAttendanceEntry.aggregate([
    { $match: { signOutDate: { $exists: 1 } } },
    {
      $group: {
        _id: "$student",
        entriesCount: { $sum: 1 },
        lateCount: { $sum: { $cond: ["$lateSignOut", 1, 0] } },
      },
    },
    {
      $lookup: {
        from: "students",
        localField: "_id",
        foreignField: "_id",
        as: "student",
        pipeline: [{ $project: { fullName: 1, grade: 1, schoolEmail: 1, aftercare: 1 } }],
      },
    },
    {
      $project: {
        _id: 0,
        entriesCount: 1,
        lateCount: 1,
        student: { $arrayElemAt: ["$student", 0] },
        aftercare: 1,
      },
    },
  ]);
  res.sendJson(200, { stats });
});

export const generateReport = catchAsync(async (req, res, next) => {
  const validDate = (d: any) => d instanceof Date && !isNaN(d as any);
  const { startDate, endDate } = req.body;
  const valid = [startDate, endDate].every((d) => validDate(new Date(d)));
  if (!valid) return next(new AppError("Start date and end date must be valid dates", 400));
  const stats = await AftercareAttendanceEntry.aggregate([
    {
      $match: {
        signOutDate: {
          $exists: 1,
          $gt: startOfDay(new Date(startDate)),
          $lt: endOfDay(new Date(endDate)),
        },
      },
    },
    {
      $group: {
        _id: "$student",
        entriesCount: { $sum: 1 },
        lateCount: { $sum: { $cond: ["$lateSignOut", 1, 0] } },
      },
    },
    {
      $lookup: {
        from: "students",
        localField: "_id",
        foreignField: "_id",
        as: "student",
        pipeline: [{ $project: { fullName: 1, lastName: 1, grade: 1, schoolEmail: 1 } }],
      },
    },
    {
      $project: {
        _id: 0,
        entriesCount: 1,
        lateCount: 1,
        student: { $arrayElemAt: ["$student", 0] },
      },
    },
    {
      $sort: {
        "student.lastName": 1,
      },
    },
  ]);

  const googleSheets = sheets(req.employee.email);

  const response = await googleSheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: `Lions Den Report ${format(new Date(startDate), "P")} - ${format(
          new Date(endDate),
          "P"
        )}`,
      },
    },
  });

  const spreadsheetId = response.data.spreadsheetId!;
  await googleSheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        ["Lions Den Report"],
        [`Generated at: ${format(new Date(), "Pp")}`],
        [
          `Date Start: ${format(new Date(startDate), "P")}`,
          null,
          `Date End: ${format(new Date(endDate), "P")}`,
        ],
        ["Name", "Grade", "Days Present", "Late"],
        ...stats.map((stat) => [
          stat.student.fullName,
          numberToGrade(stat.student.grade, true),
          stat.entriesCount,
          stat.lateCount,
        ]),
      ],
    },
  });
  await googleSheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              sheetId: 0,
              gridProperties: {
                hideGridlines: true,
              },
            },
            fields: "gridProperties.hideGridlines",
          },
        },
        {
          updateDimensionProperties: {
            range: {
              sheetId: 0,
              dimension: "COLUMNS",
              startIndex: 0,
              endIndex: 4,
            },
            properties: {
              pixelSize: 172,
            },
            fields: "pixelSize",
          },
        },
        {
          updateDimensionProperties: {
            range: {
              sheetId: 0,
              dimension: "ROWS",
              startIndex: 0,
            },
            properties: {
              pixelSize: 28,
            },
            fields: "pixelSize",
          },
        },
        {
          updateDimensionProperties: {
            range: {
              sheetId: 0,
              dimension: "ROWS",
              startIndex: 0,
              endIndex: 1,
            },
            properties: {
              pixelSize: 56,
            },
            fields: "pixelSize",
          },
        },
        {
          mergeCells: {
            range: {
              sheetId: 0,
              startColumnIndex: 0,
              endColumnIndex: 4,
              startRowIndex: 0,
              endRowIndex: 1,
            },
            mergeType: "MERGE_ALL",
          },
        },
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startColumnIndex: 0,
              endColumnIndex: 4,
              startRowIndex: 0,
              endRowIndex: 1,
            },
            cell: {
              userEnteredFormat: {
                // #3c78d8
                backgroundColor: {
                  red: 60 / 255,
                  green: 120 / 255,
                  blue: 216 / 255,
                },
                horizontalAlignment: "CENTER",
                verticalAlignment: "MIDDLE",
                textFormat: {
                  foregroundColor: {
                    red: 1,
                    green: 1,
                    blue: 1,
                  },
                  fontSize: 20,
                  fontFamily: "Kanit",
                  bold: true,
                },
              },
            },
            fields:
              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
          },
        },
        {
          mergeCells: {
            range: {
              sheetId: 0,
              startColumnIndex: 0,
              endColumnIndex: 4,
              startRowIndex: 1,
              endRowIndex: 2,
            },
            mergeType: "MERGE_ALL",
          },
        },
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startColumnIndex: 0,
              endColumnIndex: 4,
              startRowIndex: 1,
              endRowIndex: 2,
            },
            cell: {
              userEnteredFormat: {
                // #1155cc
                backgroundColor: {
                  red: 17 / 255,
                  green: 85 / 255,
                  blue: 204 / 255,
                },
                horizontalAlignment: "RIGHT",
                verticalAlignment: "MIDDLE",
                textFormat: {
                  foregroundColor: {
                    red: 1,
                    green: 1,
                    blue: 1,
                  },
                  fontSize: 10,
                  fontFamily: "Arial",
                  bold: true,
                },
                padding: {
                  top: 0,
                  right: 20,
                  bottom: 0,
                  left: 0,
                },
              },
            },
            fields:
              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,padding)",
          },
        },
        {
          mergeCells: {
            range: {
              sheetId: 0,
              startColumnIndex: 0,
              endColumnIndex: 2,
              startRowIndex: 2,
              endRowIndex: 3,
            },
            mergeType: "MERGE_ALL",
          },
        },
        {
          mergeCells: {
            range: {
              sheetId: 0,
              startColumnIndex: 2,
              endColumnIndex: 4,
              startRowIndex: 2,
              endRowIndex: 3,
            },
            mergeType: "MERGE_ALL",
          },
        },
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startColumnIndex: 0,
              endColumnIndex: 4,
              startRowIndex: 2,
              endRowIndex: 3,
            },
            cell: {
              userEnteredFormat: {
                // #434343
                backgroundColor: {
                  red: 67 / 255,
                  green: 67 / 255,
                  blue: 67 / 255,
                },
                horizontalAlignment: "CENTER",
                verticalAlignment: "MIDDLE",
                textFormat: {
                  foregroundColor: {
                    red: 1,
                    green: 1,
                    blue: 1,
                  },
                  fontSize: 10,
                  fontFamily: "Arial",
                  bold: true,
                },
              },
            },
            fields:
              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
          },
        },
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startColumnIndex: 0,
              endColumnIndex: 4,
              startRowIndex: 3,
              endRowIndex: stats.length + 4,
            },
            cell: {
              userEnteredFormat: {
                horizontalAlignment: "LEFT",
                verticalAlignment: "MIDDLE",
                textFormat: {
                  fontSize: 10,
                  fontFamily: "Arial",
                },
                padding: {
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 8,
                },
                borders: {
                  bottom: {
                    width: 1,
                    style: "SOLID",
                    color: {
                      red: 0,
                      green: 0,
                      blue: 0,
                    },
                  },
                },
              },
            },
            fields:
              "userEnteredFormat(textFormat,horizontalAlignment,verticalAlignment,padding,borders)",
          },
        },
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startColumnIndex: 0,
              endColumnIndex: 1,
              startRowIndex: 3,
              endRowIndex: stats.length + 4,
            },
            cell: {
              userEnteredFormat: {
                textFormat: {
                  bold: true,
                },
              },
            },
            fields: "userEnteredFormat(textFormat)",
          },
        },
        {
          updateBorders: {
            range: {
              sheetId: 0,
              startColumnIndex: 0,
              endColumnIndex: 4,
              startRowIndex: 0,
              endRowIndex: stats.length + 4,
            },
            top: {
              width: 2,
              style: "SOLID",
              color: {
                red: 0,
                green: 0,
                blue: 0,
              },
            },
            ...["top", "bottom", "left", "right"].reduce((curr, next) => {
              curr[next] = {
                width: 2,
                style: "SOLID",
                color: {
                  red: 0,
                  green: 0,
                  blue: 0,
                },
              };
              return curr;
            }, {} as any),
          },
        },
      ],
    },
  });

  res.sendJson(200, { spreadsheetUrl: response.data.spreadsheetUrl });
});
