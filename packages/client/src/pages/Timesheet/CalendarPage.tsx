import axios, { AxiosError } from "axios";
import { useState } from "react";
import Modal from "../../components/Modal";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useAuth, useToasterContext } from "../../hooks";
import { APIError } from "../../types/apiResponses";
import AddEntry from "./AddEntry";
import Calendar from "./Calendar";

export default function CalendarPage(props: Props) {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const { showToaster } = useToasterContext();

  const { showTimesheetEntry } = props;

  const addTimesheetEntry = async (data: AddTimesheetData) => {
    try {
      const res = await axios.post("/api/v2/timesheets", data);
      setDate(new Date(res.data.data.timesheetEntry.timeEnd));
      setModalOpen(false);
      showToaster("Entry added successfully", "success");
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  return (
    <div className="sm:px-6 px-5 pt-2.5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 style={{ marginBottom: "10px" }}>Timesheet</h1>
        <PrimaryButton text="+ Add Entry" onClick={() => setModalOpen(true)} />
      </div>
      <Calendar showTimesheetEntry={showTimesheetEntry} date={date} setDate={setDate} />
      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        onClose={() => setModalOpen(false)}
        disableOverlayClick
      >
        <AddEntry
          user={user}
          closeModal={() => setModalOpen(false)}
          addTimesheetEntry={addTimesheetEntry}
        />
      </Modal>
    </div>
  );
}

interface AddTimesheetData {
  description: string;
  department: string;
  timeStart: string;
  timeEnd: string;
}

interface Props {
  showTimesheetEntry: (entryId: string) => Promise<void>;
}
