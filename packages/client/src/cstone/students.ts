import { APIStudentsResponse } from "../types/apiResponses";
import axiosInstance from "./axiosInstance";

export async function list({ limit = 1000, page = 1 }: { limit?: number; page?: number }) {
  const res = await axiosInstance.get<APIStudentsResponse>("/students", {
    params: {
      page,
      limit,
      sort: "grade,lastName",
      status: "Active",
    },
  });
  return res.data.data.students;
}

const students = { list };

export default students;
