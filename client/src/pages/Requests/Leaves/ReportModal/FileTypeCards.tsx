import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import React from "react";

const typeOptions = [
  { name: "Google Sheets", value: "sheets", extension: "sheet" },
  { name: "Comma Seperated", value: "csv", extension: ".csv" },
  { name: "Microsoft Excel", value: "excel", extension: ".xlsx" },
  { name: "PDF", value: "pdf", extension: ".pdf" },
];

export default function FileTypeCards(props: Props) {
  const { type, setType } = props;
  return (
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
                    <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                      {options.name}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className="mt-1 flex items-center text-sm text-gray-500"
                    >
                      {options.extension}
                    </RadioGroup.Description>
                  </span>
                </span>
                <CheckCircleIcon
                  className={classNames(!checked ? "invisible" : "", "h-5 w-5 text-indigo-600")}
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
  );
}

interface Props {
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
}
