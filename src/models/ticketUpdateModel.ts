import { model, Schema, Types } from "mongoose";

const ticketSchema /*:  Schema<TicketDocument, Model<TicketDocument>> */ = new Schema({
  // type: {
  //   type: String,
  //   enum: ["COMMENT", "ASSIGN", "TAG", "STATUS"],
  //   // required: [true, "Each update must have an update type"],
  // },
  date: {
    type: Date,
    default: () => new Date(),
    // required: true,
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "Employee",
    // required: true,
  },
  ticket: {
    type: Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
});

const TicketUpdate = model("TicketUpdate", ticketSchema);

export const TicketComment = TicketUpdate.discriminator(
  "COMMENT",
  new Schema({
    comment: {
      type: String,
      required: true,
    },
  })
);

export const TicketAssign = TicketUpdate.discriminator(
  "ASSIGN",
  new Schema({
    assign: {
      type: Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    op: {
      type: String,
      required: true,
      enum: ["ADD", "REMOVE"],
    },
  })
);

export const TicketTag = TicketUpdate.discriminator(
  "TAG",
  new Schema({
    tag: {
      type: String,
      required: true,
    },
    op: {
      type: String,
      required: true,
      enum: ["ADD", "REMOVE"],
    },
  })
);

export const TicketStatus = TicketUpdate.discriminator(
  "STATUS",
  new Schema({
    status: {
      // required: true,
      enum: ["OPEN", "CLOSED"],
    },
  })
);
