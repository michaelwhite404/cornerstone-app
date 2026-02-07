import { Button, Icon } from "@blueprintjs/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { ActionMeta } from "react-select";
import Select from "react-select";
import { StudentModel } from "../../../types/models";
import FadeIn from "../../../components/FadeIn";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import { InactiveAftercarePagesProps } from "../../../types/aftercareTypes";
import { APIStudentsResponse } from "../../../types/apiResponses";
import BackButton from "../../../components/BackButton";

interface StudentToSelect {
  student: StudentModel;
  selected: boolean;
}

interface Option {
  label: string;
  value: string;
}

interface AddDropInsProps extends InactiveAftercarePagesProps {
  startSession?: (students: string[]) => void;
}

export default function AddDropIns({ setPageState, studentsToAdd, startSession }: AddDropInsProps) {
  const [students, setStudents] = useState<StudentToSelect[]>([]);

  const selected = students.filter((s) => s.selected);

  useEffect(() => {
    getAftercareStudents();
  }, []);

  const getAftercareStudents = async () => {
    const res = await axios.get<APIStudentsResponse>("/api/v2/students", {
      params: {
        status: "Active",
        sort: "-grade,lastName",
        limit: 2000,
      },
    });
    const stu = res.data.data.students
      .filter((s) => !s.aftercare)
      .map((s) => ({ student: s, selected: false }));
    setStudents(stu);
  };

  const options = students
    .filter((s) => !s.selected)
    .map(({ student }) => ({ label: student.fullName, value: student._id }));

  const handleSelect = (_: readonly Option[], meta: ActionMeta<Option>) => {
    if (meta.action === "pop-value") return;
    const index = students.findIndex((data) => data.student._id === meta.option?.value);
    if (index > -1) {
      const copyStudents = [...students];
      copyStudents[index].selected = true;
      setStudents(copyStudents);
    }
  };

  const handleDelete = (id: string) => {
    const index = students.findIndex(({ student }) => student._id === id);
    if (index > -1) {
      const copy = [...students];
      copy[index].selected = false;
      setStudents(copy);
    }
  };

  const handleStartSession = () => {
    const studentIds: string[] = [
      ...studentsToAdd.map((s) => s._id),
      ...selected.map(({ student: s }) => s._id),
    ];
    startSession?.(studentIds);
  };

  const StudentRow = ({ student }: { student: StudentModel }) => (
    <div className="flex align-center" style={{ padding: 10, paddingLeft: 0 }}>
      <Button onClick={() => handleDelete(student._id)}>
        <Icon icon="trash" color="#ca1b1b" />
      </Button>
      <div style={{ marginLeft: 10, fontWeight: 500 }}>{student.fullName}</div>
    </div>
  );

  return (
    <FadeIn>
      <div className="flex">
        <div className="session-header">
          <BackButton onClick={() => setPageState("students")} />
          Add Drop Ins
        </div>
      </div>
      <div className="add-student-container">
        <Select
          isMulti
          options={options}
          value={[] as Option[]}
          onChange={handleSelect}
          placeholder="Students to Add"
        />
        <PrimaryButton onClick={handleStartSession}>✓ &nbsp;&nbsp; Start Session</PrimaryButton>
      </div>
      <div style={{ marginTop: 10 }}>
        {selected.map(({ student }) => (
          <StudentRow key={student._id} student={student} />
        ))}
      </div>
    </FadeIn>
  );
}
