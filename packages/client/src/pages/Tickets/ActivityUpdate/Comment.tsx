import { ChatAltIcon } from "@heroicons/react/solid";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { TicketCommentUpdateModel } from "@/types/models";

export default function Comment({ update }: { update: TicketCommentUpdateModel }) {
  return (
    <>
      <div className="relative">
        <img
          className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
          src={update.createdBy.image}
          alt={update.createdBy.fullName}
          onError={(e) => (e.currentTarget.src = "/avatar_placeholder.png")}
        />

        <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
          <ChatAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div>
          <div className="text-sm">
            <Link to="#" className="font-medium text-gray-900">
              {update.createdBy.fullName}
            </Link>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Commented {formatDistanceToNow(new Date(update.date))} ago
          </p>
        </div>
        <div className="mt-2 text-sm text-gray-700">
          <p>{update.comment}</p>
        </div>
      </div>
    </>
  );
}
