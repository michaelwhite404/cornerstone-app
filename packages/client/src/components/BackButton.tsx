import { ChevronLeftIcon } from "@heroicons/react/solid";
import { Button, ButtonProps } from "./ui";

interface BackButtonProps extends Omit<ButtonProps, "size" | "icon"> {}

export default function BackButton(props: BackButtonProps) {
  return (
    <Button
      variant="minimal"
      size="sm"
      icon={<ChevronLeftIcon className="h-5 w-5" />}
      style={{ marginRight: 10 }}
      {...props}
    />
  );
}
