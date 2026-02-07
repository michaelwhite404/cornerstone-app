import { ReactNode } from "react";
import classNames from "classnames";
import { format } from "date-fns";
import Slideover from "../../components/Slideover";
import TableWrapper from "../../components/TableWrapper";
import { StudentData } from "./LionsDenStudents";
import { XIcon } from "@heroicons/react/solid";
import { Dialog } from "@headlessui/react";
import { numberToGrade } from "../../utils/grades";

const lateImgStyle = {
  filter: "invert(34%) sepia(88%) saturate(6583%) hue-rotate(350deg) brightness(90%) contrast(89%)",
};

const Stat = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="w-full border rounded-xl p-4">
    <div className="truncate text-sm font-medium text-gray-500 mb-1">{label}</div>
    <div className="text-2xl font-medium text-gray-900">{children}</div>
  </div>
);

export default function StudentDataModal(props: Props) {
  const { open, setOpen, studentData } = props;

  const handleClose = () => setOpen(false);
  return (
    <Slideover open={open} onOverlayClick={handleClose}>
      <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
        <div className="bg-blue-700 py-4 px-4 sm:px-6">
          <div className="flex justify-between">
            {studentData && (
              <div>
                <Dialog.Title className="text-lg font-medium text-white">
                  {studentData.studentStat.fullName}
                </Dialog.Title>
                <div className="mt-1">
                  <p className="text-sm text-indigo-300">
                    {typeof studentData.studentStat.grade === "number"
                      ? `${numberToGrade(studentData.studentStat.grade)} • `
                      : null}
                    {studentData.studentStat.aftercare ? "Enrolled" : "Unenrolled"}
                  </p>
                </div>
              </div>
            )}
            <div className="ml-3 flex h-7 items-center">
              <button
                type="button"
                className="rounded-md  text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                onClick={handleClose}
              >
                <span className="sr-only">Close panel</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <div className="py-6 px-6">
          <div className="flex gap-2">
            <Stat label="Days Present">{studentData?.studentStat.entriesCount}</Stat>
            <Stat label="Late">{studentData?.studentStat.lateCount}</Stat>
          </div>
          {studentData && (
            <TableWrapper>
              <table>
                <thead>
                  <tr>
                    <th className="pl-4">Date</th>
                    <th>Time</th>
                    <th>Signature</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.entries.map((entry) => {
                    if (!entry.signOutDate) {
                      return null;
                    }
                    return (
                      <tr
                        key={entry._id}
                        className={classNames({ "text-red-600": entry.lateSignOut }, "border-b")}
                      >
                        <td className="pl-4">{format(new Date(entry.signOutDate), "P")}</td>
                        <td>{format(new Date(entry.signOutDate), "h:mm aa")}</td>
                        <td className="w-24">
                          <img
                            className="py-1 h-10"
                            style={entry.lateSignOut ? lateImgStyle : undefined}
                            src={`/images/${entry.signature}`}
                            alt="Signature"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableWrapper>
          )}
        </div>
      </div>
    </Slideover>
  );
}

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  studentData?: StudentData;
}
