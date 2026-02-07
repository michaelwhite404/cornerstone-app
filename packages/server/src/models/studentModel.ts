import { model, Schema } from "mongoose";
import slugify from "slugify";
import { StudentDocument } from "@@types/models";

const studentSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "A student must have a first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "A student must have a last name"],
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    grade: {
      type: Number,
      min: 0,
      max: 12,
      required: [
        function () {
          // @ts-ignore
          return this.status === "Active";
        },
        "Active students must have a grade",
      ] as [() => boolean, string],
    },
    schoolEmail: {
      type: String,
      required: true,
      validate: (value: any) =>
        typeof value === "string" && value.endsWith("@cornerstone-schools.org"),
    },
    personalEmail: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Inactive", "Graduate"],
    },
    customID: {
      type: String,
      required: false,
    },
    googleId: String,
    mainPhoto: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: () => Date.now(),
      select: false,
    },
    lastUpdate: {
      type: Date,
      default: () => Date.now(),
      select: false,
    },
    slug: String,
    aftercare: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

studentSchema.virtual("textbooks", {
  ref: "Textbook",
  foreignField: "lastUser",
  localField: "_id",
  match: { status: "Checked Out" },
});

studentSchema.virtual("devices", {
  ref: "Device",
  foreignField: "lastUser",
  localField: "_id",
  match: { $or: [{ status: "Assigned" }, { status: "Checked Out" }] },
});

studentSchema.pre<StudentDocument>("save", function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  this.slug = slugify(this.fullName, { lower: true });
  next();
});

/** Student Model */
const Student = model<StudentDocument>("Student", studentSchema);

export default Student;
