import { PlusIcon } from "@heroicons/react/solid";
import classnames from "classnames";
import React from "react";

interface Props {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  fill?: boolean;
}

export default function CreateTextbookButton({ onClick, disabled, fill }: Props) {
  return (
    <button
      className={classnames(
        "border-none bg-white py-2.5 px-5 justify-center shadow-[0px_0px_2.5px_0px_#999999] rounded-[9px] cursor-pointer mt-2.5 text-[#797979] hover:bg-[#f2faff] active:bg-[#d8eefc] active:shadow-[0px_0px_4px_0px_#999999] disabled:bg-gray-200 disabled:shadow-none disabled:cursor-not-allowed disabled:opacity-50 flex items-center",
        { "w-full": fill }
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <PlusIcon className="h-5 w-5 text-blue-600 mr-2" />
      <span style={{ fontWeight: 500 }}>Create New Textbook</span>
    </button>
  );
}
