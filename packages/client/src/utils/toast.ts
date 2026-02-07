import { toast } from "sonner";

type ToastIntent = "success" | "danger" | "warning" | "primary" | "none";

export function showToast(message: string, intent: ToastIntent) {
  switch (intent) {
    case "success":
      toast.success(message);
      break;
    case "danger":
      toast.error(message);
      break;
    case "warning":
      toast.warning(message);
      break;
    case "primary":
    case "none":
    default:
      toast.info(message);
      break;
  }
}
