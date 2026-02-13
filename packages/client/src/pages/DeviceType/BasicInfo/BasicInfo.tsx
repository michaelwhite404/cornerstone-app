import { ReactNode } from "react";
import BasicInfoCard from "./BasicInfoCard";
import BasicInfoSkeleton from "./BasicInfoSkeleton";

function BasicInfo({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap">{children}</div>;
}

BasicInfo.Card = BasicInfoCard;
BasicInfo.Skeleton = BasicInfoSkeleton;

export default BasicInfo;
