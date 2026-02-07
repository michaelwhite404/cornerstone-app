import { useState } from "react";
import axios, { AxiosError } from "axios";
import { StudentModel } from "../../types/models";
import EmptyPage from "./InactiveSession/EmptyPage";
import AddStudents from "./InactiveSession/AddStudents";
import AddDropIns from "./InactiveSession/AddDropsIns";
import { CurrentSession, InactivePageState } from "../../types/aftercareTypes";
import { useToasterContext } from "../../hooks";
import { APICurrentSessionResponse, APIError } from "../../types/apiResponses";

interface InactiveSessionProps {
  setCurrentSession: React.Dispatch<React.SetStateAction<CurrentSession>>;
}

export default function InactiveSession({ setCurrentSession }: InactiveSessionProps) {
  const [pageState, setPageState] = useState<InactivePageState>("empty");
  const [studentsToAdd, setStudentsToAdd] = useState<StudentModel[]>([]);
  const { showToaster } = useToasterContext();

  const startSession = async (students: string[]) => {
    try {
      const res = await axios.post<APICurrentSessionResponse>("/api/v2/aftercare/session", {
        students,
      });
      showToaster("Session Started", "success");
      setCurrentSession(res.data.data);
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  const pages = [
    {
      state: "empty",
      Component: EmptyPage,
    },
    {
      state: "students",
      Component: AddStudents,
    },
    {
      state: "dropIns",
      Component: AddDropIns,
      props: {
        startSession,
      },
    },
  ];

  const { Component, props } = pages.find((page) => page.state === pageState)!;

  return (
    <Component
      setPageState={setPageState}
      setStudentsToAdd={setStudentsToAdd}
      studentsToAdd={studentsToAdd}
      {...props}
    />
  );
}
