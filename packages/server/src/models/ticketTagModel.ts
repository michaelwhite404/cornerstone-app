import { Model, model, Schema } from "mongoose";
import validator from "validator";
import { TicketTagDocument } from "@@types/models";

const ticketTagSchema: Schema<TicketTagDocument, Model<TicketTagDocument>> = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  color: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isHexColor(value),
      message: "{{VALUE}} is not a valid hex color",
    },
  },
});

ticketTagSchema.pre("save", function () {
  if (!this.color.startsWith("#")) this.color = "#" + this.color;
});

const TicketTag = model<TicketTagDocument>("TicketTag", ticketTagSchema);

export default TicketTag;
