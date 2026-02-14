import { createContext, useContext } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { arrayMoveImmutable } from "array-move";
import { MenuIcon } from "@heroicons/react/solid";
import classNames from "classnames";

interface Field {
  text: string;
  value: string;
  checked: boolean;
}

const Context = createContext({} as { toggleField: (value: string, checked: boolean) => void });

function SortableField({ field, number }: { field: Field; number: number }) {
  const { toggleField } = useContext(Context);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.value,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="py-3 px-3 flex justify-between items-center relative z-50 bg-white"
    >
      <div className="flex items-center">
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
      <span className="cursor-grab" {...attributes} {...listeners}>
        <MenuIcon className="w-4 text-gray-400" />
      </span>
    </li>
  );
}

export default function LeaveFields({ fields, setFields }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleField = (value: string, checked: boolean) =>
    setFields((prevFields) => {
      const fields = [...prevFields];
      const index = fields.findIndex((field) => field.value === value);
      if (index < 0) return fields;
      fields[index].checked = checked;
      return fields;
    });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFields((fields) => {
        const oldIndex = fields.findIndex((f) => f.value === active.id);
        const newIndex = fields.findIndex((f) => f.value === over.id);
        return arrayMoveImmutable(fields, oldIndex, newIndex);
      });
    }
  };

  let number = 0;

  return (
    <Context.Provider value={{ toggleField }}>
      <div>
        <span className="text-base font-medium text-gray-900">Fields To Add</span>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.value)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="divide-y divide-gray-300 border border-gray-300 rounded-lg overflow-hidden mt-4 shadow-sm">
              {fields.map((field) => {
                if (field.checked) number++;
                return (
                  <SortableField key={field.value} field={field} number={field.checked ? number : 0} />
                );
              })}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </Context.Provider>
  );
}

interface Props {
  fields: Field[];
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
}
