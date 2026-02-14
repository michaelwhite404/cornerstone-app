import { useEffect, useRef } from "react";
import { Checkbox, Label } from "@/components/ui";
import { useInView } from "react-intersection-observer";
import BackButton from "@/components/BackButton";
import FadeIn from "@/components/FadeIn";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import { useWindowSize, useChecker } from "@/hooks";
import { InactiveAftercarePagesProps } from "@/types/aftercareTypes";
import { useAftercareStudents } from "@/api";
import { StudentModel } from "@/types/models";

export default function AddStudents({
  setPageState,
  setStudentsToAdd,
  studentsToAdd,
}: InactiveAftercarePagesProps) {
  const { data: students = [] } = useAftercareStudents();
  const { selectedData, setSelectedData } = useChecker(students);
  const { ref, inView } = useInView({ threshold: 0 });
  const [width] = useWindowSize();
  const initialSyncDone = useRef(false);

  // Sync initial selection from parent (only once when students load)
  useEffect(() => {
    if (!initialSyncDone.current && studentsToAdd && studentsToAdd.length > 0 && students.length > 0) {
      const initialIds = studentsToAdd.map((s) => s._id);
      const initialSelected = students.filter((s) => initialIds.includes(s._id));
      setSelectedData(initialSelected);
      initialSyncDone.current = true;
    }
  }, [students, studentsToAdd, setSelectedData]);

  // Sync selection changes to parent
  useEffect(() => {
    setStudentsToAdd(selectedData);
  }, [selectedData, setStudentsToAdd]);

  const toggleStudent = (student: StudentModel) => {
    const isSelected = selectedData.some((s) => s._id === student._id);
    if (isSelected) {
      setSelectedData(selectedData.filter((s) => s._id !== student._id));
    } else {
      setSelectedData([...selectedData, student]);
    }
  };

  const onButtonClick = () => {
    setPageState("dropIns");
  };

  return (
    <div>
      <FadeIn>
        <div ref={ref} className="flex align-center space-between">
          <div className="text-lg font-medium mb-3">
            <BackButton onClick={() => setPageState("empty")} />
            Add Students
          </div>
          <PrimaryButton onClick={onButtonClick}>Add Drop Ins</PrimaryButton>
        </div>
        <div style={{ marginBottom: 50 }}>
          {students.map((student) => (
            <div key={student._id}>
              <Label className="flex items-center gap-2 mb-0 font-medium">
                <Checkbox
                  checked={selectedData.some((s) => s._id === student._id)}
                  onChange={() => toggleStudent(student)}
                />
                {student.fullName}
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
