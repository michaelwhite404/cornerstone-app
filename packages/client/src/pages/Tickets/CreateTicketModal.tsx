import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import LabeledInput2 from "../../components/LabeledInput2";
import capitalize from "capitalize";
import { Divider } from "../../components/ui";
import axios from "axios";
import { DepartmentModel, TicketModel } from "../../types/models";
import { useNavigate } from "react-router-dom";

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const initialData = {
  title: "",
  description: "",
  priority: "",
  department: "",
};

export default function CreateTicketModal(props: Props) {
  const [data, setData] = useState(initialData);
  const [allows, setAllows] = useState<DepartmentModel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllowTickets = async () => {
      const res = await axios.get("/api/v2/departments/allow-tickets");
      setAllows(res.data.data.departments);
    };
    getAllowTickets();
  }, []);

  const close = () => {
    props.setOpen(false);
    setData(initialData);
  };
  const submittable = Object.values(data).every((v) => v.length);
  const submit = async () => {
    try {
      const res = await axios.post("/api/v2/tickets", data);
      const ticket = res.data.data.ticket as TicketModel;
      navigate(`/tickets/${ticket.ticketId}`);
    } catch (err: any) {
      console.log(err.response);
    }
  };
  const handleChange = (e: any) => setData({ ...data, [e.target.name]: e.target.value });

  return (
    <Transition.Root show={props.open} as={Fragment}>
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
          <div className="flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className=" relative bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                <div>
                  <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                    <button
                      type="button"
                      className="rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={close}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" onClick={close} />
                    </button>
                  </div>
                  <div className="text-white px-6 pt-4 pb-2 bg-blue-600 rounded-t-md">
                    <span className="font-medium text-xl">Create Ticket</span>
                    <p className="mt-1">Enter the information below to create a ticket.</p>
                  </div>
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department</label>
                      <div className="mt-1">
                        <select
                          name="department"
                          value={data.department}
                          onChange={handleChange}
                          className="py-2 px-3 shadow focus:border-blue-500 border-white border-2 block w-full sm:text-sm rounded-md "
                          style={{ boxShadow: "0px 0px 2px #aeaeae" }}
                        >
                          <option value="">Choose a department...</option>
                          {allows.map((department) => (
                            <option key={department._id} value={department._id}>
                              {department.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="py-6 px-4">
                      <Divider />
                    </div>
                    {/* ----------------------- */}
                    <div className="space-y-4">
                      {/* Title */}
                      <div>
                        <LabeledInput2 name="title" label="Title" onChange={handleChange} />
                      </div>
                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          name="description"
                          className="min-h-[40px] h-20 mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          onChange={handleChange}
                        />
                      </div>
                      {/* Priority */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <div className="mt-1">
                          <select
                            name="priority"
                            value={data.priority}
                            onChange={handleChange}
                            className="py-2 px-3 shadow focus:border-blue-500 border-white border-2 block w-full sm:text-sm rounded-md "
                            style={{ boxShadow: "0px 0px 2px #aeaeae" }}
                          >
                            <option value="">Choose a priority...</option>
                            {priorities.map((priority) => (
                              <option key={priority} value={priority}>
                                {capitalize(priority.toLowerCase())}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-md">
                    <button
                      type="button"
                      className="disabled:bg-gray-300 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={submit}
                      disabled={!submittable}
                    >
                      Create Ticket
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

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
