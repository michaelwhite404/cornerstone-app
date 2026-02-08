import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractData } from "./client";
import { AftercareAttendanceEntryModel, StudentModel } from "../types/models";
import { AttendanceEntry, CurrentSession } from "../types/aftercareTypes";

// Query Keys
export const aftercareKeys = {
  all: ["aftercare"] as const,
  sessions: () => [...aftercareKeys.all, "sessions"] as const,
  sessionByDate: (year: number, month: number, day: number) =>
    [...aftercareKeys.sessions(), year, month, day] as const,
  students: () => [...aftercareKeys.all, "students"] as const,
  studentList: () => [...aftercareKeys.students(), "list"] as const,
  studentDetail: (id: string) => [...aftercareKeys.students(), id] as const,
  stats: () => [...aftercareKeys.all, "stats"] as const,
};

// Types
interface AttendanceStats {
  student: StudentModel & { aftercare: boolean };
  entriesCount: number;
  lateCount: number;
}

// API Functions
const fetchSessionByDate = async (year: number, month: number, day: number) => {
  const response = await apiClient.get<{ data: { entries: AttendanceEntry[] } }>(
    `/aftercare/attendance/year/${year}/month/${month}/day/${day}`
  );
  return extractData(response).entries;
};

const fetchAftercareStats = async (since?: string) => {
  const response = await apiClient.get<{ data: { stats: AttendanceStats[] } }>(
    "/aftercare/attendance/stats",
    { params: since ? { since } : undefined }
  );
  return extractData(response).stats;
};

const fetchStudentAftercareEntries = async (studentId: string) => {
  const response = await apiClient.get<{ data: { entries: AftercareAttendanceEntryModel[] } }>(
    `/aftercare/students/${studentId}`
  );
  return extractData(response).entries;
};

interface UpdateStudentAftercareData {
  data: { id: string; op: "add" | "remove" }[];
}

const updateStudentAftercare = async (data: UpdateStudentAftercareData) => {
  const response = await apiClient.patch("/aftercare/students", data);
  return response.data;
};

const fetchAftercareStudents = async () => {
  const response = await apiClient.get<{ data: { students: StudentModel[] } }>(
    "/aftercare/students"
  );
  return extractData(response).students;
};

const startSession = async (students: string[]) => {
  const response = await apiClient.post<{ data: CurrentSession }>(
    "/aftercare/session",
    { students }
  );
  return extractData(response);
};

const fetchTodaySession = async () => {
  const response = await apiClient.get<{ data: CurrentSession }>(
    "/aftercare/session/today"
  );
  return extractData(response);
};

// Hooks
export const useAftercareSession = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return useQuery({
    queryKey: aftercareKeys.sessionByDate(year, month, day),
    queryFn: () => fetchSessionByDate(year, month, day),
  });
};

export const useAftercareStats = (since?: string) => {
  return useQuery({
    queryKey: [...aftercareKeys.stats(), since],
    queryFn: () => fetchAftercareStats(since),
  });
};

export const useStudentAftercareEntries = (studentId: string) => {
  return useQuery({
    queryKey: aftercareKeys.studentDetail(studentId),
    queryFn: () => fetchStudentAftercareEntries(studentId),
    enabled: !!studentId,
  });
};

export const useUpdateStudentAftercare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentAftercare,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aftercareKeys.students() });
      queryClient.invalidateQueries({ queryKey: aftercareKeys.stats() });
    },
  });
};

export const useAftercareStudents = () => {
  return useQuery({
    queryKey: aftercareKeys.studentList(),
    queryFn: fetchAftercareStudents,
  });
};

export const useStartSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aftercareKeys.sessions() });
    },
  });
};

export const useTodaySession = () => {
  return useQuery({
    queryKey: [...aftercareKeys.sessions(), "today"] as const,
    queryFn: fetchTodaySession,
  });
};
