import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { Divider } from "@mui/material";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import FadeIn from "../../components/FadeIn";
import { AddOnInput } from "../../components/Inputs";
import LabeledInput2 from "../../components/LabeledInput2";
import MainContent from "../../components/MainContent";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useToasterContext, useToggle } from "../../hooks";
import { APIError, APIStudentResponse } from "../../types/apiResponses";
import { grades } from "../../utils/grades";

export default function CreateStudent() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    schoolEmail: "@cornerstone-schools.org",
    status: "Active",
    grade: "-1",
    password: "",
  });
  const [showPassword, toggle] = useToggle(false);
  const { showToaster } = useToasterContext();
  const navigate = useNavigate();
  const handleBack = () => navigate("/students");

  type InputElement = HTMLInputElement | HTMLSelectElement;
  const handleChange: React.ChangeEventHandler<InputElement> = (e) => {
    let { name, value } = e.target;
    if (name === "schoolEmail") value = value + "@cornerstone-schools.org";
    setData({ ...data, [name]: value });
  };

  const submittable =
    data.firstName.length > 0 &&
    data.lastName.length > 0 &&
    data.schoolEmail.split("@")[0].length > 0 &&
    (data.status === "Active" ? +data.grade > -1 : true) &&
    data.password.length > 0;

  const createStudent = async () =>
    (await axios.post<APIStudentResponse>("/api/v2/students", data)).data.data.student;

  const handleSubmit = async () => {
    try {
      const student = await createStudent();
      showToaster("Students Created!", "success");
      navigate(`/students/${student._id}`, {
        state: {
          newStudent: true,
          student,
        },
      });
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  return (
    <MainContent.InnerWrapper>
      <FadeIn>
        <MainContent.Header>
          <div style={{ display: "flex", alignItems: "center" }}>
            <BackButton onClick={handleBack} />
            <span style={{ fontWeight: 500, fontSize: 16 }}>Create Student</span>
          </div>
        </MainContent.Header>
        <div style={{ overflowY: "scroll" }}>
          <div className="w-full flex justify-center py-10">
            <div style={{ width: "80%" }}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <LabeledInput2
                    label="First Name"
                    name="firstName"
                    required
                    value={data.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <LabeledInput2
                    label="Last Name"
                    name="lastName"
                    required
                    value={data.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-2">
                  <AddOnInput
                    label="School Email Address"
                    name="schoolEmail"
                    addOnText="@cornerstone-schools.org"
                    addOnSide="right"
                    value={data.schoolEmail.split("@")[0]}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={data.status}
                    onChange={handleChange}
                  >
                    <option>Active</option>
                    <option>Graduate</option>
                    <option>Inactive</option>
                  </select>
                </div>
                {data.status === "Active" && (
                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                      Grade
                    </label>
                    <select
                      name="grade"
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={data.grade}
                      onChange={handleChange}
                    >
                      <option value="-1" />
                      {grades.map((value, i) => (
                        <option key={value} value={i}>
                          {i === 0 ? "Kindergarten" : `${value} Grade`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="my-10">
                <Divider />
              </div>
              <div className="flex items-end justify-center">
                <div className="flex-1">
                  <LabeledInput2
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="ml-5 relative bottom-1">
                  <button
                    className="w-8 text-blue-500 p-1.5 hover:bg-gray-100 rounded-lg ring-offset-2 focus:ring-2 ring-blue-500"
                    onClick={toggle}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MainContent.Footer>
          <PrimaryButton text="Create Student" disabled={!submittable} onClick={handleSubmit} />
        </MainContent.Footer>
      </FadeIn>
    </MainContent.InnerWrapper>
  );
}
