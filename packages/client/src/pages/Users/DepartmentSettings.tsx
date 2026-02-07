import axios from "axios";
import { useEffect, useState } from "react";
import {
  DepartmentAvailableSettingModel as AvailableSetting,
  DepartmentModel,
  DepartmentSetting,
} from "../../types/models";
import BooleanSetting from "./SettingsComponents/BooleanSetting";
import ConstrainedColorSetting from "./SettingsComponents/ConstrainedColorSetting";

interface Props {
  department: DepartmentModel;
}

export default function DepartmentSettings(props: Props) {
  const { department } = props;
  const [availableSettings, setAvailableSettings] = useState<AvailableSetting[]>([]);
  const [departmentSettings, setDepartmentSettings] = useState<DepartmentSetting[]>([]);
  const [editted, setEditted] = useState(false);

  const handleChange = (key: string, value: any, caption?: string) => {
    const copy = [...departmentSettings];
    const index = copy.findIndex((ds) => ds.key === key);
    if (index < 0) return;
    copy[index].value = value;
    if (caption) copy[index].caption = caption;
    setDepartmentSettings(copy);
    setEditted(true);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const [res1, res2] = await axios.all([
        axios.get(`/api/v2/departments/settings`),
        axios.get(`/api/v2/departments/${department._id}/settings`),
      ]);
      setAvailableSettings(res1.data.data.availableSettings);
      setDepartmentSettings(res2.data.data.settings);
    };

    fetchSettings();
  }, [department._id]);

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
