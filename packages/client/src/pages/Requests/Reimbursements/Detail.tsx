import { Dialog, Transition } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { format } from "date-fns";
import React, { Fragment } from "react";
import { RM } from ".";
import {
  EmployeeModel,
  ReimbursementApproval,
  ReimbursementModel,
} from "@/types/models";
import ApprovalBadge from "@/components/Badges/ApprovalBadge";
import FadeIn from "@/components/FadeIn";
import { useToasterContext } from "@/hooks";
import wait from "@/utils/wait";
import ConfirmButtons from "../ConfirmButtons";

interface DetailProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reimbursement?: RM;
  setReimbursements: React.Dispatch<React.SetStateAction<RM[]>>;
  user: EmployeeModel;
  finalizeReimbursement: (id: string, approved: boolean) => Promise<ReimbursementModel>;
  getStatus: (approval?: ReimbursementApproval) => "Approved" | "Rejected" | "Pending";
}

export default function Detail(props: DetailProps) {
  const { showError } = useToasterContext();
  const { open, setOpen, reimbursement, setReimbursements, user, finalizeReimbursement } = props;

  const handleClose = async () => {
    setOpen(false);
    await wait(500);
    setReimbursements((rms) => rms.map((r) => ({ ...r, selected: false })));
  };

  const canApprove = reimbursement?.sendTo?._id === user._id && !reimbursement?.approval;

  const submitApproval = async (approved: boolean) => {
    if (reimbursement) {
      finalizeReimbursement(reimbursement._id, approved)
        .then((newReimbursement) =>
          setReimbursements((rs) => {
            const copy = [...rs];
            const index = copy.findIndex((r) => r._id === reimbursement._id);
            copy[index] = {
              ...copy[index],
              status: props.getStatus(newReimbursement.approval),
              approval: newReimbursement.approval,
            };
            return copy;
          })
        )
        .catch((err) => showError(err));
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
                  {reimbursement && (
                    <div className="flex h-full flex-col overflow-y-scroll bg-white px-7 pb-6 shadow-xl">
                      <div className="z-10 flex justify-between align-center sticky top-0 bg-white pt-7 pb-2">
                        <div className="flex align-center">
                          <button
                            className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                            onClick={() => handleClose()}
                          >
                            <ArrowLeftIcon className="w-4" />
                          </button>
                          <span className="text-xl font-semibold ml-4">
                            {reimbursement.purpose}
                          </span>
                        </div>
                        <ApprovalBadge status={reimbursement.status} />
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {/* Replace with your content */}
                        <div className="absolute inset-0">
                          {canApprove && <ConfirmButtons submitApproval={submitApproval} />}
                          <div className="mt-10 grid gap-8 grid-cols-2">
                            <div>
                              <FadeIn delay={125}>
                                <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">Date</div>
                                <div>{format(new Date(reimbursement.date), "P")}</div>
                              </FadeIn>
                            </div>
                            <div>
                              <FadeIn delay={125}>
                                <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">Amount</div>
                                <div>
                                  {(reimbursement.amount / 100).toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  })}
                                </div>
                              </FadeIn>
                            </div>
                            <div className="col-span-2">
                              <FadeIn delay={125}>
                                <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">Payee Name</div>
                                <div>{reimbursement.payee}</div>
                              </FadeIn>
                            </div>
                            <div className="col-span-2">
                              <FadeIn delay={125}>
                                <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">Payee Address</div>
                                <div>{reimbursement.address.street}</div>
                                <div>
                                  {reimbursement.address.city}, {reimbursement.address.state}{" "}
                                  {reimbursement.address.zip}
                                </div>
                              </FadeIn>
                            </div>
                            {reimbursement.specialInstructions && (
                              <div className="col-span-2">
                                <FadeIn delay={125}>
                                  <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">Special Instructions</div>
                                  <div>{reimbursement.specialInstructions}</div>
                                </FadeIn>
                              </div>
                            )}
                            {reimbursement.dateNeeded && (
                              <div className="col-span-2">
                                <FadeIn delay={125}>
                                  <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">Date Needed</div>
                                  <div>{format(new Date(reimbursement.dateNeeded), "P")}</div>
                                </FadeIn>
                              </div>
                            )}
                            <div className="col-span-2">
                              <FadeIn delay={125}>
                                <div className="mb-1 text-[#b6b4b4] font-medium tracking-wide text-xs uppercase">Receipt</div>
                                <div className="w-28">
                                  <img src={reimbursement.receipt} alt="Receipt" />
                                </div>
                              </FadeIn>
                            </div>
                          </div>
                        </div>
                        {/* /End replace */}
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
