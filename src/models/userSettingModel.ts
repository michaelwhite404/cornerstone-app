import { UserSettingDocument } from "@@types/models";
import { Model, model, Schema } from "mongoose";

const userSettingSchema: Schema<UserSettingDocument, Model<UserSettingDocument>> = new Schema({
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

const UserSetting = model<UserSettingDocument>("UserSetting", userSettingSchema);

export default UserSetting;
