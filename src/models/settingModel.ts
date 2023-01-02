import { model, Schema } from "mongoose";

const settingSchema = new Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  settingName: { type: String, required: true },
  settingType: { type: String, required: true },
  fieldDescriptions: [
    {
      field: { type: String, required: true },
      fieldDescription: { type: String, default: "N/A" },
      name: { type: String, required: true },
      defaultValue: { type: String, required: false },
      knownValueDescriptions: [{ value: String, description: String }],
      type: {
        type: String,
        required: true,
        enum: [
          "TYPE_ENUM",
          "TYPE_BOOL",
          "TYPE_STRING",
          "TYPE_DOUBLE",
          "TYPE_FLOAT",
          "TYPE_INT32",
          "TYPE_INT64",
          "TYPE_ENUM_ARRAY",
        ],
      },
    },
  ],
});

const Setting = model("Setting", settingSchema);

export default Setting;
