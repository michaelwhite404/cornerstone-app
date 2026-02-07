import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { Fragment, useEffect, useState } from "react";

interface MenuProps {
  options: Option[];
  onChange?: (value: Option) => void;
  value?: string;
  inRow?: boolean;
}

interface Option {
  label: string;
  value: string;
}

export default function Menuuuu(props: MenuProps) {
  const [selectedOption, setSelectedOption] = useState<Option>(
    (props.value && props.options.find((option) => option.value === props.value)) ||
      props.options[0]
  );

  useEffect(() => {
    props.value &&
      setSelectedOption(
        props.options.find((option) => option.value === props.value) || props.options[0]
      );
  }, [props.options, props.value]);

  const handleChange = (value: Option) => {
    props.onChange?.(value);
    setSelectedOption(value);
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        type="button"
        className={classNames(
          "flex items-center rounded-md py-2 pr-2 text-sm font-medium text-gray-700",
          { "hover:bg-gray-50 pl-3 border border-gray-300 bg-white shadow-sm": !props.inRow }
        )}
      >
        {selectedOption.label}
        <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="z-10 focus:outline-none absolute left-0 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {props.options.map((option, i) => (
              <Menu.Item key={i}>
                {({ active }) => (
                  <div
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                    onClick={() => handleChange(option)}
                  >
                    {option.label}
                  </div>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
