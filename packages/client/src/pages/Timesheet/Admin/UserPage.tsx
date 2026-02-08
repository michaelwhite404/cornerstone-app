import { CheckIcon, XIcon } from "@heroicons/react/outline";
import { format, getDaysInMonth } from "date-fns";
import { useState } from "react";
import { EmployeeModel, TimesheetModel } from "../../../types/models";
import BackButton from "../../../components/BackButton";
import FadeIn from "../../../components/FadeIn";
import MainContent from "../../../components/MainContent";
import { end, start } from "../../../utils/startEnd";
import EntriesTable from "./EntriesTable";
import MonthYearPicker from "./MonthYearPicker";
import { useTimesheets } from "../../../api";

export default function UserPage(props: UserPageProps) {
  const [date, setDate] = useState(new Date());
  const [selectedData, setSelectedData] = useState<TimesheetModel[]>([]);
  const { selected, onBack, finalizeTimesheet, showTimesheetEntry } = props;

  const { data: entries = [], refetch } = useTimesheets({
    employee: selected._id,
    sort: "timeStart",
    "timeStart[gte]": start(date, "month"),
    "timeStart[lte]": end(date, "month"),
  });

  const handleTimesheetFinalize = async (approve: boolean) => {
    try {
      const ids = selectedData.filter((e) => e.status === "Pending").map((e) => e._id) as string[];
      await finalizeTimesheet(ids, approve);
      refetch();
    } catch (err) {
      console.log(err);
    }
  };
  const approve = () => handleTimesheetFinalize(true);
  const reject = () => handleTimesheetFinalize(false);

  return (
    <MainContent.InnerWrapper>
      <FadeIn>
        <MainContent.Header>
          <div style={{ display: "flex", alignItems: "center" }}>
            <BackButton onClick={onBack} />
            <span style={{ fontWeight: 500, fontSize: 16 }}>Go back</span>
          </div>
        </MainContent.Header>
        <div className="overflow-y-scroll flex-grow">
          <div className="p-3">
            <div className="grid grid-cols-4 grid-rows-1 gap-4 mb-3">
              <Stat
                label="Total Hours"
                value={entries.reduce((prev, curr) => prev + curr.hours!, 0)}
              />
              <Stat
                label="Days Worked"
                value={new Set(entries.map((e) => new Date(e.timeEnd).getDate())).size}
              />
              <Stat
                label={`Hours (${format(date, "MMM")}. 1-15)`}
                value={entries
                  .filter((e) => new Date(e.timeStart).getDate() < 16)
                  .reduce((prev, curr) => prev + curr.hours!, 0)}
              />
              <Stat
                label={`Hours (${format(date, "MMM")}. 16-${getDaysInMonth(date)})`}
                value={entries
                  .filter((e) => new Date(e.timeStart).getDate() > 15)
                  .reduce((prev, curr) => prev + curr.hours!, 0)}
              />
            </div>
            <div className="flex justify-end">
              <MonthYearPicker date={date} setDate={setDate} />
            </div>
            <FadeIn>
              {entries.length > 0 ? (
                <EntriesTable
                  entries={entries}
                  setSelected={setSelectedData}
                  showTimesheetEntry={showTimesheetEntry}
                />
              ) : (
                <div className="p-4 w-full flex flex-col items-center">
                  <img src="/error_in_calendar_illustration.png" alt="Empty Timesheet" />
                  <span className="font-medium text-lg mt-1 text-gray-600 text-center">
                    There are no entries from {selected.fullName} in {format(date, "LLLL y")}
                  </span>
                </div>
              )}
            </FadeIn>
          </div>
        </div>
        {selectedData.length > 0 && (
          <MainContent.Footer>
            <div className="space-x-3">
              <button
                type="button"
                className="w-full xs:w-auto justify-center inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={approve}
              >
                <CheckIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Approve
              </button>
              <button
                type="button"
                className="w-full xs:w-auto justify-center inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={reject}
              >
                <XIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Reject
              </button>
            </div>
          </MainContent.Footer>
        )}
      </FadeIn>
    </MainContent.InnerWrapper>
  );
}

interface UserPageProps {
  onBack: () => void;
  selected: EmployeeModel;
  finalizeTimesheet: (ids: string[], approve: boolean) => Promise<string>;
  showTimesheetEntry: (entryId: string) => Promise<void>;
}

const Stat = (props: StatProps) => {
  return (
    <div className="w-full border rounded-xl p-4">
      <div className="truncate text-sm font-medium text-gray-500 mb-1">{props.label}</div>
      <div className="text-2xl font-medium text-gray-900">{props.value}</div>
    </div>
  );
};

interface StatProps {
  label: string;
  value: string | number;
}
