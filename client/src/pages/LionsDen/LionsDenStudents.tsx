import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { AftercareAttendanceEntryModel, StudentModel } from "../../../../src/types/models";
import { useToasterContext } from "../../hooks";
import {
  APIAttendanceStatsResponse,
  APIError,
  APIStudentsResponse,
} from "../../types/apiResponses";
import StudentDataModal from "./StudentDataModal";
import StudentSearch from "./StudentSearch";
import StudentsTable from "./StudentsTable";

export default function LionsDenStudents() {
  const [data, setData] = useState<StudentAftercareStat[]>([]);
  const [notInA, setNotInA] = useState<StudentModel[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { showToaster } = useToasterContext();

  const [studentData, setStudentData] = useState<StudentData>();

  useEffect(() => {
    getStudentsData();
  }, []);

  const getStudentsData = async () => {
    const getAftercareStudents = axios.get<APIStudentsResponse>("/api/v2/students", {
      params: { sort: "-grade", limit: 2000, status: "Active" },
    });
    const getAftercareData = axios.get<APIAttendanceStatsResponse>(
      "/api/v2/aftercare/attendance/stats"
    );

    const res = await Promise.all([getAftercareStudents, getAftercareData]);

    const students: StudentModel[] = [];
    const nonAftercareStudents: StudentModel[] = [];

    res[0].data.data.students.forEach((student) => {
      const array = student.aftercare ? students : nonAftercareStudents;
      array.push(student);
    });
    const { stats } = res[1].data.data;

    const studentList = stats.map((stat) => ({
      ...stat.student,
      entriesCount: stat.entriesCount,
      lateCount: stat.lateCount,
      aftercare: stat.student.aftercare,
    }));
    students.forEach((student) => {
      if (!student.aftercare) return;
      if (studentList.find((s) => s._id === student._id)) return;
      studentList.push({ ...student, entriesCount: 0, lateCount: 0, aftercare: false });
    });
    studentList.sort((a, b) => b.entriesCount - a.entriesCount);
    setData(studentList);
    setNotInA(nonAftercareStudents);
  };

  const addStudents = async (students: { label: string; value: string }[]) => {
    const data = students.map((s) => ({ id: s.value, op: "add" }));
    try {
      await axios.patch("/api/v2/aftercare/students", { data });
      getStudentsData();
      showToaster("Students Added!", "success");
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
      throw err;
    }
  };

  const removeStudents = async (students: { _id: string }[]) => {
    const data = students.map((s) => ({ id: s._id, op: "remove" }));
    try {
      await axios.patch("/api/v2/aftercare/students", { data });
      getStudentsData();
      showToaster("Students Removed!", "success");
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
      throw err;
    }
  };

  const getStudentData = async (stat: StudentAftercareStat) => {
    try {
      const res = await axios.get(`/api/v2/aftercare/students/${stat._id}`);
      setStudentData({
        studentStat: stat,
        entries: res.data.data.entries,
      });
    } catch (err) {}
  };

  const openModal = async (stat: StudentAftercareStat) => {
    await getStudentData(stat);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="session-header">Students ({data.length})</div>
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
