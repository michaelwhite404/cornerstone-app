import { Combobox, Transition } from "@headlessui/react";
import { SelectorIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { ReactNode, useState } from "react";

interface ComboboxProps<T> {
  options: T[];
  displayValue: (option: T) => string;
  value: T | undefined;
  renderItem: (option: T, propArg: OptionRenderPropArg) => ReactNode;
  filterFunction: (option: T, currentValue: string) => boolean;
  placeholder?: string;
  onChange?: (value?: T) => void;
}

interface OptionRenderPropArg {
  active: boolean;
  selected: boolean;
  disabled: boolean;
}

export default function Comboboxxxxxx<T>(props: ComboboxProps<T>) {
  const { options, displayValue, filterFunction, renderItem, placeholder, value } = props;
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === "" ? options : options.filter((option) => filterFunction(option, query));

  const handleChange = (value: T | undefined) => props.onChange?.(value);

  return (
    <Combobox as="div" value={value} onChange={handleChange} className="flex-1">
      {({ open }) => (
        <div className="relative">
          <Combobox.Input
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={displayValue}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            {filteredOptions.length > 0 && (
              <Combobox.Options className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredOptions.map((option, i) => (
                  <Combobox.Option
                    key={i}
                    value={option}
                    className={({ active }) =>
                      classNames(
                        "relative cursor-default select-none py-2 pl-8 pr-4",
                        active ? "bg-blue-600 text-white" : "text-gray-900"
                      )
                    }
                  >
                    {(propArgs) => renderItem(option, propArgs)}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}
          </Transition>
        </div>
      )}
    </Combobox>
  );
}
