import { singular } from "pluralize";
import { useOutletContext } from "react-router-dom";
import EmptyState from "../../components/EmptyState/EmptyState";

export default function DeviceEmptyState() {
  const { deviceType } = useOutletContext<{ deviceType: string }>();

  return (
    <EmptyState fadeIn>
      <div style={{ fontWeight: 500, textAlign: "center" }}>Select a {singular(deviceType)}</div>
    </EmptyState>
  );
}
