import { Department, Employee } from "@models";
import { DepartmentMemberDocument } from "@@types/models";
import { Schema, Types, model, ObjectId } from "mongoose";
import FKHelper from "./helpers/foreignKeyHelper";

const departmentMemberSchema = new Schema({
  department: {
    type: Types.ObjectId,
    ref: "Department",
    validate: {
      validator: async (id: ObjectId) => FKHelper(Department, id),
    },
    required: true,
  },
  member: {
    type: Types.ObjectId,
    ref: "Employee",
    validate: {
      validator: async (id: ObjectId) => FKHelper(Employee, id),
    },
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["LEADER", "MEMBER"],
  },
});

departmentMemberSchema.pre(["find", "findOne"], function () {
  this.populate({
    path: "member",
    select: "fullName email",
  });
});

departmentMemberSchema.index({ department: 1, member: 1 }, { unique: true });

const DepartmentMember = model<DepartmentMemberDocument>(
  "DepartmentMember",
  departmentMemberSchema
);

export default DepartmentMember;
