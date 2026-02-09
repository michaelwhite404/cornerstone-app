import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractData } from "./client";
import { ReimbursementModel } from "../types/models";

// Query Keys
export const reimbursementKeys = {
  all: ["reimbursements"] as const,
  lists: () => [...reimbursementKeys.all, "list"] as const,
  list: () => [...reimbursementKeys.lists()] as const,
  details: () => [...reimbursementKeys.all, "detail"] as const,
  detail: (id: string) => [...reimbursementKeys.details(), id] as const,
};

// API Functions
const fetchReimbursements = async () => {
  const response = await apiClient.get<{ data: { reimbursements: ReimbursementModel[] } }>(
    "/reimbursements"
  );
  return extractData(response).reimbursements;
};

const finalizeReimbursement = async ({ id, approved }: { id: string; approved: boolean }) => {
  const response = await apiClient.post<{ data: { reimbursement: ReimbursementModel } }>(
    `/reimbursements/${id}/approve`,
    { approved }
  );
  return extractData(response).reimbursement;
};

// Hooks
export const useReimbursements = () => {
  return useQuery({
    queryKey: reimbursementKeys.list(),
    queryFn: fetchReimbursements,
  });
};

export const useFinalizeReimbursement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finalizeReimbursement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reimbursementKeys.lists() });
    },
  });
};
