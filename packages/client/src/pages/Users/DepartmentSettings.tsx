import { useEffect, useState } from "react";
import { DepartmentModel, DepartmentSetting } from "../../types/models";
import { useAvailableSettings, useDepartmentSettings } from "../../api";
import BooleanSetting from "./SettingsComponents/BooleanSetting";
import ConstrainedColorSetting from "./SettingsComponents/ConstrainedColorSetting";

interface Props {
  department: DepartmentModel;
}

export default function DepartmentSettings(props: Props) {
  const { department } = props;
  const { data: availableSettings = [] } = useAvailableSettings();
  const { data: fetchedSettings = [] } = useDepartmentSettings(department._id);
  const [departmentSettings, setDepartmentSettings] = useState<DepartmentSetting[]>([]);

  // Sync fetched settings to local state for editing
  useEffect(() => {
    if (fetchedSettings.length > 0) {
      setDepartmentSettings(fetchedSettings);
    }
  }, [fetchedSettings]);

  const handleChange = (key: string, value: any, caption?: string) => {
    const copy = [...departmentSettings];
    const index = copy.findIndex((ds) => ds.key === key);
    if (index < 0) return;
    copy[index].value = value;
    if (caption) copy[index].caption = caption;
    setDepartmentSettings(copy);
  };

  const elements = departmentSettings.map((setting) => {
    const availableSetting = availableSettings.find((aS) => aS.key === setting.key);
    if (!availableSetting) return undefined;
    const setValue = (value: any, caption?: string) => handleChange(setting.key, value, caption);
    switch (availableSetting.dataType) {
      case "BOOLEAN":
        return <BooleanSetting key={setting.key} setting={setting} setValue={setValue} />;
      case "COLOR":
        return availableSetting.constrained ? (
          <ConstrainedColorSetting
            allowedValues={availableSetting.allowedValues!}
            key={setting.key}
            setting={setting}
            setValue={setValue}
          />
        ) : undefined;
      case "NUMBER":
      case "STRING":
    }
    return undefined;
  });

  return <ul className="mt-2 divide-y divide-gray-200">{elements}</ul>;
}
