import capitalize from "capitalize";
import { DeviceModel } from "../../types/models/deviceTypes";
import PaneHeader from "../../components/PaneHeader/PaneHeader";
import { useClasses } from "../../hooks";
import { Button } from "../../components/ui";

interface DeviceCheckoutProps {
  /** The device to checkout */
  device: DeviceModel;
  /** A function to run directly after a checkout request is successful. The updated device is
   * passed in as a parameter
   */
  onCheckoutSuccess?: (updatedDevice: DeviceModel) => any;
  checkoutDevice: (studentId: string) => Promise<DeviceModel | undefined>;
}

export default function Checkout({
  device,
  onCheckoutSuccess,
  checkoutDevice,
}: DeviceCheckoutProps) {
  const { GradeSelect, StudentSelect, studentPicked } = useClasses();

  const handleCheckout = async () => {
    const updatedDevice = await checkoutDevice(studentPicked);
    if (updatedDevice && onCheckoutSuccess) onCheckoutSuccess(updatedDevice);
  };
  return (
    <div>
      <PaneHeader>Check Out</PaneHeader>
      <div className="flex space-between">
        <div className="w-1/3 p-[15px] flex flex-col items-start">
          <span style={{ fontWeight: 500, marginBottom: "6px" }}>Grade</span>
          <GradeSelect />
        </div>
        <div className="w-1/3 p-[15px] flex flex-col items-start">
          <span style={{ fontWeight: 500, marginBottom: "6px" }}>Student</span>
          <StudentSelect />
        </div>
        <div className="w-1/3 p-[15px] flex flex-col items-start button">
          <Button variant="primary" disabled={studentPicked === "-1"} onClick={handleCheckout}>
            Check Out {capitalize(device.deviceType)}
          </Button>
        </div>
      </div>
    </div>
  );
}
