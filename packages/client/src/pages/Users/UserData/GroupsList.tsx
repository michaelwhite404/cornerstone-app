import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { admin_directory_v1 } from "googleapis";
import { useState } from "react";
import { EmployeeModel } from "@/types/models";
import Menuuuu from "@/components/Menu";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";

interface GroupListProps {
  user: EmployeeModel | undefined;
  userGroups: admin_directory_v1.Schema$Group[];
  groups: admin_directory_v1.Schema$Group[];
  addGroupMember: (email: string, role: string) => Promise<void>;
}

const roles = ["Member", "Manager", "Owner"];
type Role = "MEMBER" | "MANAGER" | "OWNER";

export default function GroupList(props: GroupListProps) {
  const [selectedGroup, setSelectedGroup] = useState<admin_directory_v1.Schema$Group>();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Role>("MEMBER");

  const userGroupIds = props.user?.groups?.map((d) => d.id as string);
  const pickableGroups = props.groups.filter((g) => !userGroupIds?.includes(g.id!));

  const filteredGroups =
    query === ""
      ? pickableGroups
      : pickableGroups.filter((group) => {
          return (
            group.email!.toLowerCase().includes(query.toLowerCase()) ||
            group.name!.toLowerCase().includes(query.toLowerCase())
          );
        });

  const submittable = selectedGroup ? selectedGroup.email!.length > 0 : false && role.length;

  const handleGroupAdd = () => {
    if (!submittable) return;
    props
      .addGroupMember(selectedGroup!.email!, role)
      .then(() => {
        setSelectedGroup(undefined);
        setQuery("");
        setRole("MEMBER");
      })
      .catch();
  };

  return (
    <div>
      <h3 className="mb-6">Groups</h3>
      <div>
        <div className="uppercase text-gray-400 text-xs font-medium mb-2">
          Add {props.user?.firstName || "user"} to group
        </div>
        <div>
          <div className="flex justify-between">
            <Combobox
              as="div"
              value={selectedGroup}
              onChange={setSelectedGroup}
              className="flex-1 mr-3"
            >
              {({ open }) => (
                <div className="relative z-50">
                  <Combobox.Button className="w-full">
                    <Combobox.Input
                      className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      onChange={(event) => setQuery(event.target.value)}
                      displayValue={(person: typeof selectedGroup) => person?.name!}
                      placeholder="Group to add"
                    />
                  </Combobox.Button>
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Combobox.Button>
                  <Transition
                    show={open}
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    {filteredGroups.length > 0 && (
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 sm:w-full w-[80vw] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredGroups.map((group) => (
                          <Combobox.Option
                            key={group.id}
                            value={group}
                            className={({ active }) =>
                              classNames(
                                "relative cursor-default select-none py-2 pl-8 pr-4",
                                active ? "bg-blue-600 text-white" : "text-gray-900"
                              )
                            }
                          >
                            {({ active, selected }) => (
                              <>
                                <span
                                  className={classNames(
                                    "block truncate",
                                    selected && "font-semibold"
                                  )}
                                >
                                  {group.name}{" "}
                                  <span
                                    className={classNames(
                                      "text-xs",
                                      active ? "text-white" : "text-gray-400"
                                    )}
                                  >
                                    ({group.email})
                                  </span>
                                </span>

                                {selected && (
                                  <span
                                    className={classNames(
                                      "absolute inset-y-0 left-0 flex items-center pl-1.5",
                                      active ? "text-white" : "text-blue-600"
                                    )}
                                  >
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    )}
                  </Transition>
                </div>
              )}
            </Combobox>
            <Menuuuu
              options={roles.map((label) => ({
                label,
                value: label.toUpperCase(),
              }))}
              value={role}
              onChange={({ value }) => setRole(value as Role)}
            />
            <PrimaryButton
              text="+"
              className="ml-3"
              disabled={!submittable}
              onClick={handleGroupAdd}
            />
          </div>
          {/* <div className="flex justify-end mt-2">
          </div> */}
        </div>
      </div>
      <div className="mt-4">
        <div className="uppercase text-gray-400 text-xs font-medium mb-2">Current Groups</div>
        {props.userGroups.map((group) => (
          <div className="mb-3 flex" key={group.id}>
            <input
              aria-describedby="group"
              type="checkbox"
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded ml-1 mr-2"
            />
            <div>
              <div className="font-medium mb-1">{group.name}</div>
              <div className="font-light text-gray-400" style={{ fontSize: 13 }}>
                {group.email}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
