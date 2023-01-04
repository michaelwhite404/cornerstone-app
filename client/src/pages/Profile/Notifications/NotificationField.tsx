import { Fragment, useContext } from "react";
import {
  NotificationSettingEnumInput,
  NotificationSettingCheckbox,
} from "../../../components/NotificationSettingInputs";
import { INotificationSettingField } from "../../../utils/notificationSettings";
import { NotificationContext } from "../Notifications";

export default function NotificationField(props: NotificationFieldProps) {
  const { data, handleChange } = useContext(NotificationContext);
  const { notificationField, settingName } = props;

  let Inputs: JSX.Element[];

  const disableField = () => {
    let disabled: boolean | undefined;
    if (typeof notificationField.disabled === "function") {
      disabled = notificationField.disabled(data);
      console.log(disabled);
    } else if (typeof notificationField.disabled === "boolean") {
      disabled = notificationField.disabled;
    }
    return disabled;
  };

  switch (notificationField.type) {
    case "TYPE_BOOL":
    case "TYPE_ENUM": {
      Inputs = notificationField.knownValues.map((knownValue) => (
        <NotificationSettingEnumInput
          key={`${notificationField.name}_${knownValue.value}`}
          field={notificationField.name}
          id={`${notificationField.name}_${knownValue.value}`}
          text={knownValue.description}
          value={knownValue.value as string}
          checked={knownValue.value === data[settingName][notificationField.name]}
          onChange={handleChange}
          setting={settingName}
          disabled={disableField()}
        />
      ));
      break;
    }
    case "TYPE_ENUM_ARRAY": {
      Inputs = notificationField.knownValues.map((knownValue) => {
        const field: Array<string> = [...data[settingName][notificationField.name]];
        const checked = field.includes(knownValue.value);

        const getNewValue = () => {
          let copy = [...field];
          checked
            ? (copy = copy.filter((str) => str !== knownValue.value))
            : copy.push(knownValue.value);
          return copy;
        };
        const change = handleChange.bind(null, settingName, notificationField.name);
        return (
          <NotificationSettingCheckbox
            key={`${notificationField.name}_${knownValue.value}`}
            field={notificationField.name}
            id={`${notificationField.name}_${knownValue.value}`}
            text={knownValue.description}
            value={knownValue.value as string}
            checked={checked}
            onChange={() => change(getNewValue())}
            setting={settingName}
            disabled={disableField()}
          />
        );
      });
      break;
    }
    default: {
      Inputs = [];
    }
  }

  return (
    <Fragment>
      <span className="flex-grow">{notificationField.description}</span>
      <fieldset className="mt-4">
        <legend className="sr-only">Notification method</legend>
        <div className="space-y-4" style={{ paddingLeft: notificationField.shift }}>
          {Inputs}
        </div>
      </fieldset>
    </Fragment>
  );
}

interface NotificationFieldProps {
  notificationField: INotificationSettingField;
  settingName: string;
}
