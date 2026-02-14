import { Dialog, Transition } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { format } from "date-fns";
import React, { Fragment } from "react";
import { Leave } from ".";
import { EmployeeModel, LeaveApproval, LeaveModel } from "@/types/models";
import ApprovalBadge from "@/components/Badges/ApprovalBadge";
import FadeIn from "@/components/FadeIn";
import { useToasterContext } from "@/hooks";
import wait from "@/utils/wait";
import ConfirmButtons from "../ConfirmButtons";

interface OutletContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selected: Leave | undefined;
  setLeaves: React.Dispatch<React.SetStateAction<Leave[]>>;
  user: EmployeeModel;
  finalizeLeave: (id: string, approved: boolean) => Promise<LeaveModel>;
  getStatus: (approval?: LeaveApproval | undefined) => "Approved" | "Rejected" | "Pending";
}

export default function Detail(props: OutletContext) {
  const { finalizeLeave, open, setOpen, selected, setLeaves, user } = props;
  const { showError } = useToasterContext();

  const handleClose = async () => {
    setOpen(false);
    await wait(500);
    setLeaves((leaves) => leaves.map((l) => ({ ...l, selected: false })));
  };
  const canApprove = selected?.sendTo?._id === user._id && !selected?.approval;

  const submitApproval = async (approved: boolean) => {
    if (selected) {
      finalizeLeave(selected._id, approved)
        .then((newLeave) =>
          setLeaves((ls) => {
            const copy = [...ls];
            const index = copy.findIndex((r) => r._id === selected._id);
            copy[index] = {
              ...copy[index],
              status: props.getStatus(newLeave.approval),
              approval: newLeave.approval,
            };
            return copy;
          })
        )
        .catch(showError);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => handleClose()}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white px-7 pb-6 shadow-xl">
                    <div className="flex justify-between align-center sticky top-0 bg-white pt-7 pb-2">
                      <div className="flex align-center">
                        <span
                          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                          onClick={() => handleClose()}
                        >
                          <ArrowLeftIcon className="w-4" />
                        </span>
                        <span className="text-xl font-semibold ml-4">{selected?.reason}</span>
                      </div>
                      {selected && <ApprovalBadge status={selected.status} />}
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {/* Replace with your content */}
                      <div className="absolute inset-0">
                        {canApprove && <ConfirmButtons submitApproval={submitApproval} />}

                        {selected && (
                          <div className="mt-10 grid gap-8 grid-cols-2">
                            <div className="col-span-2">
                              <FadeIn delay={125}>
                                <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">From</div>
                                <div>{selected.user.fullName}</div>
                              </FadeIn>
                            </div>
                            <div>
                              <FadeIn delay={125}>
                                <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">Date Start</div>
                                <div>{format(new Date(selected.dateStart), "P")}</div>
                              </FadeIn>
                            </div>
                            <div>
                              <FadeIn delay={125}>
                                <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">Date End</div>
                                <div>{format(new Date(selected.dateEnd), "P")}</div>
                              </FadeIn>
                            </div>
                            {selected.comments && (
                              <div className="col-span-2">
                                <FadeIn delay={125}>
                                  <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">Comments</div>
                                  <div>{selected.comments}</div>
                                </FadeIn>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {/* /End replace */}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
