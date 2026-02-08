import classNames from "classnames";
import { StandardLonghandProperties } from "csstype";

interface DotProps {
  blinking?: boolean;
  color: StandardLonghandProperties["color"];
}

export default function Dot(props: DotProps) {
  const c = classNames("w-2 h-2 rounded-full", { "animate-blinking": props.blinking });
  return <div className={c} style={{ backgroundColor: props.color || "black" }} />;
}
