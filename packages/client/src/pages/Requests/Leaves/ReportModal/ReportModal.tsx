import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { Fragment, useState } from "react";
import { useGenerateLeaveReport } from "@/api";
import wait from "@/utils/wait";
import FileTypeCards from "./FileTypeCards";
import LeaveFields from "./LeaveFields";

const initialFields = [
  { text: "Reason for Leave", value: "reason", checked: true },
  { text: "Submitting User", value: "submittingUser", checked: true },
  { text: "Date Start", value: "dateStart", checked: true },
  { text: "Date End", value: "dateEnd", checked: true },
  { text: "Status", value: "status", checked: true },
  { text: "Finalized By", value: "finalizedBy", checked: true },
  { text: "Finalized At", value: "finalizedAt", checked: true },
  { text: "Created At", value: "createdAt", checked: true },
];
export type ExportType = "sheets" | "csv" | "excel" | "pdf";

export function ReportModal(props: Props) {
  const { closeModal, isOpen } = props;
  const [type, setType] = useState<ExportType>("sheets");
  const [fields, setFields] = useState(initialFields);
  const generateReportMutation = useGenerateLeaveReport();
  const submitting = generateReportMutation.isPending;

  const resetData = () => {
    setType("sheets");
    setFields([...initialFields]);
  };

  const handleClose = async () => {
    closeModal();
    await wait(200);
    resetData();
  };

  const submit = async () => {
    const data = {
      type,
      fields: fields.reduce((arr, field) => {
        if (field.checked) arr.push(field.value);
        return arr;
      }, [] as string[]),
    };
    const result = await generateReportMutation.mutateAsync(data);
    switch (type) {
      case "sheets":
        if (result.spreadsheetUrl) {
          window.open(result.spreadsheetUrl, "_blank");
        }
        break;
      case "csv":
        if (result.blob) {
          const url = window.URL.createObjectURL(result.blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `leave-report_${new Date().toISOString()}.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
        break;
    }
    handleClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg overflow-hidden text-left shadow-xl transform transition-all sm:my-8 sm:mx-4 sm:max-w-4xl sm:w-full">
                <div className="relative">
                  {submitting && (
                    <div className="absolute inset-0 bg-gray-500/75 flex items-center justify-center z-50">
                      <div className="flex flex-col items-center">
                        <svg
                          className="animate-spin h-8 w-8 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span className="text-white font-medium text-lg mt-2">
                          Generating Report
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                    <button
                      type="button"
                      className="rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={handleClose}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" onClick={handleClose} />
                    </button>
                  </div>
                  <div className="text-white px-6 pt-4 pb-2 bg-blue-600 rounded-t-md">
                    <span className="font-medium text-xl">Generate Leaves Report</span>
                    <p className="mt-1">Select the following information to generate a report.</p>
                  </div>
                  <div className="px-6 pt-5 pb-4 sm:p-6 sm:pb-4 space-y-8">
                    <FileTypeCards type={type} setType={setType} />
                    <LeaveFields fields={fields} setFields={setFields} />
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-md">
                    <button
                      type="button"
                      className="disabled:bg-gray-300 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={submit}
                      // disabled={!submittable}
                    >
                      Generate Report
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

interface Props {
  isOpen: boolean;
  closeModal: VoidFunction;
}
