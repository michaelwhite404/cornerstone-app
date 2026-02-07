import { SearchIcon } from "@heroicons/react/solid";
import React from "react";
import { Input } from "../ui";

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
    <Input
      className="flex-grow [&_input]:rounded-lg [&_input]:shadow-[0px_0px_2px_1px_#c6c6c6] [&_input:focus]:shadow-[0_0_0px_2px_#3b82f6]"
      leftIcon={<SearchIcon className="h-5 w-5" />}
      placeholder="Search"
      value={value}
      onChange={handleChange}
    />
  );
}
