import axios, { AxiosError } from "axios";
import { CheckoutLogModel } from "../types/models/checkoutLogTypes";
import { DeviceModel } from "../types/models/deviceTypes";
import { EmployeeModel } from "../types/models/employeeTypes";
import { ErrorLogModel } from "../types/models/errorLogTypes";
import { StudentModel } from "../types/models/studentTypes";
import { APIDeviceResponse, APIDevicesResponse, APIError } from "../types/apiResponses";

export class Device {
  _id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  macAddress: string;
  status: "Available" | "Checked Out" | "Assigned" | "Broken" | "Not Available";
  slug: string;
  dueDate?: Date;
  checkedOut?: boolean;
  lastUser?: Pick<StudentModel, "_id" | "fullName" | "grade">;
  teacherCheckOut?: Pick<EmployeeModel, "_id" | "fullName" | "email">;
  lastCheckOut?: Date;
  lastCheckIn?: Date;
  checkouts?: CheckoutLogModel[];
  errorLogs?: ErrorLogModel[];
  directoryId?: string;
  constructor(device: DeviceModel) {
    // fetch(`/api/v2/devices?slug=${this.slug}`);
    this._id = device._id;
    this.name = device.name;
    this.brand = device.brand;
    this.model = device.model;
    this.serialNumber = device.serialNumber;
    this.macAddress = device.macAddress;
    this.status = device.status;
    this.slug = device.slug;
    this.dueDate = device.dueDate ? new Date(device.dueDate) : undefined;
    this.checkedOut = device.checkedOut;
    this.lastUser = device.lastUser
      ? {
          _id: device.lastUser._id,
          fullName: device.lastUser.fullName,
          grade: device.lastUser.grade,
        }
      : undefined;
    this.teacherCheckOut = device.teacherCheckOut
      ? {
          _id: device.teacherCheckOut._id,
          fullName: device.teacherCheckOut.fullName,
          email: device.teacherCheckOut.email,
        }
      : undefined;
    this.lastCheckOut = device.lastCheckOut ? new Date(device.lastCheckOut) : undefined;
    this.lastCheckIn = device.lastCheckIn ? new Date(device.lastCheckIn) : undefined;
    this.checkouts = device.checkouts;
    this.errorLogs = device.errorLogs;
    this.directoryId = device.directoryId;
  }

  private async fetchDevice() {
    try {
      const res = await axios.get<APIDevicesResponse>("/api/v2/devices", {
        params: {
          slug: this.slug,
          populate: "checkouts,errorLogs",
        },
      });
      const { devices } = res.data.data;
      return new Device(devices[0]);
    } catch {
      throw Error("No device found");
    }
  }

  async checkout(studentId: string) {
    try {
      await axios.post<APIDeviceResponse>(
        `/api/v2/devices/${this._id}/check-out/student/${studentId}`
      );
      await this.fetchDevice();
    } catch (err) {
      throw new Error((err as AxiosError<APIError>).response!.data.message);
    }
  }

  async checkin(data: any = {}) {
    try {
      const res = await axios.post<APIDeviceResponse>(`/api/v2/devices/${this._id}/check-in`, data);
      return new Device(res.data.data.device);
    } catch (err) {
      throw new Error((err as AxiosError<APIError>).response!.data.message);
    }
  }

  /**
   * Assigns a device to a student
   * @param studentId The student's user id
   * @returns An updated instance of the device
   */
  async assign(studentId: string): Promise<Device> {
    try {
      await axios.post<APIDeviceResponse>(`/api/v2/devices/${this._id}/assign`, {
        student: studentId,
      });
      return await this.fetchDevice();
    } catch (err) {
      throw new Error((err as AxiosError<APIError>).response!.data.message);
    }
  }

  /**
   * Unassigns a user from a device
   */
  async unassign() {
    try {
      await axios.post<APIDeviceResponse>(`/api/v2/devices/${this._id}/unassign`);
      this.status = "Available";
      return this;
    } catch (err) {
      throw new Error((err as AxiosError<APIError>).response!.data.message);
    }
  }

  /**
   * Resets a device. Only works with chrome devices
   * @param action - Establishes the type of command the device must execute
   */
  async reset(action: "wipe" | "powerwash") {
    axios.post(`/api/v2/devices/from-google/${this.directoryId}/${action}`);
    return this;
  }
}

// const device = new Device({} as DeviceModel);
// const device2 = await device.reset("wipe");
