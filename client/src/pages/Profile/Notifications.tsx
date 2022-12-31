import { useState } from "react";

const notificationMethods = [
  {
    value: "DEVICE_CHECK_IN_EMAIL_ENUM_ALL",
    description: "Send email on every device check in",
  },
  {
    value: "DEVICE_CHECK_IN_EMAIL_ENUM_BROKEN",
    description: "Send email on every devices checked in marked as broken",
  },
  {
    value: "DEVICE_CHECK_IN_EMAIL_ENUM_NONE",
    description: "Do not send email on device check in",
  },
];

export default function Notifications() {
  const [data, setData] = useState({
    DeviceCheckInEmail: "DEVICE_CHECK_IN_EMAIL_ENUM_NONE",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="mt-10 divide-y divide-gray-200">
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Email Notifications</h3>
          <p className="max-w-2xl text-sm text-gray-500">Preferences for email notifications</p>
        </div>
        <div className="mt-6">
          <div className="divide-y divide-gray-200">
            <div className="py-4">
              <div className="text-lg font-medium text-gray-600">Devices</div>
              <div className="py-4 sm:grid sm:grid-cols-[1fr_5fr] sm:gap-4 sm:py-5">
                <div className="text-sm font-medium text-gray-500">Check In</div>
                <div className="mt-1 flex flex-col text-sm text-gray-400 sm:mt-0">
                  <span className="flex-grow">Notification to send on device check in</span>
                  <fieldset className="mt-4">
                    <legend className="sr-only">Notification method</legend>
                    <div className="space-y-4">
                      {notificationMethods.map((notificationMethod) => (
                        <div key={notificationMethod.value} className="flex items-center">
                          <input
                            id={notificationMethod.value}
                            name="DeviceCheckInEmail"
                            type="radio"
                            checked={notificationMethod.value === data.DeviceCheckInEmail}
                            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                            onChange={handleChange}
                            value={notificationMethod.value}
                          />
                          <label
                            htmlFor={notificationMethod.value}
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            {notificationMethod.description}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
