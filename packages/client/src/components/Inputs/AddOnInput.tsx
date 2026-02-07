import classNames from "classnames";
import { useFocus } from "../../hooks";

interface AddOnInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  addOnSide?: "left" | "right";
  label: string;
  addOnText: string;
  error?: boolean;
}

export function AddOnInput(props: AddOnInputProps) {
  const { focused, bind } = useFocus();
  const { addOnSide = "left", label, addOnText, className, error, ...rest } = props;
  const inputClassName = classNames(
    "flex-1 min-w-0 block w-full px-3 py-2 rounded-none border sm:text-sm border-gray-300",
    { "rounded-l-md": addOnSide === "right" },
    { "rounded-r-md": addOnSide === "left" },
    { "focus:border-blue-500": !error },
    { "border-red-500": error }
  );

  const addOnClassName = classNames(
    "inline-flex items-center px-3 border  border-gray-300 bg-gray-50 text-gray-500 sm:text-sm select-none",
    { "rounded-r-md border-l-0": addOnSide === "right" },
    { "rounded-l-md border-r-0": addOnSide === "left" },
    { "border-blue-500": focused && !error },
    { "border-red-500": error }
  );

  const containerStyle = {
    boxShadow: error
      ? "0px 0px 0px 1px rgb(239,68,68)"
      : focused
      ? "0px 0px 0px 1px rgb(59,130,246)"
      : undefined,
  };

  const inputStyle = {
    [addOnSide === "right" ? "borderLeft" : "borderRight"]: error
      ? "1px solid rgb(239, 68, 68)"
      : undefined,
    borderTop: error ? "1px solid rgb(239, 68, 68)" : undefined,
    borderBottom: error ? "1px solid rgb(239, 68, 68)" : undefined,
    [addOnSide === "left" ? "borderLeft" : "borderRight"]: "1px solid rgb(209,213,219)",
    boxShadow: error
      ? "0px 0px 0px 1px rgb(239,68,68)"
      : focused
      ? "0px 0px 0px 1px rgb(59,130,246)"
      : undefined,
  };

  return (
    <div>
      {label && (
        <label
          htmlFor={props.name}
          className={`block text-sm font-medium ${error ? "text-red-500" : "text-gray-700"}`}
        >
          {label}
        </label>
      )}
      <div className="mt-1 flex rounded-md shadow-sm" style={containerStyle}>
        {addOnSide === "left" && <span className={addOnClassName}>{addOnText}</span>}
        <input {...bind} type="text" className={inputClassName} {...rest} style={inputStyle} />
        {addOnSide === "right" && <span className={addOnClassName}>{addOnText}</span>}
      </div>
    </div>
  );
}
