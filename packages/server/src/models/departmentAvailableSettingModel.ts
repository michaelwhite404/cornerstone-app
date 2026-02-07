import { DepartmentAvailableSettingDocument } from "@@types/models";
import { model, Schema } from "mongoose";

const availableSettingSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  helpText: String,
  constrained: {
    type: Boolean,
    required: true,
    validate: {
      validator: function (value: boolean) {
        // @ts-ignore
        !(this.dataType === "BOOLEAN" && value === true);
      },
      message: "Boolean type cannot be constrained",
    },
  },
  dataType: {
    type: String,
    enum: ["NUMBER", "STRING", "COLOR", "BOOLEAN", "MEMBERS"],
    required: true,
  },
});

availableSettingSchema.static("allowTickets", async function () {
  return await this.aggregate([
    {
      $match: {
        key: "tickets",
      },
    },
    {
      $lookup: {
        from: "departmentsettings",
        localField: "_id",
        foreignField: "setting",
        as: "result",
      },
    },
    {
      $unwind: {
        path: "$result",
      },
    },
    {
      $match: {
        "result.unconstrainedValue": true,
      },
    },
    {
      $lookup: {
        from: "departments",
        localField: "result.department",
        foreignField: "_id",
        as: "dept",
      },
    },
    {
      $project: {
        _id: {
          $first: "$dept._id",
        },
        name: {
          $first: "$dept.name",
        },
      },
    },
  ]);
});

const DepartmentAvailableSetting = model<DepartmentAvailableSettingDocument>(
  "DepartmentAvailableSetting",
  availableSettingSchema
);

export default DepartmentAvailableSetting;
