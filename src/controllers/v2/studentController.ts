import { Request, Response } from "express";
import { Student } from "@models";
import { admin, AppError, catchAsync, isObjectID, ordinal } from "@utils";
import { handlerFactory as factory } from ".";
import { GaxiosResponse } from "googleapis-common";
import { admin_directory_v1 } from "googleapis";
import pluralize from "pluralize";
import { StudentDocument } from "@@types/models";
import { getUserGroups } from "./employeeController";
import { models } from "@@types";

const Model = Student;
const key = "student";

/** `GET` - Gets all students */
export const getAllStudents = factory.getAll(Student, `${key}s`);
/** `GET` - Gets a single student */
export const getOneStudent = catchAsync(async (req, res, next) => {
  let query = isObjectID(req.params.id.toString())
    ? Model.findById(req.params.id)
    : Model.findOne({ slug: req.params.id });

  const student = await query.populate([
    {
      path: "textbooks",
      select: "textbookSet quality bookNumber teacherCheckOut -lastUser",
      populate: {
        path: "teacherCheckOut textbookSet",
        select: "fullName email title class",
      },
    },
    {
      path: "devices",
      select: "status name brand deviceType slug -checkouts",
    },
  ]);

  if (!student) {
    return next(new AppError("There is no student with this id", 404));
  }
  let groups: models.UserGroup[] | undefined;
  if (req.query.projection === "FULL") {
    groups = await getUserGroups(student.schoolEmail);
  }
  const { id, __v, ...s } = student.toJSON();

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: {
      student: { ...s, groups },
    },
  });
});

/** `POST` - Creates a single student */
export const createStudent = catchAsync(async (req, res, next) => {
  const { password, ...body } = req.body;
  if (!(password && typeof password === "string" && password.length >= 8)) {
    return next(new AppError("A student must have a password with at least 8 characters.", 400));
  }
  const student = await Model.create(body);
  try {
    const response = await admin.users.insert({
      requestBody: {
        name: {
          givenName: student.firstName,
          familyName: student.lastName,
        },
        primaryEmail: student.schoolEmail,
        password,
        orgUnitPath: createOrgUnitPath(student),
      },
    });
    if (response.data.id) (student.googleId = response.data.id), await student.save();
  } catch (err) {
    await student.remove();
    throw err;
  }
  res.sendJson(201, {
    student,
  });
});

/** `PATCH` - Updates a single student */
export const updateStudent = factory.updateOne(Model, key);
/** `DELETE` - Deletes student */
export const deleteStudent = factory.deleteOne(Model, "Student");

export const groupStudentsByGrade = catchAsync(async (_: Request, res: Response) => {
  const grades = await Student.aggregate([
    { $match: { status: "Active" } },
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

export const updateStudentGooglePassword = catchAsync(async (req, res, next) => {
  const authorization =
    req.employee.role === "Super Admin"
      ? "SUPER_ADMIN"
      : req.employee.homeroomGrade
      ? "TEACHER"
      : null;
  if (!authorization)
    return next(new AppError("You do not have permission to perform this action", 403));

  const { students } = req.body;
  if (!students || !Array.isArray(students)) {
    return next(
      new AppError("There must be a an array of students, each with an email and password", 400)
    );
  }
  if (
    !students.every(
      (student) => typeof student.email === "string" && typeof student.password === "string"
    )
  ) {
    return next(new AppError("Each user must have an email and password", 400));
  }
  const filter: any = { schoolEmail: { $in: students.map((s) => s.email as string) } };
  if (authorization === "TEACHER") filter.grade = req.employee.homeroomGrade;
  const validStudents = await Student.find(filter);

  const reduced = validStudents.reduce((prevValue, nextValue) => {
    prevValue[nextValue.schoolEmail] = true;
    return prevValue;
  }, {} as { [x: string]: boolean });

  const studentsToUpdate = students.filter((s) => reduced[s.email]);

  const requests = studentsToUpdate.map((student) =>
    admin.users.update({
      userKey: student.email,
      requestBody: {
        password: student.password,
      },
    })
  );
  const responses = await Promise.allSettled(requests);
  const fulfilled = responses.filter(
    (response) => response.status === "fulfilled"
  ) as PromiseFulfilledResult<GaxiosResponse<admin_directory_v1.Schema$User>>[];

  res.status(200).json({
    status: "success",
    message: pluralize("student passwords", fulfilled.length, true) + " reset",
    studentsToUpdate,
  });
});

const createOrgUnitPath = (student: StudentDocument) => {
  if (student.status === "Graduate") return "/Graduates";
  if (student.status === "Inactive") return "/Inactive/Students";
  const grade = student.grade!;
  if (grade === 0) return "/Students/Lower School/Kindergarten";
  if (grade <= 6) return `/Students/Lower School/${ordinal(grade)} Grade`;
  return `/Students/Upper School/${ordinal(grade)} Grade`;
};
