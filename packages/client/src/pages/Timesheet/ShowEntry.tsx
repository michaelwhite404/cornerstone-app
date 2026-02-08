import { ArrowLeftIcon } from "@heroicons/react/solid";
import { format } from "date-fns";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import { TimesheetModel } from "../../types/models";
import "react-circular-progressbar/dist/styles.css";
import CircularProgressProvider from "../../components/CircularProgressProvider";
import FadeIn from "../../components/FadeIn";
import ApprovalBadge from "../../components/Badges/ApprovalBadge";

export default function ShowEntry(props: ShowEntryProps) {
  return (
    <div className="px-7 pb-7 h-full overflow-scroll bg-white">
      <div className="block sm:flex justify-between align-center sticky top-0 bg-white pt-7 pb-2">
        <div className="mb-4 sm:mb-0 flex align-center">
          <span
            className="p-1 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => props.closeDrawer()}
          >
            <ArrowLeftIcon className="w-4" />
          </span>
          <span className="text-xl font-semibold ml-4">Timesheet Entry</span>
        </div>
        <ApprovalBadge status={props.entry.status} />
      </div>
      <div className="sm:mt-10 mt-6 grid gap-8">
        <div className="col-span-2">
          <FadeIn>
            <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">
              Description
            </div>
            <div>{props.entry.description}</div>
          </FadeIn>
        </div>
        <div className="col-span-2">
          <FadeIn>
            <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">
              Date
            </div>
            <div>{format(new Date(props.entry.timeStart), "PPPP")}</div>
          </FadeIn>
        </div>
        <div>
          <FadeIn>
            <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">
              Time Start
            </div>
            <div>{format(new Date(props.entry.timeStart), "p")}</div>
          </FadeIn>
        </div>
        <div>
          <FadeIn>
            <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">
              Time End
            </div>
            <div>{format(new Date(props.entry.timeEnd), "p")}</div>
          </FadeIn>
        </div>
        <div className="col-span-2">
          <FadeIn>
            <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">
              Department
            </div>
            <div>{props.entry.department.name}</div>
          </FadeIn>
        </div>
        <div className="col-span-2">
          <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">
            <FadeIn>Hours</FadeIn>
          </div>
          <div className="w-28 h-28 mt-3">
            <CircularProgressProvider valueStart={0} valueEnd={props.entry.hours!}>
              {(value) => (
                <CircularProgressbarWithChildren
                  minValue={0}
                  maxValue={8}
                  value={value}
                  styles={buildStyles({
                    pathColor: "#2972e7",
                    trailColor: "#f6f6f6",
                  })}
                >
                  <div className="text-3xl font-bold relative right-1">{props.entry.hours}</div>
                  <div className="relative text-gray-400">/8</div>
                </CircularProgressbarWithChildren>
              )}
            </CircularProgressProvider>
          </div>
        </div>
        {props.entry.finalizedAt && (
          <>
            <div className="col-span-2">
              <FadeIn>
                <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">
                  {props.entry.status} At
                </div>
                <div>{format(new Date(props.entry.finalizedAt), "PPPp")}</div>
              </FadeIn>
            </div>
            <div className="col-span-2">
              <FadeIn>
                <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">
                  {props.entry.status} By
                </div>
                <div>{props.entry.finalizedBy?.fullName}</div>
              </FadeIn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface ShowEntryProps {
  entry: TimesheetModel;
  closeDrawer: () => void;
}
