import { TextareaHTMLAttributes, forwardRef } from "react";
import classNames from "classnames";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  fill?: boolean;
  large?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ fill, large, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={classNames(
          "block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
          large ? "py-2.5 text-base" : "py-2 text-sm",
          fill && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };
