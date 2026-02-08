import { Fragment } from "react";
import { SelectorIcon } from "@heroicons/react/solid";
import { Menu as HMenu, Transition } from "@headlessui/react";
import { EmployeeModel } from "../../types/models/employeeTypes";
import ProfileMenu from "../ProfileMenu";

interface ProfileButtonProps {
  user: EmployeeModel;
}

export default function ProfileButton({ user }: ProfileButtonProps) {
  return (
    <HMenu as="div" className="relative menu-popover">
      <HMenu.Button className="block py-2 px-3.5 bg-transparent border-none cursor-pointer w-full rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
        <span className="flex justify-between items-center w-full">
          <span className="flex min-w-0 items-center justify-between">
            <img
              src={user.image}
              alt="Profile"
              className="rounded-full flex-shrink-0 w-10 h-10 max-w-full"
            />
            <span className="flex-col flex-1 min-w-0">
              <div className="ml-3 text-sm leading-[18px] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                <div className="font-medium text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
                  {user.fullName}
                </div>
                <span className="text-gray-500 text-[12.5px] overflow-hidden text-ellipsis whitespace-nowrap block">
                  {user.title}
                </span>
              </div>
            </span>
          </span>
          <SelectorIcon color="gray" width={20} />
        </span>
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
        <HMenu.Items className="absolute bottom-full left-0 z-10 mb-2 w-56 origin-bottom-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <ProfileMenu />
        </HMenu.Items>
      </Transition>
    </HMenu>
  );
}
