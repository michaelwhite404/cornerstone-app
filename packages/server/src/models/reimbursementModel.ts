import { ReimbursementDocument } from "@@types/models";
import { Model, model, Schema, Types } from "mongoose";

const reimbursementSchema: Schema<ReimbursementDocument, Model<ReimbursementDocument>> = new Schema(
  {
    payee: {
      type: String,
      required: true,
      minLength: 1,
    },
    user: {
      type: Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: (amount: number) => Number.isInteger(amount),
        message: "`amount` must be an integer",
      },
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zip: {
        type: String,
        required: true,
      },
    },
    purpose: {
      type: String,
      required: true,
    },
    dateNeeded: {
      type: Date,
      required: false,
    },
    specialInstructions: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
    receipt: {
      type: String,
    },
    sendTo: {
      type: Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    approval: {
      user: {
        type: Types.ObjectId,
        ref: "Employee",
        // required: true,
      },
      date: {
        type: Date,
      },
      approved: {
        type: Boolean,
        // required: true,
      },
    },
    message: {
      type: String,
      select: false,
    },
  }
);

const Reimbursement = model<ReimbursementDocument>("Reimbursement", reimbursementSchema);

export default Reimbursement;
