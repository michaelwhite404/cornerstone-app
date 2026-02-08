import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractData } from "./client";
import {
  DepartmentModel,
  DepartmentAvailableSettingModel,
  DepartmentSetting,
} from "../types/models";

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

// Delete department member
const deleteDepartmentMember = async ({
  departmentId,
  memberId,
}: {
  departmentId: string;
  memberId: string;
}) => {
  const response = await apiClient.delete(`/departments/${departmentId}/members/${memberId}`);
  return response.data;
};

export const useDeleteDepartmentMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDepartmentMember,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(variables.departmentId) });
    },
  });
};

// Update department member role
const updateDepartmentMember = async ({
  departmentId,
  memberId,
  role,
}: {
  departmentId: string;
  memberId: string;
  role: string;
}) => {
  const response = await apiClient.patch(`/departments/${departmentId}/members/${memberId}`, {
    role,
  });
  return response.data;
};

export const useUpdateDepartmentMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDepartmentMember,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(variables.departmentId) });
    },
  });
};

// Department Settings
const fetchAvailableSettings = async () => {
  const response = await apiClient.get<{
    data: { availableSettings: DepartmentAvailableSettingModel[] };
  }>("/departments/settings");
  return extractData(response).availableSettings;
};

const fetchDepartmentSettings = async (departmentId: string) => {
  const response = await apiClient.get<{ data: { settings: DepartmentSetting[] } }>(
    `/departments/${departmentId}/settings`
  );
  return extractData(response).settings;
};

export const useAvailableSettings = () => {
  return useQuery({
    queryKey: [...departmentKeys.all, "availableSettings"] as const,
    queryFn: fetchAvailableSettings,
  });
};

export const useDepartmentSettings = (departmentId: string) => {
  return useQuery({
    queryKey: [...departmentKeys.detail(departmentId), "settings"] as const,
    queryFn: () => fetchDepartmentSettings(departmentId),
    enabled: !!departmentId,
  });
};
