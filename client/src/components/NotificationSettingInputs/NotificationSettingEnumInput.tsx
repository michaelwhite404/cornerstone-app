export const NotificationSettingEnumInput = (props: NotificationSettingEnumInputProps) => {
  const { checked, field, id, onChange, setting, text, value } = props;
  return (
    <div className="flex items-center">
      <input
        id={id}
        name={field}
        type="radio"
        checked={checked}
        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
        onChange={() => onChange(setting, field, value)}
        value={value}
      />
      <label htmlFor={id} className="ml-3 block text-sm font-medium text-gray-700">
        {text}
      </label>
    </div>
  );
};

interface NotificationSettingEnumInputProps {
  id: string;
  field: string;
  value: string;
  text: string;
  onChange: (setting: string, field: string, value: string) => any;
  checked: boolean;
  setting: string;
}
