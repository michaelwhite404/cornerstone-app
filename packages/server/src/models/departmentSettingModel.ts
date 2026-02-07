import { Department, DepartmentAllowedSetting, DepartmentAvailableSetting } from "@models";
import { DepartmentSettingDocument, IDepartmentSettingModel } from "@@types/models";
import { Model, model, ObjectId, Schema, Types } from "mongoose";
import FKHelper from "./helpers/foreignKeyHelper";

const departmentSettingSchema: Schema<
  DepartmentSettingDocument,
  Model<DepartmentSettingDocument>
> = new Schema({
  department: {
    type: Types.ObjectId,
    ref: "Department",
    required: true,
    validate: {
      validator: async (id: ObjectId) => FKHelper(Department, id),
    },
  },
  setting: {
    type: Types.ObjectId,
    ref: "DepartmentAvailableSetting",
    required: true,
    validate: { validator: async (id: ObjectId) => FKHelper(DepartmentAvailableSetting, id) },
  },
  allowedSettingValue: {
    type: Types.ObjectId,
    ref: "DepartmentAllowedSettingValue",
    validate: { validator: async (id: ObjectId) => FKHelper(DepartmentAllowedSetting, id) },
  },
  unconstrainedValue: {
    type: Schema.Types.Mixed,
  },
});

departmentSettingSchema.index({ department: 1, setting: 1 }, { unique: true });

departmentSettingSchema.static("getDepartmentSettings", async function (departmentId: string) {
  return await this.aggregate([
    {
      $match: {
        department: new Types.ObjectId(departmentId),
      },
    },
    {
      $lookup: {
        from: "departmentavailablesettings",
        localField: "setting",
        foreignField: "_id",
        as: "set",
        pipeline: [
          {
            $project: {
              key: 1,
              description: 1,
              helpText: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "departmentallowedsettingvalues",
        localField: "allowedSettingValue",
        foreignField: "_id",
        as: "aSV",
      },
    },
    {
      $unwind: {
        path: "$set",
      },
    },
    {
      $unwind: {
        path: "$aSV",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        key: "$set.key",
        description: "$set.description",
        helpText: "$set.helpText",
        value: {
          $ifNull: ["$unconstrainedValue", "$aSV.value"],
        },
        caption: "$aSV.caption",
      },
    },
  ]);
});

const DepartmentSetting = model<DepartmentSettingDocument, IDepartmentSettingModel>(
  "DepartmentSetting",
  departmentSettingSchema
);

export default DepartmentSetting;
