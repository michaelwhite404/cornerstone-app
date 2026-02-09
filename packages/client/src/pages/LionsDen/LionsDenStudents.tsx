import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { AftercareAttendanceEntryModel, StudentModel } from "../../types/models";
import { useToasterContext } from "../../hooks";
import { useStudents } from "../../api";
import { useAftercareStats, useUpdateStudentAftercare, useStudentAftercareEntries } from "../../api";
import { APIError } from "../../types/apiResponses";
import StudentDataModal from "./StudentDataModal";
import StudentSearch from "./StudentSearch";
import StudentsTable from "./StudentsTable";

export default function LionsDenStudents() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStat, setSelectedStat] = useState<StudentAftercareStat | null>(null);
  const { showToaster } = useToasterContext();

  // Fetch students and aftercare stats
  const { data: allStudents = [] } = useStudents({ sort: "-grade", limit: 2000, status: "Active" });
  const { data: stats = [] } = useAftercareStats("2024-08-01");
  const updateStudentAftercareMutation = useUpdateStudentAftercare();

  // Fetch selected student's entries when modal opens
  const { data: studentEntries = [] } = useStudentAftercareEntries(selectedStudentId || "");

  // Process data to create the student list and non-aftercare students
  const { data, notInA } = useMemo(() => {
    const students: StudentModel[] = [];
    const nonAftercareStudents: StudentModel[] = [];

    allStudents.forEach((student) => {
      const array = student.aftercare ? students : nonAftercareStudents;
      array.push(student);
    });

    const studentList: StudentAftercareStat[] = stats.map((stat) => ({
      ...stat.student,
      entriesCount: stat.entriesCount,
      lateCount: stat.lateCount,
      aftercare: stat.student.aftercare,
    }));

    students.forEach((student) => {
      if (!student.aftercare) return;
      if (studentList.find((s) => s._id === student._id)) return;
      studentList.push({ ...student, entriesCount: 0, lateCount: 0, aftercare: true });
    });
    studentList.sort((a, b) => b.entriesCount - a.entriesCount);

    return { data: studentList, notInA: nonAftercareStudents };
  }, [allStudents, stats]);

  // Prepare student data for modal
  const studentData = useMemo(() => {
    if (!selectedStat || !studentEntries.length) return undefined;
    const entries = studentEntries
      .filter((entry) => entry.signOutDate)
      .sort((a, b) => new Date(b.signOutDate!).getTime() - new Date(a.signOutDate!).getTime());
    return { studentStat: selectedStat, entries };
  }, [selectedStat, studentEntries]);

  const addStudents = async (students: { label: string; value: string }[]) => {
    const data = students.map((s) => ({ id: s.value, op: "add" as const }));
    try {
      await updateStudentAftercareMutation.mutateAsync({ data });
      showToaster("Students Added!", "success");
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
      throw err;
    }
  };

  const removeStudents = async (students: { _id: string }[]) => {
    const data = students.map((s) => ({ id: s._id, op: "remove" as const }));
    try {
      await updateStudentAftercareMutation.mutateAsync({ data });
      showToaster("Students Removed!", "success");
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
      throw err;
    }
  };

  const openModal = async (stat: StudentAftercareStat) => {
    setSelectedStudentId(stat._id);
    setSelectedStat(stat);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="text-lg font-medium mb-3">Students ({data.length})</div>
      <div>
        <StudentSearch students={notInA} onSubmit={addStudents} />
        <StudentsTable students={data} removeStudents={removeStudents} openModal={openModal} />
      </div>
      <StudentDataModal open={modalOpen} setOpen={setModalOpen} studentData={studentData} />
    </div>
  );
}

interface StudentAftercareStat {
  entriesCount: number;
  lateCount: number;
  _id: any;
  fullName: string;
  grade?: number | undefined;
  schoolEmail: string;
  aftercare: boolean;
}

export interface StudentData {
  studentStat: StudentAftercareStat;
  entries: AftercareAttendanceEntryModel[];
}
