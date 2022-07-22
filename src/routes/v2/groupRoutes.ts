import { Router } from "express";
// import { employeeController, authController as v2auth } from "@controllers/v2";
import { admin, catchAsync } from "@utils";

const groupRouter = Router();

groupRouter.get("/");
groupRouter.get(
  "/:email",
  catchAsync(async (req, res, _2) => {
    const { email } = req.params;
    const response = await admin.groups.list({
      userKey: email,
    });
    const groups = response.data.groups || [];
    res.sendJson(200, {
      groups,
    });
  })
);

export default groupRouter;
