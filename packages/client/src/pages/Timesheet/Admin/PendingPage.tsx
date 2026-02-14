import { ArrowNarrowRightIcon, CheckIcon, XIcon } from "@heroicons/react/outline";
import { CalendarIcon, ClockIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { format } from "date-fns";
// import BackButton from "../../../components/BackButton";
import FadeIn from "../../../components/FadeIn";
import MainContent from "../../../components/MainContent";
import { useChecker } from "../../../hooks";
import { useTimesheets } from "../../../api";

export default function PendingPage(props: Props) {
  const { showTimesheetEntry, finalizeTimesheet } = props;
  const { data: pending = [], refetch } = useTimesheets({ status: "Pending", sort: "-timeStart" });
  const { data, checkboxRef, allSelected, toggleAll, setSelectedData, selectedData } =
    useChecker(pending);

  // const onBack = () => {};

  const handleTimesheetFinalize = async (approve: boolean) => {
    try {
      const ids = selectedData.map((entry) => entry._id) as string[];
      await finalizeTimesheet(ids, approve);
      setSelectedData([]);
      refetch();
    } catch {
      // Error handled silently
    }
  };
  const approve = () => handleTimesheetFinalize(true);
  const reject = () => handleTimesheetFinalize(false);

  return (
    <MainContent.InnerWrapper>
      <FadeIn>
        {/* <MainContent.Header>
          <div style={{ display: "flex", alignItems: "center" }}>
            <BackButton onClick={onBack} />
            <span style={{ fontWeight: 500, fontSize: 16 }}>Go back</span>
          </div>
        </MainContent.Header> */}
        <div className="flex-grow px-6 xs:py-2 py-4">
          <div className="xs:h-14 xs:flex items-center justify-between">
            <div className="text-xl font-bold text-gray-900">Pending ({data.length})</div>
            <div
              className={`${
                selectedData.length ? "sm:block flex" : "invisible"
              } space-x-3 py-2 xs:py-0 h-[50px] xs:h-auto`}
            >
              <button
                type="button"
                className="w-full xs:w-auto justify-center inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={approve}
              >
                <CheckIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Approve {allSelected ? "All" : ""}
              </button>
              <button
                type="button"
                className="w-full xs:w-auto justify-center inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={reject}
              >
                <XIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Reject {allSelected ? "All" : ""}
              </button>
            </div>
          </div>
          <div
            className="rounded-lg overflow-hidden mb-4"
            style={{ boxShadow: "#d4d4d4 0px 0px 2px 1px" }}
          >
            {/* Indeterminate */}
            <div className="px-5 py-2 bg-[#f9fafb]">
              <div className="relative w-8 py-2.5">
                <input
                  type="checkbox"
                  className="absolute top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  ref={checkboxRef}
                  checked={allSelected && data.length > 0}
                  onChange={toggleAll}
                />
              </div>
            </div>
            {data.map((entry) => {
              const selected = selectedData.includes(entry);
              return (
                <div
                  key={entry._id}
                  className={classNames("flex text-[#bcc0d6] py-3.5 px-5 border-t", {
                    "bg-indigo-50": selected,
                  })}
                >
                  <div className="relative w-8 py-2.5">
                    <input
                      type="checkbox"
                      className="absolute top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      value={entry._id}
                      checked={selected}
                      onChange={(e) =>
                        setSelectedData(
                          e.target.checked
                            ? [...selectedData, entry]
                            : selectedData.filter((t) => t !== entry)
                        )
                      }
                    />
                  </div>
                  {/* Actual Row */}
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <p
                        className="truncate text-sm font-medium text-indigo-600 mb-0 cursor-pointer"
                        onClick={() => showTimesheetEntry(entry._id)}
                      >
                        {entry.description}
                      </p>
                      <div className="flex align-center">
                        <img
                          className="w-4 h-4 rounded-full mr-1.5"
                          src={entry.employee.image || "/avatar_placeholder.png"}
                          alt={entry.employee.fullName}
                          onError={(e) => (e.currentTarget.src = "/avatar_placeholder.png")}
                        />
                        <p className="inline-flex text-md text-gray-600 font-medium leading-5 mb-0">
                          {entry.employee.fullName}
                        </p>
                      </div>
                    </div>
                    <div className="xs:flex xs:justify-between">
                      <div className="flex space-x-2 mb-1 xs:mb-0">
                        <CalendarIcon className="w-4 align-center" />
                        <span>{format(new Date(entry.timeStart), "M/d/y")}</span>
                      </div>
                      <div className="flex space-x-2">
                        <ClockIcon className="w-4 align-center" />
                        <div className="flex">
                          {format(new Date(entry.timeStart), "p")}
                          <ArrowNarrowRightIcon className="mx-2 w-4" />
                          {format(new Date(entry.timeEnd), "p")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </FadeIn>
    </MainContent.InnerWrapper>
  );
}
interface Props {
  showTimesheetEntry: (entryId: string) => Promise<void>;
  finalizeTimesheet: (ids: string[], approve: boolean) => Promise<string>;
}
