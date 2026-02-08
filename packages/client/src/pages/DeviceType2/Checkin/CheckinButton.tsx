import { Button } from "../../../components/ui";

export default function CheckinButton({
  deviceType = "device",
  disabled,
  onClick,
}: {
  deviceType?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}) {
  return (
    <Button
      className="py-[13px] px-5 shadow-none font-medium rounded-md bg-[#239eea]"
      variant="primary"
      disabled={disabled}
      onClick={onClick}
    >
      Check In {deviceType}
    </Button>
  );
}
