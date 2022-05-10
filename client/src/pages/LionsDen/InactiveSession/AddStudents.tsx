import { Label } from "@blueprintjs/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { StudentModel } from "../../../../../src/types/models";
import BackButton from "../../../components/BackButton";
import FadeIn from "../../../components/FadeIn";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import { useWindowSize } from "../../../hooks";
import useChecker from "../../../hooks/useChecker";
import { InactiveAftercarePagesProps } from "../../../types/aftercareTypes";
import { APIStudentsResponse } from "../../../types/apiResponses";

export default function AddStudents({
  setPageState,
  setStudentsToAdd,
  studentsToAdd,
}: InactiveAftercarePagesProps) {
  const [students, setStudents] = useState<StudentModel[]>([]);
  const { rows, checked } = useChecker(students, {
    onChange: setStudentsToAdd,
    key: "_id",
    initialCheck: studentsToAdd?.map((s) => s._id),
  });
  const { ref, inView } = useInView({ threshold: 0 });
  const [width] = useWindowSize();

  useEffect(() => {
    getAftercareStudents();
  }, []);

  const getAftercareStudents = async () => {
    const res = await axios.get<APIStudentsResponse>("/api/v2/aftercare/students");
    setStudents(res.data.data.students);
  };

  const onButtonClick = () => {
    setStudentsToAdd(checked);
    setPageState("dropIns");
  };

  return (
    <div>
      <FadeIn>
        <div ref={ref} className="flex align-center space-between">
          <div className="session-header">
            <BackButton onClick={() => setPageState("empty")} />
            Add Students
          </div>
          <PrimaryButton onClick={onButtonClick}>Add Drop Ins</PrimaryButton>
        </div>
        <div style={{ marginBottom: 50 }}>
          {rows.map(({ Checkbox, original, rowId }) => (
            <div key={rowId}>
              <Label style={{ marginBottom: 0, fontWeight: 500 }}>
                <Checkbox />
                {original.fullName}
              </Label>
            </div>
          ))}
        </div>
      </FadeIn>
      <div
        style={{
          width: width > 991 ? "calc(100% - 281px)" : "100%",
          position: "fixed",
          bottom: 20,
          visibility: inView ? "hidden" : "visible",
          opacity: inView ? 0 : 1,
          transition: "visibility 500ms, opacity 0.5s ease",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <PrimaryButton onClick={onButtonClick}>Add Drop Ins</PrimaryButton>
      </div>
    </div>
  );
}
