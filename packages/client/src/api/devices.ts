import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractData } from "./client";
import { DeviceModel } from "../types/models/deviceTypes";
import { ErrorLogModel } from "../types/models/errorLogTypes";
import pluralize from "pluralize";

// Query Keys
export const deviceKeys = {
  all: ["devices"] as const,
  lists: () => [...deviceKeys.all, "list"] as const,
  list: (deviceType: string) => [...deviceKeys.lists(), deviceType] as const,
  details: () => [...deviceKeys.all, "detail"] as const,
  detail: (deviceType: string, slug: string) => [...deviceKeys.details(), deviceType, slug] as const,
};

// API Functions
const fetchDevices = async (deviceType: string, params?: Record<string, unknown>) => {
  const response = await apiClient.get<{ data: { devices: DeviceModel[] } }>("/devices", {
    params: {
      deviceType: pluralize.singular(deviceType),
      sort: "name",
      limit: 2000,
      ...params,
    },
  });
  return extractData(response).devices;
};

const fetchDevice = async (deviceType: string, slug: string) => {
  const response = await apiClient.get<{ data: { devices: DeviceModel[] } }>("/devices", {
    params: {
      deviceType: pluralize.singular(deviceType),
      slug,
      populate: "checkouts,errorLogs",
    },
  });
  return extractData(response).devices[0];
};

interface CreateErrorData {
  title: string;
  description: string;
}

const createDeviceError = async (deviceId: string, data: CreateErrorData) => {
  const response = await apiClient.post<{ data: { errorLog: ErrorLogModel; device: DeviceModel } }>(
    `/devices/${deviceId}/errors`,
    data
  );
  return extractData(response);
};

// Hooks
export const useDevices = (deviceType: string) => {
  return useQuery({
    queryKey: deviceKeys.list(deviceType),
    queryFn: () => fetchDevices(deviceType),
  });
};

export const useDevice = (deviceType: string, slug: string) => {
  return useQuery({
    queryKey: deviceKeys.detail(deviceType, slug),
    queryFn: () => fetchDevice(deviceType, slug),
    enabled: !!slug,
  });
};

export const useCreateDeviceError = (deviceType: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deviceId, data }: { deviceId: string; data: CreateErrorData }) =>
      createDeviceError(deviceId, data),
    onSuccess: () => {
      // Invalidate device list to refetch with updated error status
      queryClient.invalidateQueries({ queryKey: deviceKeys.list(deviceType) });
    },
  });
};
