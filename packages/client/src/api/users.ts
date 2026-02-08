import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { admin_directory_v1 } from "googleapis";
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
  active?: boolean;
  sort?: string;
  limit?: number;
  timesheetEnabled?: boolean;
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

interface FetchUserOptions {
  projection?: "FULL";
}

const fetchUser = async (id: string, options: FetchUserOptions = {}) => {
  const response = await apiClient.get<{ data: { user: EmployeeModel } }>(`/users/${id}`, {
    params: options.projection ? { projection: options.projection } : undefined,
  });
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

interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  role: string;
  homeroomGrade?: number | string;
  timesheetEnabled?: boolean;
  password: string;
  changePasswordAtNextLogin?: boolean;
}

const createUser = async (data: CreateUserData) => {
  const response = await apiClient.post<{ data: { user: EmployeeModel } }>("/users", data);
  return extractData(response).user;
};

// Hooks
export const useUsers = (params: FetchUsersParams = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => fetchUsers(params),
  });
};

export const useUser = (id: string, options: FetchUserOptions = {}) => {
  return useQuery({
    queryKey: [...userKeys.detail(id), options],
    queryFn: () => fetchUser(id, options),
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

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// Update password
interface UpdatePasswordData {
  password: string;
  passwordConfirm: string;
}

const updatePassword = async (data: UpdatePasswordData) => {
  const response = await apiClient.patch("/users/update-password", data);
  return response.data;
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updatePassword,
  });
};

// Fetch Google Directory users
const fetchGoogleUsers = async (active?: boolean) => {
  const response = await apiClient.get<{ data: { users: admin_directory_v1.Schema$User[] } }>(
    "/users/from-google",
    { params: active !== undefined ? { active } : undefined }
  );
  return extractData(response).users;
};

export const useGoogleUsers = (active?: boolean) => {
  return useQuery({
    queryKey: [...userKeys.all, "google", { active }] as const,
    queryFn: () => fetchGoogleUsers(active),
  });
};

// Update user settings
interface UpdateSettingData {
  settingName: string;
  value: boolean;
}

const updateUserSetting = async (data: UpdateSettingData) => {
  const response = await apiClient.patch("/users/me/settings", data);
  return response.data;
};

export const useUpdateUserSetting = () => {
  return useMutation({
    mutationFn: updateUserSetting,
  });
};
