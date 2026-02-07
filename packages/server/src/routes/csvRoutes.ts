import { Request, Response, Router } from "express";
import { stringify } from "csv-stringify";
import { authController } from "@controllers/v2";
import { PopOptions } from "@@types";
import { CheckoutLog } from "@models";
import { APIFeatures, catchAsync } from "@utils";

const router = Router();

router.use(authController.protect);
router.get(
  "/device-logs",
  catchAsync(async (req: Request, res: Response) => {
    const filter = {};
    const populate = {
      path: "device deviceUser teacherCheckOut teacherCheckIn",
      select: "name brand fullName",
    } as PopOptions;
    !req.query.limit && (req.query.limit = "10000");
    req.query.fields = undefined;
    req.query.sort = "-checkOutDate -checkInDate";

    const query = CheckoutLog.find(filter);
    if (populate) query.populate(populate);
    const features = new APIFeatures(query, req.query).filter().limitFields().sort().paginate();
    const checkoutLogs = await features.query;

    const body = [
      [
        "device",
        "checkedIn",
        "student",
        "checkOutDate",
        "teacherCheckOut",
        "checkInDate",
        "teacherCheckIn",
      ],
    ];
    checkoutLogs.forEach((log) =>
      body.push([
        log.device.name,
        `${log.checkedIn}`,
        log.deviceUser.fullName,
        log.checkOutDate.toLocaleString(),
        log.teacherCheckOut.fullName,
        log.checkInDate?.toLocaleString() || "",
        log.teacherCheckIn?.fullName! || "",
      ])
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="' + "device-logs" + new Date().toISOString() + '.csv"'
    );
    stringify(body).pipe(res);
  })
);

export default router;
