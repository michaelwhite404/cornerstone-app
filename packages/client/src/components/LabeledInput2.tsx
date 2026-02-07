import React from "react";

export default function LabeledInput2(props: LabeledInput2Props) {
  const { placeholder, id, name, type, className, ...rest } = props;

  return (
    <>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {props.label}
      </label>
      <div className="mt-1">
        <input
          type={type || "text"}
          name={name}
          id={id}
          className={
            "py-2 px-3 shadow focus:border-blue-500 border-white border-2 block w-full sm:text-sm rounded-md " +
            className
          }
          placeholder={placeholder}
          style={{ boxShadow: "0px 0px 2px #aeaeae" }}
          {...rest}
        />
      </div>
    </>
  );
}

interface LabeledInput2Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: "email" | "text" | "password";
}
