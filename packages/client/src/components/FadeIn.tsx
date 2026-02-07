import React, {
  // Fragment,
  // JSXElementConstructor,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

interface Props {
  delay?: number;
  transitionDuration?: number;
  // wrapperTag?: JSXElementConstructor<any>;
  // childTag?: JSXElementConstructor<any>;
  className?: string;
  childClassName?: string;
  visible?: boolean;
  onComplete?: () => any;
}

export default function FadeIn(props: PropsWithChildren<Props>) {
  const [maxIsVisible, setMaxIsVisible] = useState(0);
  const transitionDuration = props.transitionDuration || 400;
  const delay = props.delay || 50;
  // const WrapperTag = props.wrapperTag || Fragment;
  // const ChildTag = props.childTag || "div";
  const visible = typeof props.visible === "undefined" ? true : props.visible;

  useEffect(() => {
    let count = React.Children.count(props.children);
    if (!visible) {
      // Animate all children out
      count = 0;
    }

    if (count === maxIsVisible) {
      // We're done updating maxVisible, notify when animation is done
      const timeout = setTimeout(() => {
        if (props.onComplete) props.onComplete();
      }, transitionDuration);
      return () => clearTimeout(timeout);
    }

    // Move maxIsVisible toward count
    const increment = count > maxIsVisible ? 1 : -1;
    const timeout = setTimeout(() => {
      setMaxIsVisible(maxIsVisible + increment);
    }, delay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [React.Children.count(props.children), delay, maxIsVisible, visible, transitionDuration]);
  // console.log(props.children);

  return (
    // <WrapperTag className={props.className}>
    <>
      {/* {React.Children.map(props.children, (child, i) => {
        return (
          <ChildTag
            className={props.childClassName}
            style={{
              transition: `opacity ${transitionDuration}ms, transform ${transitionDuration}ms`,
              transform: maxIsVisible > i ? "none" : "translateY(20px)",
              opacity: maxIsVisible > i ? 1 : 0,
            }}
          >
            {child}
          </ChildTag>
        );
      })} */}

      {React.Children.map(props.children, (child, i) => {
        if (React.isValidElement(child)) {
          const style = {
            transition: `opacity ${transitionDuration}ms, transform ${transitionDuration}ms`,
            transform: maxIsVisible > i ? "none" : "translateY(20px)",
            opacity: maxIsVisible > i ? 1 : 0,
            ...child.props.style,
          };
          return React.cloneElement(child, { style } as any);
        }
        return child;
      })}
    </>
    // </WrapperTag>
  );
}
