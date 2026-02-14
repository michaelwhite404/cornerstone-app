import { Request, Response, Router } from "express";
import { stringify } from "csv-stringify";
import { authController } from "@controllers/v2";
import { ParsedQueryString, PopOptions } from "@@types";
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
    // Create query options with defaults (don't mutate req.query - immutable in Express 5)
    const queryOptions: ParsedQueryString = {
      ...req.query,
      limit: (req.query.limit as string) || "10000",
      fields: undefined,
      sort: "-checkOutDate -checkInDate",
    };

    const query = CheckoutLog.find(filter);
    if (populate) query.populate(populate);
    const features = new APIFeatures(query, queryOptions).filter().limitFields().sort().paginate();
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
