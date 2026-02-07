import { Request, Response, NextFunction } from "express";
import moment from "moment";
import catchAsync from "../../utils/v1/catchAsync";
import Device from "../../models/deviceModel";
import AppError from "../../utils/appError";
import Employee from "../../models/employeeModel";
import Student from "../../models/studentModel";
import capitalize from "capitalize";
import pluralize from "pluralize";
import CheckoutLog from "../../models/checkoutLogModel";
import ErrorLog from "../../models/errorLogModel";
import camelize from "../../utils/camelize";
import ordinal from "../../utils/ordinal";
import CustomRequest from "../../types/customRequest";

export const getHomePage = (_: Request, res: Response) => {
  if (res.locals.employee) {
    res.redirect("/dashboard");
  } else {
    res.status(200).render("login");
  }
};

export const getDashboardPage = catchAsync(async (_: Request, res: Response) => {
  res.status(200).render("dashboard", {
    title: "Dashboard",
  });
});

export const addDevicePage = catchAsync((req: CustomRequest, res: Response) => {
  res.status(200).render("addDevice", {
    title: `Add New ${capitalize(req.device!)}`,
    deviceType: req.device,
    capitalize,
  });
});

export const editDevicePage = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const device = await Device.findOne({
      slug: req.params.slug,
      deviceType: req.device,
    });

    if (!device) {
      return next(new AppError(`No ${req.device} found with that ID`, 404));
    }

    res.status(200).render("editDevice", {
      title: `Edit ${capitalize(req.device!)}`,
      device,
      key: req.device,
    });
  }
);

export const getAllDevicesPage = catchAsync(async (req: CustomRequest, res: Response) => {
  const devices = await Device.find({ deviceType: req.device }).sort({ name: 1 }).populate({
    path: "lastUser",
    fields: "fullName grade",
  });
  res.status(200).render("allDevices", {
    title: pluralize(capitalize(req.device!)),
    key: req.device,
    devices,
    capitalize,
    pluralize,
    ordinal,
    moment,
  });
});

export const getDevicePage = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const device = await Device.findOne({
      slug: req.params.slug,
      deviceType: req.device,
    })
      .populate({
        path: "lastUser",
        fields: "fullName grade",
      })
      .populate({
        path: "teacherCheckOut",
        fields: "fullName email",
      });

    if (!device) {
      return next(new AppError(`No ${req.device} found with that ID`, 404));
    }

    const grades = await Student.aggregate([
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

    const checkOutLog = await CheckoutLog.find({ device: device._id })
      .sort({ checkOutDate: -1 })
      .populate({
        path: "deviceUser teacherCheckOut teacherCheckIn",
        fields: "fullName",
      });

    const errorLogs = await ErrorLog.find({ device: device._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "checkInInfo",
        populate: {
          path: "deviceUser",
          select: "fullName",
        },
      });

    res.status(200).render("oneDevice", {
      title: device.name,
      device,
      grades,
      capitalize,
      key: req.device,
      checkOutLog,
      errorLogs,
      camelize,
      ordinal,
      moment,
    });
  }
);

export const createUserPage = catchAsync(async (_: CustomRequest, res: Response) => {
  res.status(200).render("newUser", {
    title: "Create New User",
  });
});

export const editUserPage = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const editEmployee = await Employee.findOne({ slug: req.params.slug });

    if (!editEmployee) {
      return next(new AppError("No employee found with that ID", 404));
    }

    res.status(200).render("editUser", {
      title: "Edit User",
      editEmployee,
    });
  }
);

export const createStudentPage = catchAsync(async (_: CustomRequest, res: Response) => {
  res.status(200).render("newStudent", {
    title: "Create New Student",
  });
});

export const editStudentPage = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const student = await Student.findOne({ slug: req.params.slug });

    if (!student) {
      return next(new AppError("No student found with that ID", 404));
    }

    res.status(200).render("editStudent", {
      title: "Edit Student",
      student,
    });
  }
);

export const getNewPasswordPage = catchAsync(async (_: CustomRequest, res: Response) => {
  res.status(200).render("newPassword", {
    title: "Create Your New Password",
  });
});

export const testGroup = catchAsync(async (_: CustomRequest, res: Response) => {
  const grades = await Student.aggregate([
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

  res.status(200).render("testGroup", {
    title: "Test Grouping",
    grades,
  });
});

export const getDeviceStatsPage = catchAsync(async (req: CustomRequest, res: Response) => {
  const deviceType = req.device;
  const brands = await Device.aggregate([
    {
      $match: { deviceType, brand: { $ne: "Fake Inc." } },
    },
    {
      $group: {
        _id: {
          brand: "$brand",
          status: "$status",
          model: "$model",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          brand: "$_id.brand",
          model: "$_id.model",
        },
        statuses: {
          $push: {
            status: "$_id.status",
            count: "$count",
          },
        },
        count: { $sum: "$count" },
      },
    },
    {
      $group: {
        _id: "$_id.brand",
        models: {
          $push: {
            model: "$_id.model",
            count: "$count",
            statuses: "$statuses",
          },
        },
        count: { $sum: "$count" },
      },
    },
    {
      $project: {
        brand: "$_id",
        count: 1,
        models: 1,
        insensitive: { $toLower: "$_id" },
        _id: 0,
      },
    },
    {
      $sort: { insensitive: 1 },
    },
  ]);

  const statuses = await Device.aggregate([
    {
      $match: { deviceType, brand: { $ne: "Fake Inc." } },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        status: "$_id",
        count: 1,
        _id: 0,
      },
    },
  ]);

  const totals = <{ count: number; statuses: any[] }>{};
  const totalCount = await Device.countDocuments({
    deviceType,
    brand: { $ne: "Fake Inc." },
  });
  totals.count = totalCount;
  totals.statuses = statuses;

  const getModelStatusCount = (array: any[], status: string) => {
    const statusIndex = array.findIndex((x) => x.status === status);
    const nOfStatus = statusIndex === -1 ? 0 : array[statusIndex].count;
    return nOfStatus;
  };

  const getBrandStatusCount = (array: any[], status: string) => {
    let nOfStatus = 0;
    for (let i = 0; i < array.length; i++) {
      nOfStatus += getModelStatusCount(array[i].statuses, status);
    }
    return nOfStatus;
  };

  res.status(200).render("deviceStats", {
    title: `${capitalize(req.device!)} Stats`,
    brands,
    totals,
    getModelStatusCount,
    getBrandStatusCount,
  });
});
