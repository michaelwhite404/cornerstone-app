import classNames from "classnames";
import { ReactNode } from "react";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  text?: string;
  fill?: boolean;
}

export default function PrimaryButton({ children, text, fill, ...props }: PrimaryButtonProps) {
  const { className, ...rest } = props;
  return (
    <button
      className={classNames(
        "bg-[#2972e7] text-white border-none py-2.5 px-4 cursor-pointer rounded hover:bg-[#1a64db] focus:outline-none focus:ring-2 focus:ring-[#1a64db] focus:ring-offset-2 active:bg-[#1253bb] disabled:bg-[#c4c4c4]",
        { "w-full": fill },
        className
      )}
      {...rest}
    >
      {children || text}
    </button>
  );
}
