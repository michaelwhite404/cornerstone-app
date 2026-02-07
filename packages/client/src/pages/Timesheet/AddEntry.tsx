import { XIcon } from "@heroicons/react/solid";
import { set } from "date-fns";
import { useState } from "react";
import Select, { SingleValue } from "react-select";
import { EmployeeModel } from "../../types/models";
import DateSelector from "../../components/DateSelector";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import getTimes from "../../utils/getTimes";


export default function AddEntry(props: AddEntryProps) {
  const [entry, setEntry] = useState({
    description: "",
    department: "",
    date: new Date(),
    timeStart: "",
    timeEnd: "",
  });
  const times = createTimes();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEntry({ ...entry, [e.target.name]: e.target.value });

  const handleSelectChange = (
    newValue: SingleValue<{ label: string; value: string }>,
    name: string
  ) => setEntry({ ...entry, [name]: newValue?.value });

  const handleDateChange = (d: Date) => setEntry({ ...entry, date: d });

  const getDept = () => {
    const dept = props.user!.departments?.find((dept) => dept._id === entry.department);
    return dept ? { label: dept.name, value: dept._id } : undefined;
  };

  const handleSubmit = () => {
    props.addTimesheetEntry({
      department: entry.department,
      description: entry.description,
      timeStart: set(entry.date, getTimes(entry.timeStart)).toISOString(),
      timeEnd: set(entry.date, getTimes(entry.timeEnd)).toISOString(),
    });
  };

  return (
    <div className="p-10">
      <div className="flex text-2xl font-semibold mb-6 justify-between">
        <span>New Time Entry</span>
        <XIcon
          className="text-blue-400 w-5 hover:text-blue-500 cursor-pointer"
          onClick={props.closeModal}
        />
      </div>
      <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-4">
        <div className="col-span-2">
          <label>Description</label>
          <div className="mt-1">
            <input
              className="border border-[#ccc] focus:border-[#2684FF] focus:shadow-[0px_0px_0px_1px_#2684FF] px-3 py-2.5 w-full rounded"
              value={entry.description}
              name="description"
              onChange={handleTextChange}
            />
          </div>
        </div>
        <div className="col-span-2 z-50">
          <label>Department</label>
          <Select
            className="mt-1"
            styles={{
              //@ts-ignore
              indicatorSeparator: () => {}, // removes the "stick"
            }}
            options={
              props.user?.departments
                ?.filter((d) => d.role === "MEMBER")
                .map((dept) => ({
                  label: dept.name,
                  value: dept._id,
                })) || []
            }
            value={getDept()}
            onChange={(newValue) => handleSelectChange(newValue, "department")}
          />
        </div>
        <div className="col-span-2 [&_.bp4-label]:w-full">
          <DateSelector label="Date" onChange={handleDateChange} />
        </div>
        <div>
          <label>Time Start</label>
          <Select
            className="mt-1"
            styles={{
              //@ts-ignore
              indicatorSeparator: () => {}, // removes the "stick"
              dropdownIndicator: (defaultStyles) => ({
                ...defaultStyles,
                "& svg": { display: "none" },
              }),
            }}
            options={times.map((t) => ({ label: t, value: t }))}
            value={entry.timeStart ? { label: entry.timeStart, value: entry.timeStart } : undefined}
            onChange={(newValue) => handleSelectChange(newValue, "timeStart")}
          />
        </div>
        <div>
          <label>Time End</label>
          <Select
            className="mt-1"
            styles={{
              //@ts-ignore
              indicatorSeparator: () => {}, // removes the "stick"
              dropdownIndicator: (defaultStyles) => ({
                ...defaultStyles,
                "& svg": { display: "none" },
              }),
            }}
            options={times.map((t) => ({ label: t, value: t }))}
            value={entry.timeEnd ? { label: entry.timeEnd, value: entry.timeEnd } : undefined}
            onChange={(newValue) => handleSelectChange(newValue, "timeEnd")}
          />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <PrimaryButton text="Add" onClick={handleSubmit} /* disabled */ />
      </div>
    </div>
  );
}

interface AddEntryProps {
  user: EmployeeModel | null;
  closeModal: () => void;
  addTimesheetEntry: (data: AddTimesheetData) => Promise<void>;
}

const createTimes = (interval: number = 15) => {
  const times = []; // time array
  let tt = 0; // start time
  const ap = ["AM", "PM"]; // AM-PM

  //loop to increment the time and push results in array
  for (let i = 0; tt < 24 * 60; i++) {
    const hour = Math.floor(tt / 60); // getting hours of day in 0-24 format
    const minute = tt % 60; // getting minutes of the hour in 0-55 format
    times[i] = `${hour === 0 || hour === 12 ? "12" : (hour % 12).toString().slice(-2)}:${(
      "0" + minute
    ).slice(-2)} ${ap[hour < 12 ? 0 : 1]}`;
    tt = tt + interval;
  }

  return times;
};

interface AddTimesheetData {
  description: string;
  department: string;
  timeStart: string;
  timeEnd: string;
}
