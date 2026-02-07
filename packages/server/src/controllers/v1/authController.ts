import { CookieOptions, NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import catchAsync from "../../utils/v1/catchAsync";
import AppError from "../../utils/appError";
import Employee from "../../models/employeeModel";
import { EmployeeDocument } from "../../types/models/employeeTypes";
import CustomRequest from "../../types/customRequest";
import DecodedPayload from "../../types/decodedPayload";
import Email from "../../utils/email";
import makePassword from "../../utils/makePassword";
// import Employee from "../models/employeeModel";
// import catchAsync from "../utils/catchAsync";
// import AppError from "../utils/appError";
// import Email from "../utils/email";

const signToken = (id: EmployeeDocument["_id"]) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const createSendToken = (employee: EmployeeDocument, statusCode: number, res: Response) => {
  const token = signToken(employee._id);
  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN! * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  //if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  employee.password = undefined as unknown as string;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      employee,
    },
  });
};

export const createSendGoogleToken = catchAsync((req: CustomRequest, res: Response) => {
  const token = signToken(req.user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN! * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  res.redirect("/dashboard");
});

export const signup = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.employee.role !== "Super Admin" && req.body.role === "Super Admin") {
    return next(new AppError("You are not authorized to create a user with that role", 403));
  }
  req.body.password = makePassword(12);
  const newEmployee = await Employee.create(req.body);
  createSendToken(newEmployee, 201, res);
});

export const createEmployee = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.employee.role !== "Super Admin" && req.body.role === "Super Admin") {
      return next(new AppError("You are not authorized to create a user with that role", 403));
    }
    req.body.password = makePassword(12);
    const newEmployee = await Employee.create(req.body);

    const url = `${req.protocol}://${req.get("host")}`;
    await new Email(req.body, url).sendWelcome();

    // Remove password from output
    newEmployee.password = undefined as unknown as string;

    res.status(200).json({
      status: "success",
      data: {
        newEmployee,
      },
    });
  }
);

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  // 1. Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  // 2. Check if employee exists & password is correct
  const employee = await Employee.findOne({ email }).select("+password");

  if (!employee || !(await employee.correctPassword(password, employee.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3. If everything is ok, send token to client
  employee.lastLogin = new Date(Date.now());
  await employee.save({ validateBeforeSave: false });
  createSendToken(employee, 200, res);
});

export const logout = (_: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

export const protect = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
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

// Only for rendered pages, no errors
export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies.jwt) {
    try {
      // 1.) Verification token
      // @ts-ignore
      const decoded: DecodedPayload = await promisify(jwt.verify)(
        req.cookies.jwt,
        // @ts-ignore
        process.env.JWT_SECRET
      );
      // 2.) Check if user still exists
      const freshEmployee = await Employee.findById(decoded.id);
      if (!freshEmployee) {
        return next();
      }
      // 3.) Check if used changed passsword after the token was issued
      if (freshEmployee.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      // THERE IS A LOGGED IN USER
      res.locals.employee = freshEmployee;
      // console.log(res.locals.employee);
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

export const restrictTo = (...roles: any[]) => {
  return (req: Request, _: Response, next: NextFunction) => {
    // roles ['admin','lead-guide]
    if (!roles.includes(req.employee.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }

    next();
  };
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1.) Get employee based on POSTed email
    const employee = await Employee.findOne({ email: req.body.email });
    if (!employee) {
      return next(new AppError("There is no employee with this email address", 404));
    }
    // 2.) Generate random token
    const resetToken = employee.createPasswordResetToken();
    await employee.save({ validateBeforeSave: false });
    // 3. Send it to employee's email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/reset-password/${resetToken}`;

    // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.
    //                 \nIf you didn't forget your password, please ignore this email!`;

    try {
      // await sendEmail({
      //   email: employee.email,
      //   subject: "Your password reset token (valid for 10 min)",
      //   message,
      // });

      await new Email(employee, resetURL).sendPasswordReset();

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      employee.passwordResetToken = undefined;
      employee.passwordResetExpires = undefined;
      await employee.save({ validateBeforeSave: false });

      return next(new AppError("There was an error sending the email. Try again later!", 500));
    }
  }
);

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Get employee based on the token
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const employee = await Employee.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date(Date.now()) },
  });

  // 2) If token has not expired, and there is employee, set the new password
  if (!employee) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  employee.password = req.body.password;
  employee.passwordConfirm = req.body.passwordConfirm;
  employee.passwordResetToken = undefined;
  employee.passwordResetExpires = undefined;
  await employee.save();

  // 3) Update changedPasswordAt property for the employee
  // 4) Log the employee in, send JWT
  createSendToken(employee, 200, res);
});

export const updatePassword = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1.) Get employee from collection
    const employee = await Employee.findById(req.employee._id).select("+password");
    if (!employee) {
      return next(new AppError("You are not logged in", 403));
    }
    // 2.) Check if POSTed current password is correct
    if (!(await employee.correctPassword(req.body.passwordCurrent, employee.password))) {
      return next(new AppError("Your current password is wrong", 401));
    }
    // 3.) If so, update password
    employee.password = req.body.password;
    employee.passwordConfirm = req.body.passwordConfirm;
    await employee.save();
    // 4.) Log employee in, send JWT
    createSendToken(employee, 200, res);
  }
);
