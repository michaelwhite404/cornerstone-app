import { AftercareSessionModel, StudentModel } from "./models";

export type InactivePageState = "empty" | "students" | "dropIns";

export interface InactiveAftercarePagesProps {
  setPageState: React.Dispatch<React.SetStateAction<InactivePageState>>;
  setStudentsToAdd: React.Dispatch<React.SetStateAction<StudentModel[]>>;
  studentsToAdd: StudentModel[];
}

export interface CurrentSession {
  session: AftercareSessionModel | null;
  attendance: AttendanceEntry[];
}

export interface AttendanceEntry {
  _id: string;
  student: {
    _id: string;
    fullName: string;
    schoolEmail: string;
  };
  session: string;
  dropIn: boolean;
  lateSignOut?: boolean;
  signOutDate?: string;
  signature?: string;
}

export type SignedOutEntry = Required<AttendanceEntry>;
