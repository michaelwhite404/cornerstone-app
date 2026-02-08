import { Menu as HMenu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import capitalize from "capitalize";
import { Fragment } from "react";
import { CalendarView } from "../../../types/calendar";

const views: CalendarView[] = ["week", "month"];

export function CalendarViewDropdown(props: ViewProps) {
  return (
    <HMenu as="div" className="relative">
      <HMenu.Button className="flex items-center rounded-md border border-gray-300 bg-white py-2 pl-3 pr-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
        {capitalize(props.view)} View
        <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
      </HMenu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HMenu.Items className="absolute right-0 z-50 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {views.map((view) => (
              <HMenu.Item key={view}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-gray-100" : ""
                    } block w-full px-4 py-2 text-left text-sm text-gray-700`}
                    onClick={() => props.setView(view)}
                  >
                    {capitalize(view)} View
                  </button>
                )}
              </HMenu.Item>
            ))}
          </div>
        </HMenu.Items>
      </Transition>
    </HMenu>
  );
}

interface ViewProps {
  view: CalendarView;
  setView: SetState<CalendarView>;
}

type SetState<A> = React.Dispatch<React.SetStateAction<A>>;
