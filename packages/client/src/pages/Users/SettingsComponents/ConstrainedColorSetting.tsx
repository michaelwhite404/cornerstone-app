import { useEffect, useRef, useState } from "react";
import { GithubPicker, ColorChangeHandler } from "react-color";
import {
  DepartmentAvailableSettingModel as AvailableSetting,
  DepartmentSetting,
} from "../../../types/models";

export default function ConstrainedColorSetting(props: Props) {
  const { setting, allowedValues, setValue } = props;
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);
  const handleClickOutside = ({ target }: MouseEvent) => {
    if (
      !(inputRef.current?.contains(target as Node) || buttonRef.current?.contains(target as Node))
    )
      setOpen(false);
  };
  const colors = allowedValues.map((value) => value.value);

  const width = colors.length < 8 ? colors.length * 25 + 12 : 212;

  const handleColorChange: ColorChangeHandler = ({ hex }) => {
    const allowedValue = allowedValues.find(
      (aV) => aV.value.toLowerCase() === hex.toLowerCase()
    );
    if (!allowedValue) return;
    setValue(allowedValue.value, allowedValue.caption);
    setOpen(false);
  };
  return (
    <li className="flex items-center justify-between py-4">
      <div>
        <p className="text-sm font-medium text-gray-900 mb-1">{setting.description}</p>
        {setting.helpText && <p className="text-sm text-gray-500">{setting.helpText}</p>}
      </div>
      <div className="flex flex-col items-end relative">
        <div
          ref={inputRef}
          className={`inline-flex absolute bottom-[100%] ${open ? "block" : "hidden"}`}
        >
          <GithubPicker
            color={setting.value}
            colors={colors}
            width={`${width}px`}
            triangle="hide"
            onChange={handleColorChange}
          />
        </div>
        <div>
          <button
            ref={buttonRef}
            onClick={() => setOpen(!open)}
            className="inline-flex items-center rounded-md border mt-1 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            <div className="w-5 h-5 mr-2 rounded-sm" style={{ background: setting.value }} />
            {setting.caption || setting.value}
          </button>
        </div>
      </div>
    </li>
  );
}

interface Props {
  setting: DepartmentSetting;
  setValue: (value: string, caption?: string) => void;
  allowedValues: NonNullable<AvailableSetting["allowedValues"]>;
}
