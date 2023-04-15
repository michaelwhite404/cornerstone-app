import classNames from "classnames";
import { format } from "date-fns";
import Slideover from "../../components/Slideover";
import TableWrapper from "../../components/TableWrapper";
import { StudentData } from "./LionsDenStudents";

const lateImgStyle = {
  filter: "invert(34%) sepia(88%) saturate(6583%) hue-rotate(350deg) brightness(90%) contrast(89%)",
};

export default function StudentDataModal(props: Props) {
  const { open, setOpen, studentData } = props;
  const handleClose = () => setOpen(false);
  return (
    <Slideover open={open} onOverlayClick={handleClose}>
      <div className="flex h-full flex-col overflow-y-scroll bg-white px-7 pb-6 shadow-xl">
        <div className="z-10 flex justify-between align-center sticky top-0 bg-white pt-7 pb-2">
          Modal
        </div>
        <button onClick={handleClose}>Close</button>
        {studentData && (
          <TableWrapper>
            <table>
              <tr>
                <th className="pl-4">Date</th>
                <th>Time</th>
                <th>Signature</th>
              </tr>
              {studentData.entries.map((entry) => {
                if (!entry.signOutDate) {
                  return null;
                }
                return (
                  <tr className={classNames({ "text-red-600": entry.lateSignOut }, "border-b")}>
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
            </table>
          </TableWrapper>
        )}
        {/* studentData?.entries.map((entry) => (
          <span>{entry.signOutDate}</span>
        )) */}
      </div>
    </Slideover>
  );
}

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  studentData?: StudentData;
}
