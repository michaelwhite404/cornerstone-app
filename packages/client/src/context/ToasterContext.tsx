import { IToastProps, Intent } from "@blueprintjs/core";
import { AxiosError } from "axios";
import { createContext, ReactNode } from "react";
import { AppToaster } from "../components/AppToaster";
import { APIError } from "../types/apiResponses";

interface IToasterContext {
  showToaster: (message: string, intent: Intent, icon?: IToastProps["icon"]) => void;
  showError: (err: AxiosError<APIError>) => void;
}

export const ToasterContext = createContext<IToasterContext>({} as IToasterContext);

const icons: { [x: string]: IToastProps["icon"] } = {
  success: "tick",
  danger: "error",
  warning: "warning-sign",
  primary: "endorsed",
  none: "info-sign",
};

export const ToasterProvider = ({ children }: { children: ReactNode }) => {
  const showToaster = (message: string, intent: Intent, icon?: IToastProps["icon"]) => {
    AppToaster.show({
      message,
      intent,
      icon: icon || icons[intent],
    });
  };

  const showError = (err: AxiosError<APIError>) => {
    AppToaster.show({
      message: err.response!.data.message,
      intent: "danger",
      icon: "error",
    });
  };
  return (
    <ToasterContext.Provider value={{ showToaster, showError }}>{children}</ToasterContext.Provider>
  );
};
