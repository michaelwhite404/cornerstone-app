import { Popover, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { Fragment, useState } from "react";
import { EmployeeModel } from "../../types/models";
import { useUsers } from "../../api";
import Combobox from "../../components/Combobox";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useToasterContext } from "../../hooks";

export default function AssignUser(props: AssignUserProps) {
  const { data: users = [] } = useUsers({ active: true });
  const [selectedPerson, setSelectedPerson] = useState<EmployeeModel>();
  const { showError } = useToasterContext();
  const [disableButton, setDisableButton] = useState(false);

  const handleAddAssignee = async () => {
    if (!selectedPerson) return;
    setDisableButton(true);
    try {
      await props.onAssign(selectedPerson._id, "ADD");
      setSelectedPerson(undefined);
    } catch (err) {
      //@ts-ignore
      showError(err);
    } finally {
      setDisableButton(false);
    }
  };

  return (
    <div className="mt-3">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`${
                open ? "" : "text-opacity-90"
              } w-full text-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75`}
            >
              <span>+ Add Assignee</span>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-full max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                <Combobox
                  options={users}
                  value={selectedPerson}
                  displayValue={(option) => option?.fullName}
                  filterFunction={(user, currentValue) =>
                    user.fullName.toLowerCase().includes(currentValue.toLowerCase()) ||
                    user.email.toLowerCase().includes(currentValue.toLowerCase())
                  }
                  onChange={setSelectedPerson}
                  placeholder={"Search for user"}
                  renderItem={(user, { active, selected }) => (
                    <>
                      <div className="flex items-center">
                        <img
                          src={user.image || "/avatar_placeholder.png"}
                          alt={user.fullName}
                          className="h-6 w-6 flex-shrink-0 rounded-full"
                          onError={(e) => (e.currentTarget.src = "/avatar_placeholder.png")}
                        />
                        <span className={classNames("ml-3 truncate", selected && "font-semibold")}>
                          {user.fullName}
                        </span>
                      </div>

                      {selected && (
                        <span
                          className={classNames(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            active ? "text-white" : "text-indigo-600"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                />
                {selectedPerson && (
                  <div className="flex justify-end mt-2">
                    <PrimaryButton
                      text="Add"
                      onClick={handleAddAssignee}
                      disabled={disableButton}
                    />
                  </div>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}

interface AssignUserProps {
  onAssign: (assign: string, op: "ADD" | "REMOVE") => Promise<void>;
}
