import React from "react";

export default function NotificationCheckbox(props: NotificationSettingCheckboxProps) {
  const { checked, field, id, onChange, setting, text, value, disabled } = props;

  return (
    <div className="flex items-center">
      <input
        id={id}
        name={field}
        type="radio"
        checked={checked}
        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 disabled:text-blue-200"
        onChange={() => onChange(setting, field, value)}
        value={value}
        disabled={disabled}
      />
      <label
        htmlFor={id}
        className={`ml-3 block text-sm font-medium ${disabled ? "text-gray-400" : "text-gray-700"}`}
      >
        {text}
      </label>
    </div>
  );
}

interface NotificationSettingCheckboxProps {
  id: string;
  field: string;
  value: string;
  text: string;
  onChange: (setting: string, field: string, value: string) => any;
  checked: boolean;
  setting: string;
  disabled?: boolean;
}
