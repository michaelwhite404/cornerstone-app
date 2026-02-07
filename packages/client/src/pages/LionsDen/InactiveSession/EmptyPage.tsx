import FadeIn from "../../../components/FadeIn";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import { InactiveAftercarePagesProps } from "../../../types/aftercareTypes";

export default function EmptyPage({ setPageState }: InactiveAftercarePagesProps) {
  return (
    <FadeIn>
      <div className="flex justify-end mb-10">
        <PrimaryButton onClick={() => setPageState("students")}>Start Session</PrimaryButton>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 300 }}>
          <img src="/SleepingStudent.png" alt="Sleeping Student" />
          <p style={{ textAlign: "center", marginTop: 15, color: "gray" }}>
            There is no active session
          </p>
        </div>
      </div>
    </FadeIn>
  );
}
