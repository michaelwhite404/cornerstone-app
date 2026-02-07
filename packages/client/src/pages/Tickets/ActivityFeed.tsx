import { TicketUpdate } from "../../types/models";
import { Assign, Comment } from "./ActivityUpdate";

export default function ActivityFeed({ updates }: { updates: TicketUpdate[] }) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {updates.map((update, itemIdx) => (
          <li key={update._id}>
            <div className="relative pb-8">
              {itemIdx !== updates.length - 1 ? (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                {update.__t === "COMMENT" && <Comment update={update} />}
                {update.__t === "ASSIGN" && <Assign update={update} />}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
