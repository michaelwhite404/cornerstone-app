import { LabelHTMLAttributes, forwardRef, ReactNode } from "react";
import classNames from "classnames";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={classNames("block text-sm font-medium text-gray-700 mb-1", className)}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = "Label";

export { Label };
export type { LabelProps };
