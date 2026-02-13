import React from "react";
import { Input, Textarea } from "../../../components/ui";
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
      <div className="w-3/4">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
          <label htmlFor="error-title">Title of Issue</label>
          <Input
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
          <Textarea
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
