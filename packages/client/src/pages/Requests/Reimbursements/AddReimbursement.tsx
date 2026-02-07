import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import axios, { AxiosError } from "axios";
import { startOfDay } from "date-fns";
import { ChangeEventHandler, Fragment, useEffect, useState } from "react";
import { RM } from ".";
import DateSelector from "../../../components/DateSelector";
import LabeledInput2 from "../../../components/LabeledInput2";
import { useToasterContext, useToggle } from "../../../hooks";
import { APIError, APIResponse } from "../../../types/apiResponses";
import stateList from "../../../utils/stateList";
import Dropzone from "./Dropzone";

interface AddLeaveProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setReimbursements: React.Dispatch<React.SetStateAction<RM[]>>;
}
const initialData = {
  payee: "",
  date: startOfDay(new Date()),
  amount: "",
  address: {
    street: "",
    city: "",
    state: "DC",
    zip: "",
  },
  purpose: "",
  dateNeeded: startOfDay(new Date()),
  specialInstructions: "",
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

export default function AddReimbursement(props: AddLeaveProps) {
  const [data, setData] = useState(initialData);
  const [files, setFiles] = useState<CustomFile[] | null>(null);
  const [needed, toggleNeeded] = useToggle(false);
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
    if (needed) toggleNeeded();
    setFiles(null);
  };
  const submit = async () => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const formData = new FormData();
    formData.append("receipt", files![0]);
    for (var key in data) {
      let thisKey = key as keyof typeof data;
      if (thisKey === "address") {
        for (let addressKey in data.address) {
          let aKey = addressKey as keyof typeof data.address;
          formData.append(`address[${aKey}]`, data.address[aKey]);
        }
      } else {
        if (thisKey === "amount") {
          let amount = data.amount;
          amount.includes(".")
            ? (amount = amount.split(".").join(""))
            : (amount = (+amount * 100).toString());
          formData.append(key, amount);
        } else if (thisKey === "date") formData.append(key, data.date.toISOString());
        else if (thisKey === "dateNeeded") {
          if (needed) formData.append(key, data.dateNeeded.toISOString());
        } else formData.append(key, data[thisKey]);
      }
    }
    try {
      const res = await axios.post("/api/v2/reimbursements", formData, config);
      props.setReimbursements((r) => [{ ...res.data.data.reimbursement, status: "Pending" }, ...r]);
      close();
      showToaster("Reimbursement request submitted", "success");
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  const submittable =
    // @ts-ignore
    Object.keys(data.address).every((key) => data.address[key].length > 0) &&
    data.payee.length > 0 &&
    data.purpose.length > 0 &&
    files?.length === 1 &&
    /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/.test(data.amount);

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > = (e) => setData({ ...data, [e.target.name]: e.target.value });

  // const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) =>
  //   setFile(e.target.files ? e.target.files[0] : null);

  const addressChange: ChangeEventHandler<HTMLSelectElement | HTMLInputElement> = (e) => {
    setData({ ...data, address: { ...data.address, [e.target.name]: e.target.value } });
  };

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
          <div className="flex items-center sm:items-center justify-center min-h-full p-4 text-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className=" relative bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:max-w-5xl sm:w-full">
                <div className="block absolute top-0 right-0 pt-4 pr-4">
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
                  <span className="font-medium text-xl">Add Reimbursement</span>
                  <p className="mt-1">
                    Enter the information below to create a reimbursement request.
                  </p>
                </div>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 sm:col-span-9">
                      <LabeledInput2
                        label="Check Payee"
                        name="payee"
                        value={data.payee}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-3">
                      <DateSelector
                        label="Purchase Date"
                        maxDate={new Date("Dec 31, 9999")}
                        onChange={(date) => setData({ ...data, date })}
                        fill
                      />
                    </div>
                    <div className="col-span-12">
                      <LabeledInput2
                        label="Street Address"
                        name="street"
                        value={data.address.street}
                        onChange={addressChange}
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <LabeledInput2
                        label="City"
                        name="city"
                        value={data.address.city}
                        onChange={addressChange}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <div className="mt-1">
                          <div className="hidden md:block">
                            <select
                              name="state"
                              value={data.address.state}
                              onChange={addressChange}
                              className="py-2 px-3 shadow focus:border-blue-500 border-white border-2 block w-full sm:text-sm rounded-md "
                              style={{ boxShadow: "0px 0px 2px #aeaeae" }}
                            >
                              {stateList.map((state) => (
                                <option key={state.value} value={state.value}>
                                  {state.text}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="block md:hidden">
                            <select
                              name="state"
                              value={data.address.state}
                              onChange={addressChange}
                              className="py-2 px-3 shadow focus:border-blue-500 border-white border-2 block w-full sm:text-sm rounded-md "
                              style={{ boxShadow: "0px 0px 2px #aeaeae", lineHeight: "1.5rem" }}
                            >
                              {stateList.map((state) => (
                                <option key={state.value} value={state.value}>
                                  {state.value}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <LabeledInput2
                        label="Zip"
                        name="zip"
                        value={data.address.zip}
                        onChange={addressChange}
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-3">
                      <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                          Amount
                        </label>
                        <div className="mt-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="text"
                            name="amount"
                            className="placeholder:text-gray-300 py-2 pl-7 pr-3 shadow focus:border-blue-500 border-white border-2 block w-full sm:text-sm rounded-md"
                            placeholder="25.00"
                            style={{ boxShadow: "0px 0px 2px #aeaeae" }}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-9">
                      <LabeledInput2
                        label="Purpose"
                        name="purpose"
                        value={data.purpose}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-span-12">
                      <label className="block text-sm font-medium text-gray-700">
                        Special Instructions
                      </label>
                      <textarea
                        name="specialInstructions"
                        className="min-h-[40px] h-20 mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-span-12 my-2">
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="needed"
                            name="needed"
                            type="checkbox"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            checked={needed}
                            onChange={toggleNeeded}
                          />
                        </div>
                        <div className="ml-3 text-sm mb-2">
                          <label htmlFor="needed" className="font-medium text-gray-700 select-none">
                            <p className="text-gray-500">
                              I need a reimbursement by a specific date
                            </p>
                          </label>
                        </div>
                      </div>
                      {needed && (
                        <div className="w-full">
                          <DateSelector
                            label="Date Needed"
                            maxDate={new Date("Dec 31, 9999")}
                            onChange={(dateNeeded) => setData({ ...data, dateNeeded })}
                          />
                        </div>
                      )}
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Send To</label>
                      <div className="mt-1">
                        <select
                          name="sendTo"
                          value={data.sendTo}
                          onChange={handleChange}
                          className="py-2 px-3 shadow focus:border-blue-500 border-white border-2 block w-full sm:text-sm rounded-md "
                          style={{ boxShadow: "0px 0px 2px #aeaeae" }}
                        >
                          {myLeaders.map((leader) => (
                            <option key={leader._id} value={leader._id}>
                              {leader.fullName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Receipt
                        </label>
                        <Dropzone maxFiles={1} onFilesChange={setFiles} />
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
                    Create Reimbursement
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={close}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

interface CustomFile extends File {
  preview: string;
}
