import React, { useEffect, useState } from "react";
import { Button, HTMLSelect } from "@blueprintjs/core";
import { useClasses, useToasterContext } from "../../../hooks";
import DevicePane from "../DevicePane";
import capitalize from "capitalize";
import { DeviceModel } from "../../../types/models/deviceTypes";
import Checkout from "../Checkout";
import { Skeleton } from "@mui/material";

interface CheckOutSectionProps {
  device?: DeviceModel;
  showData: boolean;
  checkoutDevice: (studentId: string) => Promise<DeviceModel>;
  assignDevice: (studentId: string) => Promise<DeviceModel>;
  /** A function to run directly after a checkout request is successful. The updated device is
   * passed in as a parameter
   */
  onCheckoutSuccess?: (updatedDevice: DeviceModel) => void;
  onAssignSuccess?: (updatedDevice: DeviceModel) => void;
}

export default function CheckOutSection({
  device,
  showData,
  checkoutDevice,
  onCheckoutSuccess,
  onAssignSuccess,
  assignDevice,
}: CheckOutSectionProps) {
  const { GradeSelect, StudentSelect, studentPicked, reset, setGradePicked, setStudentPicked } =
    useClasses();
  const { showToaster } = useToasterContext();
  const [action, setAction] = useState("Check Out");

  const handleCheckout = () => {
    checkoutDevice(studentPicked)
      .then((updatedDevice) => {
        showToaster(`${updatedDevice.name} checked out successfully!`, "success");
        onCheckoutSuccess && onCheckoutSuccess(updatedDevice);
      })
      .catch((err) => {
        showToaster(err.message, "danger");
      });
  };

  const handleAssign = () => {
    assignDevice(studentPicked)
      .then((updatedDevice) => {
        console.log(updatedDevice);
        showToaster(`${updatedDevice.name} has been assigned!`, "success");
        onAssignSuccess && onAssignSuccess(updatedDevice);
        setAction("Check Out");
      })
      .catch((err) => {
        showToaster(err.message, "danger");
      });
  };

  useEffect(() => {
    reset();
    if (device?.status === "Assigned") {
      setGradePicked(device.lastUser?.grade ?? 0);
      setStudentPicked(device.lastUser?._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, showData]);

  return (
    <DevicePane heading="Check Out/Assign">
      <Checkout>
        {showData ? (
          <Checkout.Box>
            <span style={{ fontWeight: 500, marginBottom: "6px" }}>Grade</span>
            <GradeSelect />
          </Checkout.Box>
        ) : (
          <Checkout.Skeleton />
        )}
        {showData ? (
          <Checkout.Box>
            <span style={{ fontWeight: 500, marginBottom: "6px" }}>Student</span>
            <StudentSelect />
          </Checkout.Box>
        ) : (
          <Checkout.Skeleton />
        )}
        {showData ? (
          <Checkout.Box>
            <span style={{ fontWeight: 500, marginBottom: "6px" }}>Action</span>
            <HTMLSelect
              value={action}
              options={[
                { disabled: false, value: "Check Out" },
                { value: "Assign", disabled: device?.status === "Assigned" },
              ]}
              onChange={(e) => setAction(e.target.value)}
            />
          </Checkout.Box>
        ) : (
          <Checkout.Skeleton />
        )}
        {showData ? (
          <Checkout.Box className="button">
            <Button
              intent="primary"
              disabled={studentPicked === "-1"}
              onClick={action === "Check Out" ? handleCheckout : handleAssign}
              fill
            >
              {action} {capitalize(device?.deviceType || "")}
            </Button>
          </Checkout.Box>
        ) : (
          <Checkout.Box className="button">
            <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: "5px" }}>
              <Button text="Check Out Device" />
            </Skeleton>
          </Checkout.Box>
        )}
      </Checkout>
    </DevicePane>
  );
}
