import Slideover from "../../components/Slideover";
import { StudentData } from "./LionsDenStudents";

export default function StudentDataModal(props: Props) {
  const { open, setOpen } = props;
  const handleClose = () => setOpen(false);
  return (
    <Slideover open={open} onOverlayClick={handleClose}>
      <div className="flex h-full flex-col overflow-y-scroll bg-white px-7 pb-6 shadow-xl">
        <div className="z-10 flex justify-between align-center sticky top-0 bg-white pt-7 pb-2">
          Modal
        </div>
        <button onClick={handleClose}>Close</button>
      </div>
    </Slideover>
  );
}

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  studentData?: StudentData;
}
