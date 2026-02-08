import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { apiClient, extractData } from "./client";
import { DeviceModel } from "../types/models/deviceTypes";
import { ErrorLogModel } from "../types/models/errorLogTypes";
import { Brand, Totals } from "../types/brand";
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

// Device Logs
interface CheckoutLogModel {
  _id: string;
  device: DeviceModel;
  deviceUser: { fullName: string };
  checkOutDate: string;
  checkInDate?: string;
  teacherCheckOut?: { fullName: string };
  teacherCheckIn?: { fullName: string };
  checkedIn: boolean;
  error?: boolean;
}

const fetchDeviceLogs = async () => {
  const response = await apiClient.get<{ data: { deviceLogs: CheckoutLogModel[] } }>("/devices/logs", {
    params: {
      sort: "-checkOutDate -checkInDate",
      limit: 10000,
    },
  });
  return extractData(response).deviceLogs;
};

export const useDeviceLogs = () => {
  return useQuery({
    queryKey: [...deviceKeys.all, "logs"] as const,
    queryFn: fetchDeviceLogs,
  });
};

// Device Stats (v1 API)
const fetchDeviceStats = async (deviceType: string) => {
  // Use axios directly for v1 API since apiClient is configured for v2
  const response = await axios.get<{ data: { brands: Brand[]; totals: Totals } }>(
    `/api/v1/${deviceType}/test/group`
  );
  return response.data.data;
};

export const useDeviceStats = (deviceType: string) => {
  return useQuery({
    queryKey: [...deviceKeys.all, "stats", deviceType] as const,
    queryFn: () => fetchDeviceStats(deviceType),
    enabled: !!deviceType,
  });
};
