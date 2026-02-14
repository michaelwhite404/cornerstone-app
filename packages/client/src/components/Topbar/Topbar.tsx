import { Fragment, useState } from "react";
import { Menu as HMenu, Transition } from "@headlessui/react";
import { MenuIcon } from "@heroicons/react/outline";
import ProfileMenu from "../ProfileMenu";
import Sidebar from "../Sidebar/Sidebar";
import { useAuth } from "../../hooks";
import Slideover from "../Slideover";

export default function Topbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <div className="h-16 w-full flex flex-row border border-gray-200 sticky top-0 justify-between">
      <button
        className="px-4 outline-none border-none bg-transparent border-r border-gray-200 cursor-pointer"
        type="button"
        onClick={() => setOpen(true)}
      >
        <MenuIcon className="h-5 w-5" style={{ color: "#999999" }} />
      </button>
      <div className="mr-4 flex items-center justify-center">
        <HMenu as="div" className="relative menu-popover">
          <HMenu.Button className="block border-none cursor-pointer w-[35px] h-[35px] p-0">
            <img
              src={user?.image}
              alt="Profile"
              className="rounded-full flex-shrink-0 max-w-full"
            />
          </HMenu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <HMenu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <ProfileMenu />
            </HMenu.Items>
          </Transition>
        </HMenu>
      </div>
      <Slideover open={open} onOverlayClick={close} side="left" maxWidth="w-64">
        <Sidebar closeMenu={close} />
      </Slideover>
    </div>
  );
}
