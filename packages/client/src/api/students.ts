import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractData } from "./client";
import { StudentModel } from "../types/models/studentTypes";

// Types
interface FetchStudentsParams {
  sort?: string;
  limit?: number;
  status?: string;
}

// Query Keys
export const studentKeys = {
  all: ["students"] as const,
  lists: () => [...studentKeys.all, "list"] as const,
  list: (filters?: FetchStudentsParams) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, "detail"] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
};

// API Functions

const fetchStudents = async (params: FetchStudentsParams = {}) => {
  const response = await apiClient.get<{ data: { students: StudentModel[] } }>("/students", {
    params: {
      sort: "grade,lastName",
      limit: 1000,
      status: "Active",
      ...params,
    },
  });
  return extractData(response).students;
};

interface FetchStudentOptions {
  projection?: "FULL";
}

const fetchStudent = async (id: string, options: FetchStudentOptions = {}) => {
  const response = await apiClient.get<{ data: { student: StudentModel } }>(`/students/${id}`, {
    params: options.projection ? { projection: options.projection } : undefined,
  });
  return extractData(response).student;
};

interface CreateStudentData {
  firstName: string;
  lastName: string;
  schoolEmail: string;
  status: string;
  grade: string;
  password: string;
}

const createStudent = async (data: CreateStudentData) => {
  const response = await apiClient.post<{ data: { student: StudentModel } }>("/students", data);
  return extractData(response).student;
};

// Hooks
export const useStudents = (params: FetchStudentsParams = {}) => {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => fetchStudents(params),
  });
};

export const useStudent = (id: string, options: FetchStudentOptions = {}) => {
  return useQuery({
    queryKey: [...studentKeys.detail(id), options],
    queryFn: () => fetchStudent(id, options),
    enabled: !!id,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
  });
};

// Update student passwords
interface UpdateStudentPasswordData {
  students: { email: string; password: string }[];
}

const updateStudentPasswords = async (data: UpdateStudentPasswordData) => {
  const response = await apiClient.patch("/students/update-password", data);
  return response.data;
};

export const useUpdateStudentPasswords = () => {
  return useMutation({
    mutationFn: updateStudentPasswords,
  });
};
