import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractData } from "./client";
import { DepartmentModel } from "../types/models";

// Query Keys
export const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  list: () => [...departmentKeys.lists()] as const,
  allowTickets: () => [...departmentKeys.all, "allow-tickets"] as const,
  details: () => [...departmentKeys.all, "detail"] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
};

// API Functions
const fetchDepartments = async () => {
  const response = await apiClient.get<{ data: { departments: DepartmentModel[] } }>(
    "/departments"
  );
  return extractData(response).departments;
};

const fetchDepartment = async (id: string) => {
  const response = await apiClient.get<{ data: { department: DepartmentModel } }>(
    `/departments/${id}`
  );
  return extractData(response).department;
};

const fetchDepartmentsAllowingTickets = async () => {
  const response = await apiClient.get<{ data: { departments: DepartmentModel[] } }>(
    "/departments/allow-tickets"
  );
  return extractData(response).departments;
};

interface CreateDepartmentData {
  name: string;
}

const createDepartment = async (data: CreateDepartmentData) => {
  const response = await apiClient.post<{ data: { department: DepartmentModel } }>(
    "/departments",
    data
  );
  return extractData(response).department;
};

// Hooks
export const useDepartments = () => {
  return useQuery({
    queryKey: departmentKeys.list(),
    queryFn: fetchDepartments,
  });
};

export const useDepartment = (id: string) => {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => fetchDepartment(id),
    enabled: !!id,
  });
};

export const useDepartmentsAllowingTickets = () => {
  return useQuery({
    queryKey: departmentKeys.allowTickets(),
    queryFn: fetchDepartmentsAllowingTickets,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};

// Add members to department
interface AddMembersData {
  departmentId: string;
  users: { id: string; role: string }[];
}

const addDepartmentMembers = async ({ departmentId, users }: AddMembersData) => {
  const response = await apiClient.post<{
    data: { members: NonNullable<DepartmentModel["members"]> };
  }>(`/departments/${departmentId}/members`, { users });
  return extractData(response).members;
};

export const useAddDepartmentMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDepartmentMembers,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(variables.departmentId) });
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};
