import { NextFunction, Request, RequestHandler, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { Employee } from "@models";
import { EmployeeModel } from "@@types/models";
import { DecodedPayload } from "@@types";
import { AppError, catchAsync, makePassword } from "@utils";
import { createSendToken, restrictTo as v1restrictTo } from "../v1/authController";

/**
 * `POST` - Creates new employee
 * - Only users with the role `Super Admin` or `Admin` can access this route
 */
export const createEmployee = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.employee.role !== "Super Admin" && req.body.role === "Super Admin") {
      return next(new AppError("You are not authorized to create a user with that role", 403));
    }

    const user = await Employee.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      title: req.body.title,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password || makePassword(12),
      active: true,
    } as EmployeeModel);

    // const url = `${req.protocol}://${req.get("host")}`;
    // await new Email(req.body, url).sendWelcome();

    // Remove password from output
    // @ts-ignore
    user.password = undefined;

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

export const googleLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { email, picture } = ticket.getPayload()!;
  const employee = await Employee.findOne({ email, active: true }).populate({
    path: "departments",
  });
  if (!employee) return next(new AppError("You are not authorized to use this app", 403));
  employee.lastLogin = new Date(req.requestTime);
  employee.image = picture;
  await employee.save();
  createSendToken(employee, 200, res);
});

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }
  // 2.) Verification token
  // @ts-ignore
  const decoded: DecodedPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET!);
  // console.log(decoded);
  // 3.) Check if employee still exists
  const freshEmployee = await Employee.findById(decoded.id);
  if (!freshEmployee) {
    return next(new AppError("The user belonging to this token no longer exists.", 401));
  }
  // 4.) Check if user changed passsword after the token was issued
  if (freshEmployee.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User recently changed password. Please log in again!", 401));
  }
  req.employee = freshEmployee;
  res.locals.employee = freshEmployee;
  // GRANT ACCESS TO PROTECTED ROUTE
  next();
});

export const gChatProtect: RequestHandler = (req, _, next) => {
  const key = process.env.G_CHAT_KEY;
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (token !== key) {
    next(new AppError("Only Google Chat can add spaces property to users", 401));
  }
  next();
};

export const restrictTo = v1restrictTo;

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1. Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  // 2. Check if employee exists & password is correct
  const employee = await Employee.findOne({ email })
    .populate({ path: "departments" })
    .select("+password");
  if (!employee || !(await employee.correctPassword(password, employee.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  // 3. If everything is ok, send token to client
  employee.lastLogin = new Date(Date.now());
  await employee.save({ validateBeforeSave: false });
  createSendToken(employee, 200, res);
});
