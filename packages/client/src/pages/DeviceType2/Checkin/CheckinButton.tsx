import { Button } from "@blueprintjs/core";

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
      className="device-checkin-button"
      intent="primary"
      disabled={disabled}
      onClick={onClick}
    >
      Check In {deviceType}
    </Button>
  );
}
