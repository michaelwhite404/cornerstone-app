import { UserCircleIcon } from "@heroicons/react/solid";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { TicketAssignUpdateModel } from "../../../types/models";

export default function Assign({ update }: { update: TicketAssignUpdateModel }) {
  return (
    <>
      <div>
        <div className="relative px-1">
          <div className="h-8 w-8 bg-gray-100 rounded-full ring-8 ring-white flex items-center justify-center">
            <UserCircleIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1 py-1.5">
        <div className="text-sm text-gray-500">
          <Link to={`/users/${update.createdBy.slug}`} className="font-medium text-gray-900">
            {update.createdBy.fullName}
          </Link>{" "}
          {update.op === "ADD" ? "assigned " : "removed "}
          <Link to="#" className="font-medium text-gray-900">
            {update.assign.fullName}
          </Link>{" "}
          <span className="whitespace-nowrap">
            {formatDistanceToNow(new Date(update.date))} ago
          </span>
        </div>
      </div>
    </>
  );
}
