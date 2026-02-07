import { isValidObjectId } from "mongoose";
import { Student } from "@models";
import { APIFeatures } from "@utils";
import { StudentModel } from "@@types/models";
import { ParsedQueryString } from "@@types";

interface StudentsArgs {
  sort?: string;
  limit?: number;
  page?: number;
  filter?: Partial<StudentModel>;
}

const studentQueries = {
  students: async (_: any, args: StudentsArgs) => {
    const { filter = {}, ...rest } = args;
    const newArgs = Object.assign(filter, rest);
    const pqs = { ...newArgs } as ParsedQueryString;
    const query = Student.find();
    const features = new APIFeatures(query, pqs).filter().limitFields().sort().paginate();
    const students = await features.query;
    return students;
  },
  student: async (_: any, args: { id: string }) => {
    if (!isValidObjectId(args.id)) return null;
    const student = await Student.findById(args.id);
    return student;
  },
};

export default studentQueries;
