import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { apiClient, extractData } from "./client";
import { DeviceModel } from "../types/models/deviceTypes";
import { ErrorLogModel } from "../types/models/errorLogTypes";
import { CheckoutLogModel } from "../types/models/checkoutLogTypes";
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

// Google Device Info
const fetchGoogleDevice = async (directoryId: string) => {
  const response = await apiClient.get<{ data: { device: unknown } }>(
    `/devices/from-google/${directoryId}`
  );
  return extractData(response).device;
};

export const useGoogleDevice = (directoryId: string | undefined) => {
  return useQuery({
    queryKey: [...deviceKeys.all, "google", directoryId] as const,
    queryFn: () => fetchGoogleDevice(directoryId!),
    enabled: !!directoryId,
  });
};

// Chrome OS Version (external API)
const fetchChromeOsVersion = async () => {
  const response = await axios.get<string>("https://omahaproxy.appspot.com/win");
  return response.data;
};

export const useChromeOsVersion = () => {
  return useQuery({
    queryKey: ["chromeOsVersion"] as const,
    queryFn: fetchChromeOsVersion,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour since this rarely changes
  });
};

// Device Mutations

const checkoutDevice = async (deviceId: string, studentId: string) => {
  const response = await apiClient.post<{ data: { device: DeviceModel } }>(
    `/devices/${deviceId}/check-out/student/${studentId}`
  );
  return extractData(response).device;
};

export const useCheckoutDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ deviceId, studentId }: { deviceId: string; studentId: string }) =>
      checkoutDevice(deviceId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
    },
  });
};

const checkinDevice = async (deviceId: string, data?: { error?: boolean; description?: string }) => {
  const response = await apiClient.post<{ data: { device: DeviceModel } }>(
    `/devices/${deviceId}/check-in`,
    data
  );
  return extractData(response).device;
};

export const useCheckinDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ deviceId, data }: { deviceId: string; data?: { error?: boolean; description?: string } }) =>
      checkinDevice(deviceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
    },
  });
};

const assignDevice = async (deviceId: string, studentId: string) => {
  const response = await apiClient.post<{ data: { device: DeviceModel } }>(
    `/devices/${deviceId}/assign`,
    { student: studentId }
  );
  return extractData(response).device;
};

export const useAssignDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ deviceId, studentId }: { deviceId: string; studentId: string }) =>
      assignDevice(deviceId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
    },
  });
};

const unassignDevice = async (deviceId: string) => {
  const response = await apiClient.post<{ data: { device: DeviceModel } }>(
    `/devices/${deviceId}/unassign`
  );
  return extractData(response).device;
};

export const useUnassignDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => unassignDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
    },
  });
};

interface UpdateErrorData {
  status: string;
  description: string;
}

const updateDeviceError = async (deviceId: string, errorId: string, data: UpdateErrorData) => {
  const response = await apiClient.patch<{ data: { errorLog: ErrorLogModel } }>(
    `/devices/${deviceId}/errors/${errorId}`,
    data
  );
  return extractData(response).errorLog;
};

export const useUpdateDeviceError = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ deviceId, errorId, data }: { deviceId: string; errorId: string; data: UpdateErrorData }) =>
      updateDeviceError(deviceId, errorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
    },
  });
};

const resetDevice = async (directoryId: string, action: "wipe" | "powerwash") => {
  const response = await apiClient.post<{ data: { message: string } }>(
    `/devices/from-google/${directoryId}/${action}`
  );
  return extractData(response).message;
};

export const useResetDevice = () => {
  return useMutation({
    mutationFn: ({ directoryId, action }: { directoryId: string; action: "wipe" | "powerwash" }) =>
      resetDevice(directoryId, action),
  });
};

// Composite hook for device page (combines query + all mutations)
interface DeviceWithRelations extends DeviceModel {
  checkouts?: CheckoutLogModel[];
  errorLogs?: ErrorLogModel[];
}

export function useDeviceWithActions(deviceType: string, slug: string) {
  const { data: deviceData, isLoading, refetch } = useDevice(deviceType, slug);

  const checkoutMutation = useCheckoutDevice();
  const checkinMutation = useCheckinDevice();
  const assignMutation = useAssignDevice();
  const unassignMutation = useUnassignDevice();
  const updateErrorMutation = useUpdateDeviceError();
  const createErrorMutation = useCreateDeviceError(deviceType);
  const resetMutation = useResetDevice();

  // Extract device, checkouts, and errors from the response
  const { device, checkouts, errors } = useMemo(() => {
    if (!deviceData) {
      return { device: undefined, checkouts: [] as CheckoutLogModel[], errors: [] as ErrorLogModel[] };
    }
    const { checkouts, errorLogs, ...device } = deviceData as DeviceWithRelations;
    return {
      device: device as DeviceModel,
      checkouts: checkouts || [],
      errors: errorLogs || [],
    };
  }, [deviceData]);

  const checkoutDevice = async (studentId: string) => {
    if (!device) throw new Error("No device loaded");
    const result = await checkoutMutation.mutateAsync({
      deviceId: device._id,
      studentId,
    });
    await refetch();
    return result;
  };

  const assignDevice = async (studentId: string) => {
    if (!device) throw new Error("No device loaded");
    const result = await assignMutation.mutateAsync({
      deviceId: device._id,
      studentId,
    });
    await refetch();
    return result;
  };

  const unassignDevice = async () => {
    if (!device) throw new Error("No device loaded");
    const result = await unassignMutation.mutateAsync(device._id);
    await refetch();
    return result;
  };

  const checkinDevice = async (data?: { error?: boolean; description?: string }) => {
    if (!device) throw new Error("No device loaded");
    const result = await checkinMutation.mutateAsync({
      deviceId: device._id,
      data,
    });
    await refetch();
    return result;
  };

  const updateDeviceError = async (
    errorId: string,
    data: { status: string; description: string }
  ) => {
    if (!device) throw new Error("No device loaded");
    const errorLog = await updateErrorMutation.mutateAsync({
      deviceId: device._id,
      errorId,
      data,
    });
    const { data: fetchedDevice } = await refetch();
    return { errorLog, device: fetchedDevice! };
  };

  const createDeviceError = async (data: { title: string; description: string }) => {
    if (!device) throw new Error("No device loaded");
    const result = await createErrorMutation.mutateAsync({
      deviceId: device._id,
      data,
    });
    const { data: fetchedDevice } = await refetch();
    return { errorLog: result.errorLog, device: fetchedDevice! };
  };

  const resetDeviceFn = async (action: "wipe" | "powerwash") => {
    if (!device?.directoryId) throw new Error("No device or directoryId");
    return resetMutation.mutateAsync({
      directoryId: device.directoryId,
      action,
    });
  };

  const updateableErrors = errors.filter((e) => !e.final);

  return {
    device,
    checkoutDevice,
    assignDevice,
    checkouts,
    errors,
    checkinDevice,
    deviceLoaded: !isLoading && !!device,
    updateableErrors,
    updateDeviceError,
    createDeviceError,
    resetDevice: resetDeviceFn,
    unassignDevice,
  };
}
