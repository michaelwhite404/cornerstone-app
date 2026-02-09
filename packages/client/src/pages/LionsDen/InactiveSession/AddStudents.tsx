import { Label } from "../../../components/ui";
import { useInView } from "react-intersection-observer";
import BackButton from "../../../components/BackButton";
import FadeIn from "../../../components/FadeIn";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import { useWindowSize } from "../../../hooks";
import useChecker from "../../../hooks/useChecker";
import { InactiveAftercarePagesProps } from "../../../types/aftercareTypes";
import { useAftercareStudents } from "../../../api";

export default function AddStudents({
  setPageState,
  setStudentsToAdd,
  studentsToAdd,
}: InactiveAftercarePagesProps) {
  const { data: students = [] } = useAftercareStudents();
  const { rows, checked } = useChecker(students, {
    onChange: setStudentsToAdd,
    key: "_id",
    initialCheck: studentsToAdd?.map((s) => s._id),
  });
  const { ref, inView } = useInView({ threshold: 0 });
  const [width] = useWindowSize();

  const onButtonClick = () => {
    setStudentsToAdd(checked);
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
          {rows.map(({ Checkbox, original, rowId }) => (
            <div key={rowId}>
              <Label className="flex items-center gap-2 mb-0 font-medium">
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
