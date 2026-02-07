import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon, TrashIcon, XIcon } from "@heroicons/react/solid";
import { AddOnInput } from "../../components/Inputs";
import isEqual from "lodash.isequal";

interface GroupDataSliderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    name: string;
    description: string;
    email: string;
    aliases: string[];
  };
  updateGroup: (data: { name: string; description: string; email: string }) => Promise<void>;
}

export default function GroupDataSlider({
  open,
  setOpen,
  data,
  updateGroup,
}: GroupDataSliderProps) {
  const [group, setGroup] = useState(data);
  const [alias, setAlias] = useState("");

  const aliasTaken = group.aliases.includes(`${alias}@cornerstone-schools.org`);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    let { name, value } = e.target;
    if (name === "email") value = value + "@cornerstone-schools.org";
    setGroup({ ...group, [name]: value });
  };

  const handleAddAlias = () => {
    if (alias && !aliasTaken) {
      setGroup({ ...group, aliases: [...group.aliases, `${alias}@cornerstone-schools.org`] });
      setAlias("");
    }
  };

  const handleDeleteAlias = (index: number) => {
    const copiedGroup = { ...group };
    copiedGroup.aliases.splice(index, 1);
    setGroup(copiedGroup);
  };

  const close = () => {
    setOpen(false);
    setGroup(data);
    setAlias("");
  };

  const handleSubmit = () =>
    updateGroup(group).then(() => {
      setOpen(false);
      setAlias("");
    });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={close}>
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

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="h-0 flex-1 overflow-y-auto">
                      {/* Header */}
                      <div className="bg-indigo-700 py-6 px-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-medium text-white">
                            {" "}
                            Edit Group{" "}
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={close}
                            >
                              <span className="sr-only">Close panel</span>
                              <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-indigo-300">
                            Edit the group information below
                          </p>
                        </div>
                      </div>
                      {/* Data */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          <div className="space-y-6 pt-6 pb-5">
                            <div>
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-900"
                              >
                                Group Name
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="name"
                                  id="name"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  onChange={handleChange}
                                  value={group.name}
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-900"
                              >
                                {" "}
                                Description{" "}
                              </label>
                              <div className="mt-1">
                                <textarea
                                  id="description"
                                  name="description"
                                  rows={4}
                                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  onChange={handleChange}
                                  value={group.description}
                                />
                              </div>
                            </div>
                            <div>
                              <AddOnInput
                                addOnText="@cornerstone-schools.org"
                                name="email"
                                id="email"
                                label="Email"
                                addOnSide="right"
                                onChange={handleChange}
                                value={group.email.split("@")[0]}
                              />
                            </div>
                            {/* Aliases */}
                            {/*
                             <div>
                              <div className="space-y-1">
                                <div className="flex flex-col">
                                  <div className="flex-grow">
                                    <AddOnInput
                                      type="text"
                                      name="add-alias"
                                      id="add-alias"
                                      className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                      placeholder="Email address"
                                      aria-describedby="add-alias-helper"
                                      addOnText="@cornerstone-schools.org"
                                      addOnSide="right"
                                      label="Add Alias"
                                      onChange={(e) => setAlias(e.target.value)}
                                      value={alias}
                                    />
                                  </div>
                                  <span className="mt-3 text-right">
                                    <button
                                      type="button"
                                      className="bg-white inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-200"
                                      onClick={handleAddAlias}
                                      disabled={aliasTaken || alias === ""}
                                    >
                                      <PlusIcon
                                        className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                      <span>Add</span>
                                    </button>
                                  </span>
                                </div>
                              </div>
                              {group.aliases.length > 0 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Active Aliases
                                  </label>
                                  {group.aliases.map((alias, i) => (
                                    <div
                                      className="flex justify-between items-center mb-2.5"
                                      key={alias}
                                    >
                                      <span>{alias}</span>
                                      <button
                                        type="button"
                                        className="bg-white inline-flex px-2 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={() => handleDeleteAlias(i)}
                                      >
                                        <TrashIcon
                                          className="h-5 w-5 text-gray-400"
                                          aria-hidden="true"
                                        />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                             */}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Bottom */}
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={close}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300"
                        disabled={isEqual(data, group)}
                        onClick={handleSubmit}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
