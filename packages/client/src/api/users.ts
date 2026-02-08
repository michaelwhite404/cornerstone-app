import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractData } from "./client";
import { EmployeeModel, UserGroup } from "../types/models";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params?: FetchUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  me: () => [...userKeys.all, "me"] as const,
  meWithGroups: () => [...userKeys.me(), "groups"] as const,
};

// Types
interface FetchUsersParams {
  status?: string;
  sort?: string;
  limit?: number;
}

interface UserWithGroups extends EmployeeModel {
  groups: UserGroup[];
}

// API Functions
const fetchUsers = async (params: FetchUsersParams = {}) => {
  const response = await apiClient.get<{ data: { users: EmployeeModel[] } }>("/users", {
    params: {
      sort: "lastName",
      limit: 1000,
      ...params,
    },
  });
  return extractData(response).users;
};

const fetchUser = async (id: string) => {
  const response = await apiClient.get<{ data: { user: EmployeeModel } }>(`/users/${id}`);
  return extractData(response).user;
};

const fetchCurrentUser = async () => {
  const response = await apiClient.get<{ data: { user: EmployeeModel } }>("/users/me");
  return extractData(response).user;
};

const fetchCurrentUserWithGroups = async () => {
  const response = await apiClient.get<{ data: { user: UserWithGroups } }>("/users/me", {
    params: { projection: "FULL" },
  });
  const user = extractData(response).user;
  // Sort groups by name
  if (user.groups) {
    user.groups.sort((a, b) => {
      const nameA = (a.name || "").toUpperCase();
      const nameB = (b.name || "").toUpperCase();
      return nameA.localeCompare(nameB);
    });
  }
  return user;
};

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

const updateUser = async ({ id, data }: { id: string; data: UpdateUserData }) => {
  const response = await apiClient.patch<{ data: { user: EmployeeModel } }>(`/users/${id}`, data);
  return extractData(response).user;
};

// Hooks
export const useUsers = (params: FetchUsersParams = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => fetchUsers(params),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: fetchCurrentUser,
  });
};

export const useCurrentUserWithGroups = () => {
  return useQuery({
    queryKey: userKeys.meWithGroups(),
    queryFn: fetchCurrentUserWithGroups,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
