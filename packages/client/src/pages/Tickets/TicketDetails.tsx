import {
  // BellIcon,
  CalendarIcon,
  ChatAltIcon,
  CheckCircleIcon,
  LockClosedIcon,
  LockOpenIcon,
  // PencilIcon,
} from "@heroicons/react/solid";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { format } from "date-fns";
import pluralize from "pluralize";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { EmployeeModel } from "../../types/models";
import { useTicket, useUpdateTicket, useCloseTicket } from "../../api";
import { useAuth, useDocTitle, useToasterContext } from "../../hooks";
import ActivityFeed from "./ActivityFeed";
import AssignUser from "./AssignUser";
import CloseTicketModal from "./CloseTicketModal";

export default function TicketDetails() {
  useDocTitle("Tickets | Cornerstone App");
  const [comment, setComment] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { ticketId } = useParams<"ticketId">();
  const { user } = useAuth();
  const { showToaster } = useToasterContext();

  const { data: ticket } = useTicket(ticketId || "");
  const updateTicketMutation = useUpdateTicket();
  const closeTicketMutation = useCloseTicket();

  const handleCommentUpdate = async () => {
    if (!comment || !ticketId) return;
    try {
      await updateTicketMutation.mutateAsync({
        ticketId,
        type: "COMMENT",
        comment,
      });
      setComment("");
    } catch (err) {
      showToaster(getErrorMessage(err), "danger");
    }
  };

  const handleAssignUser = async (assign: string, op: "ADD" | "REMOVE") => {
    if (!ticketId) return;
    await updateTicketMutation.mutateAsync({
      ticketId,
      type: "ASSIGN",
      assign,
      op,
    });
  };

  const canCloseTicket =
    ticket &&
    ticket.status === "OPEN" &&
    (ticket.assignedTo as EmployeeModel[]).some((employee) => employee._id === user!._id);

  const closeTicket = async () => {
    if (!canCloseTicket || !ticket) return;
    try {
      await closeTicketMutation.mutateAsync(ticket.ticketId);
      showToaster("Ticket closed", "success");
    } catch (err) {
      showToaster(getErrorMessage(err), "danger");
    }
  };

  return (
    <>
      {ticket && (
        <main className="flex-1 bg-white min-h-full">
          <div className="py-8 xl:py-10">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3">
              <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
                <div>
                  <div>
                    <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
                        <p className="mt-2 text-sm text-gray-500">
                          #{ticketId} opened by{" "}
                          <Link to="#" className="font-medium text-gray-900">
                            {ticket.submittedBy.fullName}
                          </Link>{" "}
                          in{" "}
                          <Link to="#" className="font-medium text-gray-900">
                            {ticket.department.name}
                          </Link>
                        </p>
                      </div>
                      {canCloseTicket && (
                        <div className="mt-4 flex space-x-3 md:mt-0">
                          {/* <button
                          type="button"
                          className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                        >
                          <PencilIcon
                            className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                        >
                          <BellIcon
                            className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span>Subscribe</span>
                        </button> */}
                          <button
                            type="button"
                            className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                            onClick={() => setModalOpen(true)}
                          >
                            <CheckCircleIcon
                              className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            <span>Close ticket</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <aside className="mt-8 xl:hidden">
                      <h2 className="sr-only">Details</h2>
                      <div className="space-y-5">
                        <div className="flex items-center space-x-2">
                          {ticket.status === "OPEN" ? (
                            <>
                              <LockOpenIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                              <span className="text-green-700 text-sm font-medium">
                                Open Ticket
                              </span>
                            </>
                          ) : (
                            <>
                              <LockClosedIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                              <span className="text-red-700 text-sm font-medium">
                                Closed Ticket
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <ChatAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          <span className="text-gray-900 text-sm font-medium">
                            {pluralize("updates", ticket.updates?.length || 0, true)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          <span className="text-gray-900 text-sm font-medium">
                            Created on <time>{format(new Date(ticket.createdAt), "PP")}</time>
                          </span>
                        </div>
                      </div>
                      <div className="mt-6 border-t border-b border-gray-200 py-6 space-y-8">
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">Assignees</h2>
                          <ul className="mt-3 space-y-3">
                            {(ticket.assignedTo as EmployeeModel[] | undefined)?.map((user) => (
                              <li className="flex justify-start" key={user._id}>
                                <Link to="#" className="flex items-center space-x-3">
                                  <div className="flex-shrink-0">
                                    <img
                                      className="h-5 w-5 rounded-full"
                                      src={user.image || "/avatar_placeholder.png"}
                                      alt={user.fullName}
                                      onError={(e) =>
                                        (e.currentTarget.src = "/avatar_placeholder.png")
                                      }
                                    />
                                  </div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.fullName}
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                          {/* {ticket.status === "OPEN" && <AssignUser assignUser={assignUser} setTicket={setTicket} />} */}
                        </div>
                        {/* <div>
                          <h2 className="text-sm font-medium text-gray-500">Tags</h2>
                          <ul className="mt-2 leading-8">
                            <li className="inline">
                              <Link
                                to="#"
                                className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                              >
                                <div className="absolute flex-shrink-0 flex items-center justify-center">
                                  <span
                                    className="h-1.5 w-1.5 rounded-full bg-rose-500"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div className="ml-3.5 text-sm font-medium text-gray-900">Bug</div>
                              </Link>{" "}
                            </li>
                            <li className="inline">
                              <Link
                                to="#"
                                className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                              >
                                <div className="absolute flex-shrink-0 flex items-center justify-center">
                                  <span
                                    className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div className="ml-3.5 text-sm font-medium text-gray-900">
                                  Accessibility
                                </div>
                              </Link>{" "}
                            </li>
                          </ul>
                        </div> */}
                      </div>
                    </aside>
                    <div className="py-3 xl:pt-6 xl:pb-0">
                      <h2 className="sr-only">Description</h2>
                      <div className="prose max-w-none">
                        <p>{ticket.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <section aria-labelledby="activity-title" className="mt-8 xl:mt-10">
                  <div>
                    <div className="divide-y divide-gray-200">
                      <div className="pb-4">
                        <h2 id="activity-title" className="text-lg font-medium text-gray-900">
                          Activity
                        </h2>
                      </div>
                      <div className="pt-6">
                        {/* Activity feed*/}
                        {ticket.updates && <ActivityFeed updates={ticket.updates} />}
                        {ticket.status === "OPEN" && (
                          <div className="mt-6">
                            <div className="flex space-x-3">
                              <div className="flex-shrink-0">
                                <div className="relative">
                                  <img
                                    className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                                    src={user!.image}
                                    alt={user!.fullName}
                                    onError={(e) =>
                                      (e.currentTarget.src = "/avatar_placeholder.png")
                                    }
                                  />

                                  <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                                    <ChatAltIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div>
                                  <div>
                                    <label htmlFor="comment" className="sr-only">
                                      Comment
                                    </label>
                                    <textarea
                                      id="comment"
                                      name="comment"
                                      rows={3}
                                      className="shadow-sm block w-full focus:ring-gray-900 focus:border-gray-900 sm:text-sm border border-gray-300 rounded-md"
                                      placeholder="Leave a comment"
                                      value={comment}
                                      onChange={(e) => setComment(e.target.value)}
                                    />
                                  </div>
                                  <div className="mt-6 flex items-center justify-end space-x-4">
                                    {/* <button
                                      type="button"
                                      className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                      onClick={closeTicket}
                                    >
                                      <CheckCircleIcon
                                        className="-ml-1 mr-2 h-5 w-5 text-green-500"
                                        aria-hidden="true"
                                      />
                                      <span>Close ticket</span>
                                    </button> */}
                                    <button
                                      type="submit"
                                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:bg-gray-200"
                                      onClick={handleCommentUpdate}
                                      disabled={!comment}
                                    >
                                      Comment
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <aside className="hidden xl:block xl:pl-8">
                <h2 className="sr-only">Details</h2>
                <div className="space-y-5">
                  <div className="flex items-center space-x-2">
                    {ticket.status === "OPEN" ? (
                      <>
                        <LockOpenIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                        <span className="text-green-700 text-sm font-medium">Open Ticket</span>
                      </>
                    ) : (
                      <>
                        <LockClosedIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                        <span className="text-red-700 text-sm font-medium">Closed Ticket</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <ChatAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span className="text-gray-900 text-sm font-medium">
                      {pluralize("updates", ticket.updates?.length || 0, true)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span className="text-gray-900 text-sm font-medium">
                      Created on <time>{format(new Date(ticket.createdAt), "PP")}</time>
                    </span>
                  </div>
                </div>
                <div className="mt-6 border-t border-gray-200 py-6 space-y-8">
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Assignees</h2>
                    <ul className="mt-3 space-y-3">
                      {(ticket.assignedTo as EmployeeModel[] | undefined)?.map((user) => (
                        <li className="flex justify-start" key={user._id}>
                          <Link to="#" className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <img
                                className="h-5 w-5 rounded-full"
                                src={user.image || "/avatar_placeholder.png"}
                                alt={user.fullName}
                                onError={(e) => (e.currentTarget.src = "/avatar_placeholder.png")}
                              />
                            </div>
                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {/* Add assignees */}
                    {ticket.status === "OPEN" && (
                      <AssignUser onAssign={handleAssignUser} />
                    )}
                  </div>
                  {/* <div>
                    <h2 className="text-sm font-medium text-gray-500">Tags</h2>
                    <ul className="mt-2 leading-8">
                      <li className="inline">
                        <Link
                          to="#"
                          className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                        >
                          <div className="absolute flex-shrink-0 flex items-center justify-center">
                            <span
                              className="h-1.5 w-1.5 rounded-full bg-rose-500"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-3.5 text-sm font-medium text-gray-900">Bug</div>
                        </Link>{" "}
                      </li>
                      <li className="inline">
                        <Link
                          to="#"
                          className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                        >
                          <div className="absolute flex-shrink-0 flex items-center justify-center">
                            <span
                              className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-3.5 text-sm font-medium text-gray-900">
                            Accessibility
                          </div>
                        </Link>{" "}
                      </li>
                    </ul>
                  </div> */}
                </div>
              </aside>
            </div>
          </div>
          <CloseTicketModal closeTicket={closeTicket} open={modalOpen} setOpen={setModalOpen} />
        </main>
      )}
    </>
  );
}
