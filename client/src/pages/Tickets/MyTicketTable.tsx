import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/solid";
import capitalize from "capitalize";
import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";
import { singular } from "pluralize";
import { Link } from "react-router-dom";
import { TicketModel } from "../../../../src/types/models";
import PriorityCircle from "../../components/PriorityCircle";
import TableWrapper from "../../components/TableWrapper";

interface MyTicketTableProps {
  tickets: TicketModel[];
}
export default function MyTicketTable({ tickets }: MyTicketTableProps) {
  return (
    <TableWrapper>
      <div className="px-4 sm:px-8 p-2 grid grid-cols-[1fr_110px_70px] items-center bg-gray-50 border-b font-medium">
        <div className="uppercase text-gray-400 text-[12px] tracking-[1px]">Ticket</div>
        <div className="text-center uppercase text-gray-400 text-[12px] tracking-[1px] hidden sm:block">
          Priority
        </div>
        <div className="text-center uppercase text-gray-400 text-[12px] tracking-[1px]  hidden sm:block">
          Status
        </div>
      </div>
      <div className="bg-white divide-y divide-gray-200">
        {tickets.map((ticket) => (
          <div key={ticket._id}>
            <div className="hidden sm:block">
              <DesktopRow ticket={ticket} />
            </div>
            <div className="block sm:hidden">
              <MobileRow ticket={ticket} />
            </div>
          </div>
        ))}
      </div>
    </TableWrapper>
  );
}

const MobileRow = ({ ticket }: { ticket: TicketModel }) => {
  const Icon = ticket.status === "OPEN" ? LockOpenIcon : LockClosedIcon;
  const color = ticket.status === "OPEN" ? "green" : "red";
  return (
    <Link
      to={`/tickets/${ticket.ticketId}`}
      className="px-4 sm:px-8 p-2 grid grid-cols-[35px_1fr_70px] items-center w-full"
    >
      <div>
        <Icon className={`h-5 w-5 text-${color}-500`} aria-hidden="true" />
      </div>
      <div>
        <div className="text-[16px] font-medium hover:text-blue-500">
          {ticket.title}
          <span className="text-xs text-gray-400 ml-2">#{ticket.ticketId}</span>
        </div>
      </div>
      <div className="text-right text-gray-400 font-light text-[12px]">
        {dateDistanceFormat(new Date(ticket.createdAt))}
      </div>
    </Link>
  );
};

const DesktopRow = ({ ticket }: { ticket: TicketModel }) => {
  return (
    <div className="px-4 sm:px-8 p-2 grid grid-cols-[1fr_110px_70px] items-center w-full">
      <div>
        <Link
          to={`/tickets/${ticket.ticketId}`}
          className="text-[16px] font-medium hover:text-blue-500"
        >
          {ticket.title}
        </Link>
        <div className="text-xs text-gray-400 mt-1">
          {ticket.status === "OPEN" &&
            `#${ticket.ticketId} opened ${formatDistanceToNow(new Date(ticket.createdAt))} ago by ${
              ticket.submittedBy.fullName
            }`}
          {ticket.status === "CLOSED" &&
            `#${ticket.ticketId} closed ${formatDistanceToNow(new Date(ticket.closedAt!))} ago by ${
              ticket.closedBy.fullName
            }`}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="h-10 w-10">
          <PriorityCircle priority={ticket.priority} />
        </div>
        {/* {capitalize(ticket.priority.toLowerCase())} */}
      </div>
      <div className="text-center">{capitalize(ticket.status.toLowerCase())}</div>
    </div>
  );
};

const dateDistanceFormat = (date: Date) => {
  const units: { [x: string]: any } = {
    second: "s",
    minute: "m",
    hour: "h",
    day: "d",
    month: "mo",
    year: "y",
  };
  const result = formatDistanceToNowStrict(date);
  const [number, unit] = result.split(" ");
  return number + units[singular(unit)];
};
