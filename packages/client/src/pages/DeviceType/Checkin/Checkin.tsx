import { ReactNode } from "react";
import CheckinForm from "./CheckinForm";
import CheckinErrorForm from "./CheckinErrorForm";
import CheckinButton from "./CheckinButton";
import CheckinSkeleton from "./CheckinSkeleton";


function Checkin({ children }: { children: ReactNode }) {
  return <div className="p-[15px] flex flex-wrap max-[650px]:block">{children}</div>;
}

Checkin.Form = CheckinForm;
Checkin.ErrorForm = CheckinErrorForm;
Checkin.Button = CheckinButton;
Checkin.Skeleton = CheckinSkeleton;

export default Checkin;
