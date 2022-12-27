import React, { useState } from "react";
import { useAuth, useDocTitle } from "../../hooks";
import Tabs2, { TabOption } from "../../components/Tabs2";
import { Switch } from "@headlessui/react";
import classNames from "classnames";

type PageState = "GENERAL" | "PASSWORD" | "NOTIFICATIONS" | "TEAMS";

export default function Profile() {
  useDocTitle("Profile | Cornerstone App");
  const user = useAuth().user!;
  const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] = useState(true);

  const tabs: TabOption<PageState>[] = [
    { name: "General", value: "GENERAL" },
    { name: "Password", value: "PASSWORD" },
    { name: "Notifications", value: "NOTIFICATIONS" },
    { name: "Teams", value: "TEAMS" },
  ];

  return (
    <div className="flex flex-col" style={{ padding: "10px 25px 25px" }}>
      <div className="sm:flex sm:justify-between align-center">
        {/* Header */}
        <div className="page-header">
          <h1 style={{ marginBottom: "10px" }}>Profile</h1>
        </div>
      </div>
      <div className="sm:mt-0 mt-3">
        <Tabs2 tabs={tabs} value={"GENERAL"} onChange={() => {}} />
      </div>
      <div className="mt-10 divide-y divide-gray-200">
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Information</h3>
          <p className="max-w-2xl text-sm text-gray-500">
            This information will be displayed publicly.
          </p>
        </div>
        <div className="mt-6">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <span className="flex-grow">{user.fullName}</span>
                <span className="ml-4 flex-shrink-0">
                  <button
                    type="button"
                    className="rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:text-blue-200"
                    disabled
                  >
                    Update
                  </button>
                </span>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
              <dt className="text-sm font-medium text-gray-500">Photo</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <span className="flex-grow">
                  <img className="h-8 w-8 rounded-full" src={user.image} alt={`${user.fullName}`} />
                </span>
                <span className="ml-4 flex flex-shrink-0 items-start space-x-4">
                  <button
                    type="button"
                    className="rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:text-blue-200"
                    disabled
                  >
                    Update
                  </button>
                  <span className="text-gray-300" aria-hidden="true">
                    |
                  </span>
                  <button
                    type="button"
                    className="rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:text-blue-200"
                    disabled
                  >
                    Remove
                  </button>
                </span>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <span className="flex-grow">{user.email}</span>
                <span className="ml-4 flex-shrink-0">
                  <button
                    type="button"
                    className="rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:text-blue-200"
                    disabled
                  >
                    Update
                  </button>
                </span>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-b sm:border-gray-200 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Job title</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <span className="flex-grow">{user.title}</span>
                <span className="ml-4 flex-shrink-0">
                  <button
                    type="button"
                    className="rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:text-blue-200"
                    disabled
                  >
                    Update
                  </button>
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-10 divide-y divide-gray-200">
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Account</h3>
          <p className="max-w-2xl text-sm text-gray-500">
            Manage how information is displayed on your account.
          </p>
        </div>
        <div className="mt-6">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
              <dt className="text-sm font-medium text-gray-500">Language</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <span className="flex-grow">English</span>
                <span className="ml-4 flex-shrink-0">
                  <button
                    type="button"
                    className="rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:text-blue-200"
                    disabled
                  >
                    Update
                  </button>
                </span>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
              <dt className="text-sm font-medium text-gray-500">Date format</dt>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <span className="flex-grow">MM/DD/YYYY</span>
                <span className="ml-4 flex flex-shrink-0 items-start space-x-4">
                  <button
                    type="button"
                    className="rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:text-blue-200"
                    disabled
                  >
                    Update
                  </button>
                  <span className="text-gray-300" aria-hidden="true">
                    |
                  </span>
                  <button
                    type="button"
                    className="rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:text-blue-200"
                    disabled
                  >
                    Remove
                  </button>
                </span>
              </dd>
            </div>
            <Switch.Group as="div" className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
              <Switch.Label as="dt" className="text-sm font-medium text-gray-500" passive>
                Automatic timezone
              </Switch.Label>
              <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <Switch
                  checked={automaticTimezoneEnabled}
                  onChange={setAutomaticTimezoneEnabled}
                  className={classNames(
                    automaticTimezoneEnabled ? "bg-blue-200" : "bg-gray-200",
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-auto disabled:text-blue-200"
                  )}
                  disabled
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      automaticTimezoneEnabled ? "translate-x-5" : "translate-x-0",
                      "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    )}
                  />
                </Switch>
              </dd>
            </Switch.Group>
          </dl>
        </div>
      </div>
    </div>
  );
}
