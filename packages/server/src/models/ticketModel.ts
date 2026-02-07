import { TicketDocument } from "@@types/models";
import { Model, model, ObjectId, Schema, Types } from "mongoose";
import FKHelper from "@models/helpers/foreignKeyHelper";
import { Department } from "@models";
import Increment from "./incrementModel";

const statusEnum = ["OPEN", "CLOSED"];

const validDepartmentValidation = {
  validator: async (id: ObjectId) => FKHelper(Department, id),
};

const ticketSchema: Schema<TicketDocument, Model<TicketDocument>> = new Schema(
  {
    ticketId: {
      type: Number,
      min: 100,
      immutable: true,
    },
    title: {
      type: String,
      maxlength: 256,
      required: [true, "Each error must have a title"],
      immutable: true,
    },
    description: {
      type: String,
      required: [true, "Each ticket must have an description of the issue"],
      immutable: true,
    },
    department: {
      type: Types.ObjectId,
      ref: "Department",
      maxlength: 500,
      required: [true, "Each ticket must be associated with a department"],
      validate: [validDepartmentValidation],
    },
    status: {
      type: String,
      enum: statusEnum,
      required: [true, "Each ticket must have a status"],
    },
    priority: {
      type: String,
      enum: ["URGENT", "HIGH", "MEDIUM", "LOW"],
      required: [true, "Each ticket must have a priority level"],
    },
    submittedBy: {
      type: Types.ObjectId,
      ref: "Employee",
      required: [true, "Each ticket must be associated with a department"],
      immutable: true,
    },
    assignedTo: [
      {
        type: Types.ObjectId,
        ref: "Employee",
      },
    ],
    tags: [{ type: Types.ObjectId, ref: "TicketTag" }],
    createdAt: {
      type: Date,
      default: () => Date.now(),
      required: true,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: () => Date.now(),
      required: true,
    },

    closedBy: {
      type: Types.ObjectId,
      ref: "Employee",
    },
    closedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ticketSchema.virtual("updates", {
  ref: "TicketUpdate",
  foreignField: "ticket",
  localField: "_id",
  match: (ticket: TicketDocument) => ({ ticket: ticket._id }),
});

ticketSchema.pre("save", async function (next) {
  if (this.isNew) {
    const id = await Increment.getNextId("Ticket", 100);
    this.ticketId = id; // Incremented
  }
  next();
});

const Ticket: Model<TicketDocument> = model<TicketDocument>("Ticket", ticketSchema);

export default Ticket;
