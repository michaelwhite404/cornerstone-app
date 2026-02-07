import { Icon } from "@blueprintjs/core";
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
      className={classnames("create-textbook-button", { "button-fill": fill })}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon icon="plus" color="#0566c3" style={{ marginRight: "0.5rem" }} />
      <span style={{ fontWeight: 500 }}>Create New Textbook</span>
    </button>
  );
}
