import { useLayoutEffect, useState } from "react";

type WindowSize = [number, number];

/**
 *
 * @returns An array where the first argument is the window width and the second which is the window height
 */
export default function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

// function ShowWindowDimensions() {
//   const [width, height] = useWindowSize();
//   return (
//     <span>
//       Window size: {width} x {height}
//     </span>
//   );
// }
