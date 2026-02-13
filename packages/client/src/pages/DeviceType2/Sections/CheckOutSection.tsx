import { useEffect, useState } from "react";
import { Button, Select, Skeleton, GradeSelect, StudentSelect } from "../../../components/ui";
import { useToasterContext } from "../../../hooks";
import { useClassSelection } from "../../../api";
import DevicePane from "../DevicePane";
import capitalize from "capitalize";
import { DeviceModel } from "../../../types/models/deviceTypes";
import Checkout from "../Checkout";

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
  const {
    gradePicked,
    studentPicked,
    gradeOptions,
    studentOptions,
    changeGrade,
    changeStudent,
    setGradePicked,
    setStudentPicked,
    reset,
  } = useClassSelection();
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
            <GradeSelect
              value={gradePicked}
              options={gradeOptions}
              onChange={changeGrade}
            />
          </Checkout.Box>
        ) : (
          <Checkout.Skeleton />
        )}
        {showData ? (
          <Checkout.Box>
            <span style={{ fontWeight: 500, marginBottom: "6px" }}>Student</span>
            <StudentSelect
              value={studentPicked}
              options={studentOptions}
              onChange={changeStudent}
              disabled={gradePicked < 0}
            />
          </Checkout.Box>
        ) : (
          <Checkout.Skeleton />
        )}
        {showData ? (
          <Checkout.Box>
            <span style={{ fontWeight: 500, marginBottom: "6px" }}>Action</span>
            <Select
              value={action}
              onChange={(e) => setAction(e.target.value)}
            >
              <option value="Check Out">Check Out</option>
              <option value="Assign" disabled={device?.status === "Assigned"}>Assign</option>
            </Select>
          </Checkout.Box>
        ) : (
          <Checkout.Skeleton />
        )}
        {showData ? (
          <Checkout.Box className="button">
            <Button
              variant="primary"
              disabled={studentPicked === "-1"}
              onClick={action === "Check Out" ? handleCheckout : handleAssign}
              fill
            >
              {action} {capitalize(device?.deviceType || "")}
            </Button>
          </Checkout.Box>
        ) : (
          <Checkout.Box className="button">
            <Skeleton variant="rectangular" height={40} width="100%" className="rounded" />
          </Checkout.Box>
        )}
      </Checkout>
    </DevicePane>
  );
}
