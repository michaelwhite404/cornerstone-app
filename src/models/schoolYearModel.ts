import { model, Schema } from "mongoose";

const schoolYearSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  current: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  quarters: [
    {
      _id: false,
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
  ],
});

const SchoolYear = model("SchoolYear", schoolYearSchema);

export default SchoolYear;
