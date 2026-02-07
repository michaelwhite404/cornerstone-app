import classNames from "classnames";
import { StandardLonghandProperties } from "csstype";
import "./Dot.sass";

interface DotProps {
  blinking?: boolean;
  color: StandardLonghandProperties["color"];
}

export default function Dot(props: DotProps) {
  const c = classNames("dot", { blinking: props.blinking });
  return <div className={c} style={{ backgroundColor: props.color || "black" }} />;
}
