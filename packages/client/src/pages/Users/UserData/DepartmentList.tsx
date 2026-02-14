import { useState, Fragment } from "react";
import { Combobox, Menu, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon, SelectorIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { DepartmentModel, EmployeeModel } from "@/types/models";
import capitalize from "capitalize";
import Menuuuu from "@/components/Menu";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import { useToasterContext } from "@/hooks";

const roles = ["Member", "Leader"];

interface DepartmentListProps {
  user?: EmployeeModel;
  departments: DepartmentModel[];
  addDepartmentMember: (
    department: {
      _id: string;
      name: string;
    },
    role: "MEMBER" | "LEADER"
  ) => Promise<void>;
}

export default function DepartmentList(props: DepartmentListProps) {
  const { addDepartmentMember, departments, user } = props;
  const [query, setQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<{
    _id: string;
    name: string;
  }>();
  const [role, setRole] = useState<"MEMBER" | "LEADER">("MEMBER");
  const { showError } = useToasterContext();

  const userDepartmentIds = user?.departments?.map((d) => d._id as string);
  const pickableDepartments = departments.filter((d) => !userDepartmentIds?.includes(d._id));

  const filteredDepartments =
    query === ""
      ? pickableDepartments
      : pickableDepartments.filter((department) => {
          return department.name.toLowerCase().includes(query.toLowerCase());
        });

  const submittable = selectedDepartment ? selectedDepartment._id.length > 0 : false && role.length;

  const handleDepartmentAdd = () => {
    if (!submittable) return;
    addDepartmentMember(selectedDepartment!, role)
      .then(() => {
        setSelectedDepartment(undefined);
        setQuery("");
        setRole("MEMBER");
      })
      .catch(showError);
  };

  return (
    <>
      <h3 className="mb-6">Departments</h3>
      <div>
        <div className="uppercase text-gray-400 text-xs font-medium mb-2">
          Add {props.user?.firstName || "user"} to department
        </div>
        <div>
          <div className="flex justify-between">
            <Combobox
              as="div"
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              className="flex-1 mr-3"
            >
              {({ open }) => (
                <div className="relative z-50">
                  <Combobox.Button className="w-full">
                    <Combobox.Input
                      className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      onChange={(event) => setQuery(event.target.value)}
                      displayValue={(person: typeof selectedDepartment) => person?.name!}
                      placeholder="Department to add"
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
                    {filteredDepartments.length > 0 && (
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 sm:w-full w-[80vw] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredDepartments.map((department) => (
                          <Combobox.Option
                            key={department._id}
                            value={department}
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
                                  {department.name}
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
              onChange={({ value }) => setRole(value as "MEMBER" | "LEADER")}
            />
            <PrimaryButton
              text="+"
              className="ml-3"
              disabled={!submittable}
              onClick={handleDepartmentAdd}
            />
          </div>
          {/* <div className="flex justify-end mt-2">
          </div> */}
        </div>
      </div>
      <div className="mt-4">
        <div className="uppercase text-gray-400 text-xs font-medium mb-2">Current Departments</div>
        <div>
          {props.user?.departments?.map((d) => (
            <div className="flex justify-between items-center mb-4" key={d._id}>
              <div className="font-medium">{d.name}</div>
              <Menu as="div" className="relative">
                <Menu.Button
                  type="button"
                  className="flex items-center rounded-md border border-gray-300 bg-white py-2 pl-3 pr-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  {capitalize(d.role.toLowerCase())}
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="z-10 focus:outline-none absolute right-0 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {roles.map((role) => (
                        <Menu.Item key={role}>
                          {({ active }) => (
                            <div
                              className={classNames(
                                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              {role}
                            </div>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          )) || <span className="mt-1">No departments have been added</span>}
        </div>
      </div>
    </>
  );
}
