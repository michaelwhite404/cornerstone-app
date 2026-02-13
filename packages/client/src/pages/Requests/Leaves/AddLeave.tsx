import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { AxiosError } from "axios";
import { isBefore, isSameDay, set } from "date-fns";
import { ChangeEventHandler, Fragment, useEffect, useRef, useState } from "react";
import { TimePicker } from "sassy-datepicker";
import { Leave } from ".";
import DateSelector from "../../../components/DateSelector";
import { useToasterContext } from "../../../hooks";
import { useMyDepartmentLeaders, useCreateLeave } from "../../../api";
import { APIError } from "../../../types/apiResponses";


interface AddLeaveProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLeaves: React.Dispatch<React.SetStateAction<Leave[]>>;
}
const initialData = {
  dateStart: set(new Date(), { hours: 7, minutes: 30, seconds: 0 }),
  dateEnd: set(new Date(), { hours: 15, minutes: 30, seconds: 0 }),
  reason: "",
  comments: "",
  sendTo: "",
  allDay: true,
};

interface Time {
  hours: number;
  minutes: number;
}

export default function AddLeave(props: AddLeaveProps) {
  const [data, setData] = useState(initialData);
  const { data: leaders = [] } = useMyDepartmentLeaders();
  const createLeaveMutation = useCreateLeave();
  const { showToaster } = useToasterContext();
  const ref = useRef(null);

  // Set initial sendTo when leaders load
  useEffect(() => {
    if (leaders.length > 0 && !data.sendTo) {
      setData((d) => ({ ...d, sendTo: leaders[0]._id }));
    }
  }, [leaders, data.sendTo]);

  const close = () => {
    props.setOpen(false);
    setData({ ...initialData, sendTo: leaders[0]?._id || "" });
  };

  const submit = async () => {
    try {
      const leave = await createLeaveMutation.mutateAsync({
        reason: data.reason,
        dateStart: data.dateStart.toISOString(),
        dateEnd: data.dateEnd.toISOString(),
        sendTo: data.sendTo,
        comments: data.comments || undefined,
      });
      props.setLeaves((leaves) => [leave as Leave, ...leaves]);
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

  const handleDateChange = (date: Date, name: "dateStart" | "dateEnd") => {
    const newDate = set(data[name], {
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate(),
    });
    setData({ ...data, [name]: newDate });
  };
  const handleTimeChange = (time: Time, name: "dateStart" | "dateEnd") => {
    const newDate = set(data[name], {
      hours: time.hours,
      minutes: time.minutes,
    });
    if (newDate.getTime() === data[name].getTime()) return;
    setData({ ...data, [name]: newDate });
  };

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
          <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
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
                      <div className="flex items-end col-span-2 xs:col-span-1 [&_.date-selector]:w-full [&_.date-selector]:mr-1 [&_label]:mb-0">
                        <DateSelector
                          label="Date Start"
                          maxDate={new Date("Dec 31, 9999")}
                          onChange={(date) => handleDateChange(date, "dateStart")}
                          align="left"
                        />
                        {!data.allDay && (
                          <TimePicker
                            displayFormat={"12hr"}
                            minutesInterval={5}
                            onChange={(time) => handleTimeChange(time, "dateStart")}
                            value={{ hours: 12, minutes: 30 }}
                          />
                        )}
                      </div>
                      <div className="flex items-end col-span-2 xs:col-span-1 [&_.date-selector]:w-full [&_.date-selector]:mr-1 [&_label]:mb-0">
                        <DateSelector
                          label="Date End"
                          maxDate={new Date("Dec 31, 9999")}
                          onChange={(date) => handleDateChange(date, "dateEnd")}
                        />
                        {!data.allDay && (
                          <TimePicker
                            displayFormat={"12hr"}
                            minutesInterval={5}
                            onChange={(time) => handleTimeChange(time, "dateEnd")}
                            value={{
                              hours: data.dateEnd.getHours(),
                              minutes: data.dateEnd.getMinutes(),
                            }}
                            ref={ref}
                          />
                        )}
                      </div>
                      <div className="col-span-2">
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="allDay"
                              name="allDay"
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              checked={!data.allDay}
                              onChange={() => setData({ ...data, allDay: !data.allDay })}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="allDay"
                              className="font-medium text-gray-700 select-none"
                            >
                              <span className="text-gray-500">Add Times</span>
                            </label>
                          </div>
                        </div>
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
                            {leaders.map((leader) => (
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
