import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DepartmentModel } from "../../types/models";
import LabeledInput2 from "../../components/LabeledInput2";
import { useToasterContext } from "../../hooks";

const initialDepartment = {
  name: "",
};

interface CreateDepartmentProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createDepartment: (data: { name: string }) => Promise<DepartmentModel>;
}

export default function CreateDepartmentModal(props: CreateDepartmentProps) {
  const { open, setOpen, createDepartment } = props;
  const [department, setDepartment] = useState(initialDepartment);
  const navigate = useNavigate();
  const { showError, showToaster } = useToasterContext();

  const close = () => setOpen(false);
  const submittable = department.name.length > 0;

  const submit = async () => {
    if (!submittable) return;
    try {
      const newDepartment = await createDepartment(department);
      showToaster("Department Created", "success");
      navigate(`/users/departments/${newDepartment._id}`);
    } catch (err) {
      // @ts-ignore
      showError(err);
    }
  };
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setDepartment({ ...department, [e.target.name]: e.target.value });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => null}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                <div>
                  <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                    <button
                      type="button"
                      className="rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={close}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="text-white px-6 pt-4 pb-2 bg-blue-600">
                    <span className="font-medium text-xl">Create Department</span>
                    <p className="mt-1">Enter the information below to create a new department.</p>
                  </div>
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <LabeledInput2 name="name" label="Department Name" onChange={handleChange} />
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="disabled:bg-gray-300 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={submit}
                      disabled={!submittable}
                    >
                      Create Department
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={close}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
