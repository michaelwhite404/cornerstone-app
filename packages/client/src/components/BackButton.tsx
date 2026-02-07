import { Button, ButtonProps } from "@blueprintjs/core";
import React from "react";

interface BackButtonProps extends Omit<ButtonProps, "small" | "large" | "minimal" | "icon"> {}

export default function BackButton(props: BackButtonProps) {
  return <Button icon="chevron-left" minimal style={{ marginRight: 10 }} small {...props} />;
}
