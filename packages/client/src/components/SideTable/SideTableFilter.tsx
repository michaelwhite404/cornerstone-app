import { InputGroup } from "@blueprintjs/core";
import React from "react";

interface FilterProps {
  /** The value of the input */
  value: string;
  /**
   * A callback method called when the onchange event is triggered
   * @param value The changed value
   * */
  onChange?: (value: string) => void;
}

export default function SideTableFilter({ value, onChange }: FilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e.target.value);
  };

  return (
    <InputGroup
      className="side-table-filter"
      leftIcon="search"
      placeholder="Search"
      value={value}
      onChange={handleChange}
    />
  );
}
