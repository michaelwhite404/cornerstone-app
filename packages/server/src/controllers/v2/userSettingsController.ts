import { Setting, UserSetting } from "@models";
import { AppError, catchAsync, isObject, settingValueValid } from "@utils";

export const getMySettings = catchAsync(async (req, res) => {
  const settings = await UserSetting.find({ user: req.employee._id }).select("-user");

  res.sendJson(200, { settings });
});

export const updateMySetting = catchAsync(async (req, res, next) => {
  /* 
    req: {
      body: {
        setting: "setting.user.notification.TicketCheckInEmail"
      }
    }
  */
  const { settingName, value } = req.body;
  if (!isObject(value))
    return next(new AppError("Value property must be an object of field properties", 400));
  const setting = await Setting.findOne({ settingName, settingType: /^user/ });

  if (!setting) return next(new AppError("There is no setting with this name", 404));
  const newValue: { [x: string]: any } = {};
  const { fieldDescriptions } = setting;

  for (const fieldData of fieldDescriptions) {
    const { field, knownValueDescriptions, type } = fieldData;
    const newFieldValue = value[field];
    if (newFieldValue === undefined)
      return next(new AppError(`Value must have a valid field argument for '${field}'`, 400));
    if (!settingValueValid(newFieldValue, type, knownValueDescriptions)) {
      return next(new AppError("One or more fields has an invalid value", 400));
    }
    newValue[field] = newFieldValue;
  }
  // Values are valid
  const userSetting = await UserSetting.findOneAndUpdate(
    { user: req.employee, settingName },
    {
      user: req.employee,
      type: setting.settingType,
      settingName,
      value: newValue,
    },
    { new: true, upsert: true }
  ).select("-user -__v");

  res.sendJson(200, { userSetting });
});
