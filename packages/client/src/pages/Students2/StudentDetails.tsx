import { Divider } from "../../components/ui";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useLocation, useOutletContext, useParams } from "react-router-dom";
import { StudentModel } from "../../types/models";
import { useStudent, useUpdateStudentPasswords } from "../../api";
import BackButton from "../../components/BackButton";
import FadeIn from "../../components/FadeIn";
import LabeledInput2 from "../../components/LabeledInput2";
import MainContent from "../../components/MainContent";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useAuth, useToasterContext } from "../../hooks";
import { APIError } from "../../types/apiResponses";
import { numberToGrade } from "../../utils/grades";

import StudentDevicesTable from "./StudentDevicesTable";
import StudentTextbooksTable from "./StudentTextbooksTable";

interface StudentDetailProps {
  student: StudentModel | undefined;
  setSelectedStudent: React.Dispatch<React.SetStateAction<StudentModel | undefined>>;
  onBack: () => void;
}

export default function StudentDetails() {
  const location = useLocation();
  const { user } = useAuth();
  const [passwordReset, setPasswordReset] = useState("");
  const { slug } = useParams<{ slug: string }>();
  const { showToaster } = useToasterContext();
  const { student, setSelectedStudent, onBack } = useOutletContext<StudentDetailProps>();
  const updatePasswordMutation = useUpdateStudentPasswords();

  // Check if this is a new student from navigation state
  const isNewStudent = (location.state as any)?.newStudent;

  // Fetch student with full projection (skip if new student from create flow)
  const { data: fetchedStudent, error } = useStudent(isNewStudent ? "" : (slug || ""), { projection: "FULL" });

  // Sync fetched student to parent state
  useEffect(() => {
    if (isNewStudent) {
      window.history.replaceState({}, document.title);
    } else if (fetchedStudent) {
      setSelectedStudent(fetchedStudent);
    } else if (error) {
      showToaster("Could not fetch student. Please try again", "danger");
    }
  }, [fetchedStudent, error, isNewStudent, setSelectedStudent, showToaster]);

  const canUpdatePassword =
    (user?.role === "Admin" ||
      user?.role === "Super Admin" ||
      user?.homeroomGrade === student?.grade) &&
    student?.status === "Active";

  const resetPassword = async () => {
    try {
      await updatePasswordMutation.mutateAsync({
        students: [
          {
            email: student!.schoolEmail,
            password: passwordReset,
          },
        ],
      });
      setPasswordReset("");
      showToaster("Password Reset", "success");
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  return (
    <MainContent.InnerWrapper>
      <MainContent.Header>
        <div style={{ display: "flex", alignItems: "center" }}>
          <BackButton onClick={onBack} />
          <span style={{ fontWeight: 500, fontSize: 16 }}>Back to Students</span>
        </div>
      </MainContent.Header>
      <div style={{ overflowY: "scroll" }}>
        <div className="pb-8">
          {student && (
            <FadeIn>
              <div
                className="z-10"
                style={{ filter: "drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5))" }}
              >
                <div className="h-[250px] -ml-10" style={{
                  backgroundImage: "linear-gradient(180deg, rgba(39, 39, 39, 0.7), rgba(39, 39, 39, 0.7)), url(https://uploads-ssl.webflow.com/5f11b0f9a179803d92d0d70e/5f4949b94ed6d65fbe4b23d1_perry-grone-lbLgFFlADrY-unsplash.jpg)",
                  backgroundPosition: "0px 0px, 50% 57%",
                  backgroundSize: "auto, cover",
                  backgroundRepeat: "repeat, no-repeat",
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 110px))",
                  WebkitClipPath: "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 110px))",
                }}></div>
              </div>
              <div className="md:mx-12 mx-6 -mt-28 z-20 relative">
                <div className="flex items-end">
                  <div className="mr-5">
                    {/* School Image */}
                    <div
                      className="bg-gray-600 w-40 min-h-[190px] rounded-md border-[3px] border-white overflow-hidden"
                      style={{
                        boxShadow: "0 0 10px 2px rgb(0 0 0 / 51%)",
                        backgroundImage: "url(/Cornerstone-Logo.png)",
                        backgroundSize: "110px",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                    >
                      {student.mainPhoto && (
                        <img className="" src={student.mainPhoto} alt={student.firstName} />
                      )}
                    </div>
                  </div>
                  <div className="pb-3">
                    <h1 className="font-medium text-3xl mb-1">{student.fullName}</h1>
                    <div className="text-gray-500 font-light text-lg">
                      {student.status === "Active"
                        ? student.grade! === 0
                          ? "Kindergarten"
                          : `${numberToGrade(student.grade!)} Grade`
                        : student.status}
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <div className="font-medium text-gray-700 text-base">Status</div>
                      <div className="text-gray-500">{student.status}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 text-base">School Email</div>
                      <div className="text-gray-500">{student.schoolEmail}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 text-base">Aftercare</div>
                      <div className="text-gray-500">{student.aftercare ? "Yes" : "No"}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <div className="font-medium text-gray-700 text-base">Groups</div>
                  <div className="text-gray-500 mt-1">
                    {student.groups && student.groups.length > 0 ? (
                      <div>
                        {student.groups.map((group) => (
                          <div className="mb-1" key={group.id}>
                            {group.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>{student.firstName} is not a part of any groups</div>
                    )}
                  </div>
                </div>
                <div className="mt-10">
                  <div className="font-medium text-gray-700 text-base">Textbooks Checked Out</div>
                  {student.textbooks && student.textbooks.length > 0 ? (
                    <StudentTextbooksTable textbooks={student.textbooks} />
                  ) : (
                    <div className="text-gray-500 mt-1">
                      {student.firstName} does not have any textbooks checked out
                    </div>
                  )}
                </div>
                <div className="mt-10">
                  <div className="font-medium text-gray-700 text-base">Devices</div>
                  {student.devices && student.devices.length > 0 ? (
                    <StudentDevicesTable devices={student.devices} />
                  ) : (
                    <div className="text-gray-500 mt-1">
                      {student.firstName} does not have any devices assigned or checked out
                    </div>
                  )}
                </div>
                <div className="py-10 px-5">
                  <Divider />
                </div>
                {canUpdatePassword && (
                  <div className="">
                    <div className="font-medium text-gray-700 text-base">Reset Password</div>
                    <div className="flex items-center">
                      <div className="w-64 mr-4">
                        <LabeledInput2
                          type="password"
                          className="mr-4"
                          label=""
                          value={passwordReset}
                          onChange={(e) => setPasswordReset(e.target.value)}
                          placeholder="Password"
                        />
                      </div>
                      <PrimaryButton
                        className="mt-1"
                        text="Reset"
                        disabled={passwordReset.length < 8}
                        onClick={resetPassword}
                      />
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </MainContent.InnerWrapper>
  );
}
