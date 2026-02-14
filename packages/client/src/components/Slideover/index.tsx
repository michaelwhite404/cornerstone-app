import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Slideover(props: SlideoverProps) {
  const { open, onOverlayClick, children, side = "right", maxWidth = "max-w-md" } = props;

  const isLeft = side === "left";

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onOverlayClick}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`pointer-events-none fixed inset-y-0 flex max-w-full ${
                isLeft ? "left-0 pr-10" : "right-0 pl-10"
              }`}
            >
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom={isLeft ? "-translate-x-full" : "translate-x-full"}
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo={isLeft ? "-translate-x-full" : "translate-x-full"}
              >
                <Dialog.Panel className={`pointer-events-auto ${maxWidth}`}>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

interface SlideoverProps {
  open: boolean;
  onOverlayClick: () => void;
  children?: ReactNode | undefined;
  side?: "left" | "right";
  /** Tailwind max-width class for the panel. Default: "max-w-md" */
  maxWidth?: string;
}
