import { Menu } from "@blueprintjs/core";
import { Classes, Popover2 } from "@blueprintjs/popover2";
import { ChevronDownIcon } from "@heroicons/react/solid";
import capitalize from "capitalize";
import { CalendarView } from "../../../types/calendar";

const views: CalendarView[] = ["week", "month"];

export function CalendarViewDropdown(props: ViewProps) {
  return (
    <Popover2
      content={<CalendarViewMenu {...props} />}
      placement="bottom-end"
      className="menu-popover"
      interactionKind="click"
      hoverCloseDelay={10000}
      portalClassName="view-portal"
    >
      <button className="flex items-center rounded-md border border-gray-300 bg-white py-2 pl-3 pr-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
        {capitalize(props.view)} View
        <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>
    </Popover2>
  );
}

interface ViewProps {
  view: CalendarView;
  setView: SetState<CalendarView>;
}

type SetState<A> = React.Dispatch<React.SetStateAction<A>>;

const CalendarViewMenu = (props: ViewProps) => {
  return (
    <Menu
      className={`${Classes.POPOVER2_DISMISS} focus:outline-none right-0 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
      style={{ minWidth: 0, padding: "4px 0", borderRadius: 8 }}
    >
      {views.map((view) => (
        <li key={view}>
          <button
            className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
            onClick={() => props.setView(view)}
          >
            {capitalize(view)} View
          </button>
        </li>
      ))}
    </Menu>
  );
};
