import { Model, model, Schema } from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import { EmployeeDocument } from "@@types/models";

const employeeSchema: Schema<EmployeeDocument, Model<EmployeeDocument>> = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "An employee must have a first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "An employee must have a last name"],
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "An employee must have an email address"],
      unique: true,
    },
    homeroomGrade: {
      type: Number,
      required: false,
      min: 0,
      max: 12,
    },
    title: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: ["Super Admin", "Admin", "Development", "Instructor", "Intern", "Maintenance"],
        message:
          "Role must be: Super Admin, Admin, Development, Instructor, Intern, or Maintenance",
      },
    },
    image: String,
    googleId: String,
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: false /* [true, "Please confirm your password"], */,
      validate: {
        // This only works on CREATE or SAVE
        validator: function (val: string): boolean {
          // @ts-ignore
          return val === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    createdAt: {
      type: Date,
      default: () => new Date(),
      select: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    slug: String,
    timesheetEnabled: {
      type: Boolean,
      default: false,
    },
    space: {
      type: String,
      required: false,
      // select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

employeeSchema.virtual("departments", {
  ref: "DepartmentMember",
  localField: "_id",
  foreignField: "member",
});

employeeSchema.method("isLeader", function (departmentName: string) {
  return this.departments?.some((d) => d.name === departmentName && d.role === "LEADER") || false;
});

employeeSchema.pre<EmployeeDocument>("save", function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  this.slug = slugify(this.fullName, { lower: true });
  next();
});

employeeSchema.pre<EmployeeDocument>("save", async function (next) {
  // Only run if password is modified
  if (!this.isModified("password")) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password!, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

employeeSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

employeeSchema.pre<EmployeeDocument>("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

employeeSchema.pre<Model<EmployeeDocument>>(/^find/, function (next) {
  // this.find({ active: { $ne: false } });
  next();
});

employeeSchema.methods.changedPasswordAfter = function (JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);

    // console.log(changedTimeStamp, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }

  // FALSE means NOT changed
  return false;
};

employeeSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

const Employee = model<EmployeeDocument>("Employee", employeeSchema);

export default Employee;
