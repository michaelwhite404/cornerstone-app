import { Button } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { DeviceModel } from "../../../../src/types/models/deviceTypes";
import BackButton from "../../components/BackButton";
import DeviceStatusBadge from "../../components/Badges/DeviceStatusBagde";
import FadeIn from "../../components/FadeIn";
import { BasicInfoSection } from "./Sections";
import {
  MainContentFooter,
  MainContentHeader,
  MainContentInnerWrapper,
} from "../../components/MainContent";
import { useDevice } from "../../hooks";

interface DeviceDataProps {
  device: DeviceModel;
  onBack?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export default function DeviceData({ device: d, onBack }: DeviceDataProps) {
  const [showData, setShowData] = useState(false);
  const { device, deviceLoaded } = useDevice(d.deviceType, d.slug);
  useEffect(() => {
    deviceLoaded ? setTimeout(() => setShowData(true), 750) : setShowData(false);
  }, [deviceLoaded]);

  return (
    <MainContentInnerWrapper>
      <FadeIn>
        <MainContentHeader>
          <div style={{ display: "flex", alignItems: "center" }}>
            <BackButton onClick={onBack} />
            <span style={{ fontWeight: 500, fontSize: 16 }}>{d.name}</span>
          </div>
          <DeviceStatusBadge status={d.status} />
        </MainContentHeader>
        <div style={{ overflowY: "scroll" }}>
          <div>
            <BasicInfoSection device={device} showData={showData} originalDevice={d} />
          </div>
        </div>
        <MainContentFooter align="right">
          <Button />
        </MainContentFooter>
      </FadeIn>
    </MainContentInnerWrapper>
  );
}