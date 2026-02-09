import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractData } from "./client";
import { LeaveModel } from "../types/models";

// Query Keys
export const leaveKeys = {
  all: ["leaves"] as const,
  lists: () => [...leaveKeys.all, "list"] as const,
  list: () => [...leaveKeys.lists()] as const,
  details: () => [...leaveKeys.all, "detail"] as const,
  detail: (id: string) => [...leaveKeys.details(), id] as const,
};

// API Functions
const fetchLeaves = async () => {
  const response = await apiClient.get<{ data: { leaves: LeaveModel[] } }>("/leaves");
  return extractData(response).leaves;
};

const fetchLeave = async (id: string) => {
  const response = await apiClient.get<{ data: { leave: LeaveModel } }>(`/leaves/${id}`);
  return extractData(response).leave;
};

interface CreateLeaveData {
  reason: string;
  dateStart: string;
  dateEnd: string;
  sendTo: string;
  comments?: string;
}

const createLeave = async (data: CreateLeaveData) => {
  const response = await apiClient.post<{ data: { leave: LeaveModel } }>("/leaves", data);
  return extractData(response).leave;
};

const finalizeLeave = async ({ id, approved }: { id: string; approved: boolean }) => {
  const response = await apiClient.post<{ data: { leave: LeaveModel } }>(`/leaves/${id}/approve`, {
    approved,
  });
  return extractData(response).leave;
};

// Hooks
export const useLeaves = () => {
  return useQuery({
    queryKey: leaveKeys.list(),
    queryFn: fetchLeaves,
  });
};

export const useLeave = (id: string) => {
  return useQuery({
    queryKey: leaveKeys.detail(id),
    queryFn: () => fetchLeave(id),
    enabled: !!id,
  });
};

export const useCreateLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.lists() });
    },
  });
};

export const useFinalizeLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finalizeLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.lists() });
    },
  });
};

// Generate Report
interface GenerateReportData {
  type: "sheets" | "csv" | "excel" | "pdf";
  fields: string[];
}

interface GenerateReportResponse {
  spreadsheetUrl?: string;
  blob?: Blob;
}

const generateLeaveReport = async (data: GenerateReportData): Promise<GenerateReportResponse> => {
  if (data.type === "sheets") {
    const response = await apiClient.post<{ data: { spreadsheetUrl: string } }>(
      "/leaves/generate-report",
      data
    );
    return { spreadsheetUrl: extractData(response).spreadsheetUrl };
  }
  // For blob types (csv, excel, pdf)
  const response = await apiClient.post("/leaves/generate-report", data, {
    responseType: "blob",
  });
  return { blob: response.data };
};

export const useGenerateLeaveReport = () => {
  return useMutation({
    mutationFn: generateLeaveReport,
  });
};
