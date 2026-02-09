import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractData } from "./client";
import { TimesheetModel } from "../types/models";

// Types
interface FetchTimesheetsParams {
  status?: string;
  sort?: string;
  employee?: string;
  "timeStart[gte]"?: string | Date;
  "timeStart[lte]"?: string | Date;
}

// Query Keys
export const timesheetKeys = {
  all: ["timesheets"] as const,
  lists: () => [...timesheetKeys.all, "list"] as const,
  list: (params?: FetchTimesheetsParams) => [...timesheetKeys.lists(), params] as const,
  details: () => [...timesheetKeys.all, "detail"] as const,
  detail: (id: string) => [...timesheetKeys.details(), id] as const,
};

// API Functions

const fetchTimesheets = async (params: FetchTimesheetsParams = {}) => {
  const response = await apiClient.get<{ data: { timesheetEntries: TimesheetModel[] } }>(
    "/timesheets",
    { params }
  );
  return extractData(response).timesheetEntries;
};

const fetchTimesheet = async (id: string) => {
  const response = await apiClient.get<{ data: { timesheetEntry: TimesheetModel } }>(
    `/timesheets/${id}`
  );
  return extractData(response).timesheetEntry;
};

interface CreateTimesheetData {
  description: string;
  department: string;
  timeStart: string;
  timeEnd: string;
}

const createTimesheet = async (data: CreateTimesheetData) => {
  const response = await apiClient.post<{ data: { timesheetEntry: TimesheetModel } }>(
    "/timesheets",
    data
  );
  return extractData(response).timesheetEntry;
};

interface UpdateTimesheetData {
  id: string;
  data: Partial<CreateTimesheetData>;
}

const updateTimesheet = async ({ id, data }: UpdateTimesheetData) => {
  const response = await apiClient.patch<{ data: { timesheetEntry: TimesheetModel } }>(
    `/timesheets/${id}`,
    data
  );
  return extractData(response).timesheetEntry;
};

interface FinalizeTimesheetsData {
  approve?: string[];
  reject?: string[];
}

const finalizeTimesheets = async (data: FinalizeTimesheetsData) => {
  const response = await apiClient.patch<{ data: { message: string } }>(
    "/timesheets/approve",
    data
  );
  return extractData(response).message;
};

// Hooks
export const useTimesheets = (params: FetchTimesheetsParams = {}) => {
  return useQuery({
    queryKey: timesheetKeys.list(params),
    queryFn: () => fetchTimesheets(params),
  });
};

export const useTimesheet = (id: string) => {
  return useQuery({
    queryKey: timesheetKeys.detail(id),
    queryFn: () => fetchTimesheet(id),
    enabled: !!id,
  });
};

export const useCreateTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTimesheet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timesheetKeys.lists() });
    },
  });
};

export const useUpdateTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTimesheet,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: timesheetKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: timesheetKeys.lists() });
    },
  });
};

export const useFinalizeTimesheets = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finalizeTimesheets,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timesheetKeys.lists() });
    },
  });
};
