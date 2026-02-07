import { ReactNode } from "react";
import "./BasicInfo.sass";
import BasicInfoCard from "./BasicInfoCard";
import BasicInfoSkeleton from "./BasicInfoSkeleton";

function BasicInfo({ children }: { children: ReactNode }) {
  return <div className="basic-info-container">{children}</div>;
}

BasicInfo.Card = BasicInfoCard;
BasicInfo.Skeleton = BasicInfoSkeleton;

export default BasicInfo;
