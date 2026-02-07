import { useLayoutEffect, useRef, useState } from "react";

export default function useChecker2<T>(data: T[]) {
  const [selectedData, setSelectedData] = useState<T[]>([]);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    const isIndeterminate = selectedData.length > 0 && selectedData.length < data.length;
    setChecked(selectedData.length === data.length);
    setIndeterminate(isIndeterminate);
    if (checkboxRef.current) checkboxRef.current.indeterminate = isIndeterminate;
  }, [data, selectedData]);

  function toggleAll() {
    setSelectedData(checked || indeterminate ? [] : data);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  // const IndeterminiteCheckbox = () => (
  //   <input
  //     type="checkbox"
  //     className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
  //     ref={checkboxRef}
  //     checked={checked}
  //     onChange={toggleAll}
  //   />
  // );

  return {
    isIndeterminite: indeterminate,
    data,
    selectedData,
    setSelectedData,
    allSelected: checked,
    checkboxRef,
    toggleAll,
  };
}
