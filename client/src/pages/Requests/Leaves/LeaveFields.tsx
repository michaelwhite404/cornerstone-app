import { createContext, useContext, useState } from "react";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  SortEndHandler,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { MenuIcon } from "@heroicons/react/solid";
import classNames from "classnames";

interface Item {
  text: string;
  value: string;
  checked: boolean;
}

const Context = createContext({} as { toggleItem: (value: string, checked: boolean) => void });

const Handle = SortableHandle(() => (
  <span className="cursor-grab">
    <MenuIcon className="w-4 text-gray-400" />
  </span>
));

const SortableItem = SortableElement(({ item, number }: { item: Item; number: number }) => {
  const { toggleItem } = useContext(Context);
  return (
    <li className="py-3 px-3 flex justify-between items-center">
      <div className="flex items-center">
        <input
          className="mr-3 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          type="checkbox"
          checked={item.checked}
          onChange={() => toggleItem(item.value, !item.checked)}
        />
        <label
          className={classNames("font-medium text-gray-900", { "line-through": !item.checked })}
        >
          {item.checked ? `${number}.` : null} {item.text}
        </label>
      </div>
      <Handle />
    </li>
  );
});

const SortableList = SortableContainer(({ items }: { items: Item[] }) => {
  let number = 0;
  return (
    <div>
      <span className="text-base font-medium text-gray-900">Fields To Add</span>
      <ul className="divide-y divide-gray-300 border border-gray-300 rounded-lg overflow-hidden mt-4 shadow-sm">
        {items.map((item, index) => {
          if (item.checked) number++;
          return (
            <SortableItem key={`item-${item.text}`} index={index} item={item} number={number} />
          );
        })}
      </ul>
    </div>
  );
});

const initialItems = [
  { text: "Reason for Leave", value: "reason", checked: true },
  { text: "Submitting User", value: "user", checked: true },
  { text: "Date Start", value: "dateStart", checked: true },
  { text: "Date End", value: "dateEnd", checked: true },
  { text: "Status", value: "status", checked: true },
  { text: "Finalized By", value: "finalizedBy", checked: true },
  { text: "Finalized At", value: "finalizedAt", checked: true },
  { text: "Created At", value: "createdAt", checked: true },
];

export default function LeaveFields() {
  const [items, setItems] = useState<Item[]>(initialItems);

  const toggleItem = (value: string, checked: boolean) =>
    setItems((prevItems) => {
      const items = [...prevItems];
      const index = items.findIndex((item) => item.value === value);
      if (index < 0) return items;
      items[index].checked = checked;
      return items;
    });

  const onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    setItems((items) => arrayMoveImmutable(items, oldIndex, newIndex));
  };

  return (
    <Context.Provider value={{ toggleItem }}>
      <SortableList useDragHandle lockAxis="y" items={items} onSortEnd={onSortEnd} />
    </Context.Provider>
  );
}
