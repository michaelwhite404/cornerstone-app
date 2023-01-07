import { UserSetting } from "@models";
import { catchAsync } from "@utils";

export const getMySettings = catchAsync(async (req, res) => {
  const settings = await UserSetting.find({ user: req.employee._id }).select("-user");

  res.sendJson(200, { settings });
});
