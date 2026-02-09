import { useCallback, useState } from "react";
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

// Class/Grade selection hook (pure data + state, no UI components)
interface StudentInClass {
  id: string;
  fullName: string;
}

interface ClassGroup {
  grade: number;
  students: StudentInClass[];
}

const GRADES = [
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
];

export function useClassSelection(initialClasses?: ClassGroup[]) {
  const [gradePicked, setGradePicked] = useState(-1);
  const [studentPicked, setStudentPicked] = useState("-1");

  const { data: fetchedClasses, isSuccess } = useStudentsByGrade();

  const classes = initialClasses || (fetchedClasses as ClassGroup[]) || [];
  const loaded = Boolean(initialClasses) || isSuccess;

  // Grade options for select
  const gradeOptions = [
    { value: "-1", label: "Select a grade" },
    ...GRADES.map((label, i) => ({
      value: String(i),
      label: i === 0 ? "Kindergarten" : label,
    })),
  ];

  // Student options based on selected grade
  const studentOptions =
    gradePicked === -1 || classes.length === 0
      ? [{ value: "-1", label: "Select A Student" }]
      : [
          { value: "-1", label: "Select A Student" },
          ...classes[gradePicked].students.map((s) => ({
            value: s.id,
            label: s.fullName,
          })),
        ];

  const changeGrade = (grade: number) => {
    setGradePicked(grade);
    setStudentPicked("-1");
  };

  const changeStudent = (studentId: string) => {
    setStudentPicked(studentId);
  };

  const reset = useCallback(() => {
    setGradePicked(-1);
    setStudentPicked("-1");
  }, []);

  return {
    classes,
    loaded,
    gradePicked,
    studentPicked,
    gradeOptions,
    studentOptions,
    setGradePicked,
    setStudentPicked,
    changeGrade,
    changeStudent,
    reset,
  };
}

// Students grouped by grade (for class selection)
interface StudentInClass {
  id: string;
  fullName: string;
}

interface ClassGroup {
  grade: number;
  students: StudentInClass[];
}

const fetchStudentsByGrade = async () => {
  const response = await apiClient.get<{ data: { grades: ClassGroup[] } }>("/students/group");
  return extractData(response).grades;
};

export const useStudentsByGrade = () => {
  return useQuery({
    queryKey: [...studentKeys.all, "byGrade"] as const,
    queryFn: fetchStudentsByGrade,
  });
};
