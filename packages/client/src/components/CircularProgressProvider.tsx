import React from "react";
const CircularProgressProvider = (props: CircularProgressProviderProps) => {
  const [value, setValue] = React.useState(props.valueStart);
  React.useEffect(() => {
    setTimeout(() => setValue(props.valueEnd), 100);
  }, [props.valueEnd]);

  return props.children(value);
};
export default CircularProgressProvider;

interface CircularProgressProviderProps {
  children: (value: number) => JSX.Element;
  valueStart: number;
  valueEnd: number;
}
