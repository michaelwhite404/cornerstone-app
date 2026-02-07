import { model, Model, Schema, Types } from "mongoose";
import { Device } from "@models";
import { AppError } from "@utils";
import { ErrorLogDocument } from "@@types/models";

const errorLogSchema: Schema<ErrorLogDocument, Model<ErrorLogDocument>> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Each error must have a title"],
      immutable: true,
    },
    device: {
      type: Types.ObjectId,
      ref: "Device",
      required: [true, "Each error must have a device."],
      immutable: true,
    },
    checkInInfo: {
      type: Types.ObjectId,
      ref: "DeviceLog",
      required: false,
      immutable: true,
    },
    description: {
      type: String,
      required: [true, "Please describe the device's error."],
      maxlength: 500,
      immutable: true,
    },
    updates: [
      {
        description: {
          type: String,
          maxlength: 500,
          required: [true, "Please describe the update to the device error"],
        },
        createdAt: {
          type: Date,
          default: () => Date.now(),
        },
        status: String,
      },
    ],
    final: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      required: true,
      default: "Broken",
      enum: ["Broken", "In Repair", "Fixed", "Unfixable"],
    },
    createdAt: {
      type: Date,
      default: () => Date.now(),
      required: true,
      immutable: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

errorLogSchema.index({ device: 1 });

errorLogSchema.pre("save", async function (next) {
  if (this.isNew) {
    const device = await Device.findById(this.device);
    if (!device) {
      return next(new AppError("No device found with that ID", 404));
    }
    if (device.status === "Checked Out" && this.$locals.notCheckOut) {
      return next(new AppError(`Create an error when checking in ${device.deviceType}`, 400));
    }
    this.$locals.wasNew = this.isNew;
  }
});

errorLogSchema.post("save", async function () {
  if (this.$locals.wasNew) await Device.findByIdAndUpdate(this.device, { status: "Broken" });
});

/** Error Log Model */
const ErrorLog = model<ErrorLogDocument>("ErrorLog", errorLogSchema);

export default ErrorLog;
