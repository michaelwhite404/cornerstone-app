import { ExclamationIcon, ChartBarIcon, ChevronDownIcon, ChevronUpIcon, ClockIcon } from "@heroicons/react/solid";
import { format } from "date-fns";
import { ErrorLogModel } from "@/types/models/errorLogTypes";
import DeviceErrorStatusBadge from "@/components/Badges/DeviceErrorStatusBadge";
import { useToggle } from "@/hooks";

export default function ErrorLogRow({ error }: { error: ErrorLogModel }) {
  const [open, toggle] = useToggle(false);
  return (
    <div className="p-5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[#d4d4d4]">
      <div>
        <div className="flex justify-between mb-2.5">
          <div className="text-indigo-600 font-medium">{error.title}</div>
          <DeviceErrorStatusBadge status={error.status} />
        </div>
        <div className="flex justify-between text-[#bcc0d6]">
          <div>
            <div className="flex items-center mb-1">
              <ExclamationIcon className="h-5 w-5 mr-2.5 inline" />
              {new Date(error.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2.5 inline" />
              {error.description}
            </div>
          </div>
          <div style={{ alignSelf: "center" }}>
            <button onClick={toggle} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
              {open ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div>
          <div className="my-8" />
          {error.updates.length > 0 ? (
            <div className="space-y-5" style={{ color: "#bcc0d6" }}>
              {error.updates.map((update, i) => (
                <div className="">
                  <div className="font-medium">
                    <span className="text-indigo-600 mr-1">Update {i + 1}:</span>
                    <span className="text-gray-500">{update.description}</span>
                  </div>
                  <div className="flex mb-1">
                    <ClockIcon className="mr-1" width={15} fill="#4f46e5" />
                    {format(new Date(update.createdAt), "LLLL d, yyyy - h:m a")}
                  </div>
                  <div className="flex">{update.status}</div>
                </div>
              ))}
            </div>
          ) : (
            <span className="font-medium text-gray-500">There are no updates...... yet</span>
          )}
        </div>
      )}
    </div>
  );
}
