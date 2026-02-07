import { AxiosError } from "axios";
import { createContext, ReactNode } from "react";
import { toast } from "sonner";
import { APIError } from "../types/apiResponses";

type Intent = "success" | "danger" | "warning" | "primary" | "none";

interface IToasterContext {
  showToaster: (message: string, intent: Intent, icon?: unknown) => void;
  showError: (err: AxiosError<APIError>) => void;
}

export const ToasterContext = createContext<IToasterContext>({} as IToasterContext);

export const ToasterProvider = ({ children }: { children: ReactNode }) => {
  const showToaster = (message: string, intent: Intent) => {
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
  };

  const showError = (err: AxiosError<APIError>) => {
    toast.error(err.response?.data?.message || "An error occurred");
  };

  return (
    <ToasterContext.Provider value={{ showToaster, showError }}>{children}</ToasterContext.Provider>
  );
};
