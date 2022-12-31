import { model, Schema } from "mongoose";

const userSettingSchema = new Schema({
  setting: {
    type: Schema.Types.ObjectId,
    ref: "Setting",
    required: [true, "Each user setting must reference a setting"],
    immutable: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: [true, "Each user setting must reference a user"],
    immutable: true,
  },
  type: { type: String, required: true },
  settingName: { type: String, required: true },
  value: Schema.Types.Mixed,
});

const UserSetting = model("UserSetting", userSettingSchema);

export default UserSetting;
