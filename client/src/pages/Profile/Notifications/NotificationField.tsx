import { Fragment, useContext } from "react";
import { NotificationSettingEnumInput } from "../../../components/NotificationSettingInputs";
import { INotificationSettingField } from "../../../utils/notificationSettings";
import { NotificationContext } from "../Notifications";

export default function NotificationField(props: NotificationFieldProps) {
  const { data, handleChange } = useContext(NotificationContext);
  const { notificationField, settingName } = props;

  let Inputs: JSX.Element[];

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
        />
      ));
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
        <div className="space-y-4">{Inputs}</div>
      </fieldset>
    </Fragment>
  );
}

interface NotificationFieldProps {
  notificationField: INotificationSettingField;
  settingName: string;
}
