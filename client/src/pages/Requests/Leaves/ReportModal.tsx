import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { CheckCircleIcon, XIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { Fragment, useState } from "react";

export default function ReportModal(props: Props) {
  const { close, isOpen } = props;
  const [type, setType] = useState("sheets");

  const typeOptions = [
    { name: "Google Sheets", value: "sheets", extension: "sheet" },
    { name: "Comma Seperated", value: "csv", extension: ".csv" },
    { name: "Microsoft Excel", value: "excel", extension: ".xlsx" },
    { name: "PDF", value: "pdf", extension: ".pdf" },
  ];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:mx-4 sm:max-w-4xl sm:w-full">
                <div>
                  <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                    <button
                      type="button"
                      className="rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={close}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" onClick={close} />
                    </button>
                  </div>
                  <div className="text-white px-6 pt-4 pb-2 bg-blue-600 rounded-t-md">
                    <span className="font-medium text-xl">Generate Report</span>
                    <p className="mt-1">Select the following information to generate a report.</p>
                  </div>
                  <div className="px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <RadioGroup value={type} onChange={setType}>
                      <RadioGroup.Label className="text-base font-medium text-gray-900">
                        Select an export type
                      </RadioGroup.Label>
                      <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-4 sm:gap-x-4">
                        {typeOptions.map((options) => (
                          <RadioGroup.Option
                            key={options.value}
                            value={options.value}
                            className={({ checked, active }) =>
                              classNames(
                                checked ? "border-transparent" : "border-gray-300",
                                active ? "border-indigo-500 ring-2 ring-indigo-500" : "",
                                "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
                              )
                            }
                          >
                            {({ checked, active }) => (
                              <>
                                <span className="flex flex-1">
                                  <span className="flex flex-col">
                                    <RadioGroup.Label
                                      as="span"
                                      className="block text-sm font-medium text-gray-900"
                                    >
                                      {options.name}
                                    </RadioGroup.Label>
                                    <RadioGroup.Description
                                      as="span"
                                      className="mt-1 flex items-center text-sm text-gray-500"
                                    >
                                      {options.extension}
                                    </RadioGroup.Description>
                                    {/* <RadioGroup.Description
                                    as="span"
                                    className="mt-6 text-sm font-medium text-gray-900"
                                  >
                                    {mailingList.users}
                                  </RadioGroup.Description> */}
                                  </span>
                                </span>
                                <CheckCircleIcon
                                  className={classNames(
                                    !checked ? "invisible" : "",
                                    "h-5 w-5 text-indigo-600"
                                  )}
                                  aria-hidden="true"
                                />
                                <span
                                  className={classNames(
                                    active ? "border" : "border-2",
                                    checked ? "border-indigo-500" : "border-transparent",
                                    "pointer-events-none absolute -inset-px rounded-lg"
                                  )}
                                  aria-hidden="true"
                                />
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

interface Props {
  isOpen: boolean;
  close: VoidFunction;
}
