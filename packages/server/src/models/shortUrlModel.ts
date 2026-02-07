import { model, Schema, Types } from "mongoose";
import nanoid from "nanoid";
import validator from "validator";
import { ShortUrlDocument } from "@@types/models";

const shortUrlSchema = new Schema({
  full: {
    type: String,
    required: true,
    validate: {
      validator: (value: any) => validator.isURL(value),
      message: "'{VALUE}' is not a valid URL",
    },
  },
  short: {
    type: String,
    required: true,
    unique: true,
    default: () => nanoid.nanoid(8),
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  createdBy: {
    type: Types.ObjectId,
    required: true,
    ref: "Employee",
  },
  qr_clicks: {
    type: Number,
    default: 0,
  },
});

const ShortUrl = model<ShortUrlDocument>("shortUrl", shortUrlSchema);

export default ShortUrl;
