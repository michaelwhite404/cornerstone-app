import { Schema, model, Model } from "mongoose";
import slugify from "slugify";
import { TextbookSetDocument } from "@@types/models";

const textbookSetSchema: Schema<TextbookSetDocument, Model<TextbookSetDocument>> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Each textbook set must have a title"],
      unique: [true, "Each textbook set must have its own title"],
      trim: true,
    },
    class: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: Number,
      required: [true, "Which grade uses this textbook set?"],
      min: 0,
      max: 12,
    },
    slug: {
      type: String,
      unique: true,
      // required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

textbookSetSchema.virtual("count", {
  ref: "Textbook",
  foreignField: "textbookSet",
  localField: "_id",
  count: true,
});

textbookSetSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const TextbookSet = model<TextbookSetDocument>("TextbookSet", textbookSetSchema);

export default TextbookSet;
