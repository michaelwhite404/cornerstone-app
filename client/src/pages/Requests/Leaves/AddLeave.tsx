import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import axios, { AxiosError } from "axios";
import { endOfDay, isBefore, isSameDay, startOfDay } from "date-fns";
import { ChangeEventHandler, Fragment, useEffect, useState } from "react";
import { LeaveModel } from "../../../../../src/types/models";
import DateSelector from "../../../components/DateSelector";
import { useToasterContext } from "../../../hooks";
import { APIError, APIResponse } from "../../../types/apiResponses";
import "./AddLeave.sass";

interface AddLeaveProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLeaves: React.Dispatch<React.SetStateAction<LeaveModel[]>>;
}
const initialData = {
  dateStart: startOfDay(new Date()),
  dateEnd: endOfDay(new Date()),
  reason: "",
  comments: "",
  sendTo: "",
};

interface DepartmentLeader {
  _id: string;
  fullName: string;
  email: string;
  department: {
    _id: string;
    name: string;
  };
}

export default function AddLeave(props: AddLeaveProps) {
  const [data, setData] = useState(initialData);
  const [myLeaders, setMyLeaders] = useState<Omit<DepartmentLeader, "department">[]>([]);
  const { showToaster } = useToasterContext();
  useEffect(() => {
    const getMyLeaders = async () => {
      const uniqueIds: string[] = [];
      const res = await axios.get<APIResponse<{ leaders: DepartmentLeader[] }>>(
        "/api/v2/departments/my-leaders"
      );
      const leaders = res.data.data.leaders
        .map((l) => {
          const { department, ...leader } = l;
          return leader;
        })
        .filter((leader) => {
          const isDuplicate = uniqueIds.includes(leader._id);

          if (!isDuplicate) {
            uniqueIds.push(leader._id);

            return true;
          }

          return false;
        });
      setMyLeaders(leaders);
      if (leaders[0]) setData((data) => ({ ...data, sendTo: leaders[0]._id }));
    };
    getMyLeaders();
  }, []);

  const close = () => {
    props.setOpen(false);
    setData({ ...initialData, sendTo: myLeaders[0]._id || "" });
  };
  const submit = async () => {
    try {
      const res = await axios.post("/api/v2/leaves", data);
      props.setLeaves((leaves) => [res.data.data.leave, ...leaves]);
      showToaster("Leave request created!", "success");
      close();
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  const submittable =
    (isSameDay(data.dateStart, data.dateEnd) || isBefore(data.dateStart, data.dateEnd)) &&
    data.reason.length > 0;
  // && data.sendTo.length > 0

  const handleDateChange = (date: Date, name: string) =>
    setData({ ...data, [name]: startOfDay(date) });
  const handleChange: ChangeEventHandler<HTMLTextAreaElement | HTMLSelectElement> = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const reasons = [
    "Personal Leave",
    "Sick Leave",
    "Professional Leave",
    "Leave without Pay",
    "Jury Duty Leave",
    "Funeral Leave",
    "Vacation (Year-round staff only)",
    "DC Paid Family Leave",
    "COVID-Related",
  ];
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
                    <span className="font-medium text-xl">Add Leave</span>
                    <p className="mt-1">Enter the information below to create a leave request.</p>
                  </div>
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    {/* <TextInput label="" /> */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex add-leave-date-selector">
                        <DateSelector
                          label="Date Start"
                          maxDate={new Date("Dec 31, 9999")}
                          onChange={(date) => handleDateChange(date, "dateStart")}
                          align="left"
                        />
                      </div>
                      <div className="flex add-leave-date-selector">
                        <DateSelector
                          label="Date End"
                          maxDate={new Date("Dec 31, 9999")}
                          onChange={(date) => handleDateChange(date, "dateEnd")}
                        />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                          Reason
                        </label>
                        <select
                          name="reason"
                          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={data.reason}
                          onChange={handleChange}
                        >
                          <option value="">Choose...</option>
                          {reasons.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Send To</label>
                        <div className="mt-1">
                          <select
                            name="sendTo"
                            value={data.sendTo}
                            onChange={handleChange}
                            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            {myLeaders.map((leader) => (
                              <option key={leader._id} value={leader._id}>
                                {leader.fullName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-span-2 mt-2">
                        <label className="block text-sm font-medium text-gray-700">Comments</label>
                        <textarea
                          name="comments"
                          className="min-h-[40px] mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          onChange={handleChange}
                        />
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
                      Create Leave
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
