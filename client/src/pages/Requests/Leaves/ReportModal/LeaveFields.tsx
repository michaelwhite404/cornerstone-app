import { createContext, useContext } from "react";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  SortEndHandler,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { MenuIcon } from "@heroicons/react/solid";
import classNames from "classnames";

interface Field {
  text: string;
  value: string;
  checked: boolean;
}

const Context = createContext({} as { toggleField: (value: string, checked: boolean) => void });

const Handle = SortableHandle(() => (
  <span className="cursor-grab">
    <MenuIcon className="w-4 text-gray-400" />
  </span>
));

const SortableField = SortableElement(({ field, number }: { field: Field; number: number }) => {
  const { toggleField } = useContext(Context);
  return (
    <li className="py-3 px-3 flex justify-between fields-center">
      <div className="flex fields-center">
        <input
          className="mr-3 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          type="checkbox"
          checked={field.checked}
          onChange={() => toggleField(field.value, !field.checked)}
        />
        <label
          className={classNames("font-medium text-gray-900", { "line-through": !field.checked })}
        >
          {field.checked ? `${number}.` : null} {field.text}
        </label>
      </div>
      <Handle />
    </li>
  );
});

const SortableList = SortableContainer(({ fields }: { fields: Field[] }) => {
  let number = 0;
  return (
    <div>
      <span className="text-base font-medium text-gray-900">Fields To Add</span>
      <ul className="divide-y divide-gray-300 border border-gray-300 rounded-lg overflow-hidden mt-4 shadow-sm">
        {fields.map((field, index) => {
          if (field.checked) number++;
          return (
            <SortableField
              key={`field-${field.text}`}
              index={index}
              field={field}
              number={number}
            />
          );
        })}
      </ul>
    </div>
  );
});

export default function LeaveFields({ fields, setFields }: Props) {
  const toggleField = (value: string, checked: boolean) =>
    setFields((prevFields) => {
      const fields = [...prevFields];
      const index = fields.findIndex((field) => field.value === value);
      if (index < 0) return fields;
      fields[index].checked = checked;
      return fields;
    });

  const onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    setFields((fields) => arrayMoveImmutable(fields, oldIndex, newIndex));
  };

  return (
    <Context.Provider value={{ toggleField }}>
      <SortableList useDragHandle lockAxis="y" fields={fields} onSortEnd={onSortEnd} />
    </Context.Provider>
  );
}

interface Props {
  fields: Field[];
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
}
