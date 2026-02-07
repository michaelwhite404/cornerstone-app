import { Classes, TextArea } from "@blueprintjs/core";
import React from "react";
import FadeIn from "../../../components/FadeIn";

export default function CheckinErrorForm({
  value,
  onInputChange,
}: {
  value: { title: string; description: string };
  onInputChange?: (name: string, value: string) => void;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onInputChange && onInputChange(e.currentTarget.name, e.currentTarget.value);
  return (
    <FadeIn>
      <div className="device-checkin-error-form">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
          <label htmlFor="error-title">Title of Issue</label>
          <input
            className={Classes.INPUT}
            name="title"
            type="text"
            dir="auto"
            value={value.title}
            style={{ minWidth: "250px" }}
            onChange={handleInputChange}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label htmlFor="error-description">Description of Issue</label>
          <TextArea
            style={{ minWidth: "250px", maxWidth: "250px", minHeight: "175px" }}
            name="description"
            value={value.description}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </FadeIn>
  );
}
