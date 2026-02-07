import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { StudentModel } from "../../types/models/studentTypes";
import Table from "../../components/Table/Table";
import { useDocTitle, useWindowSize } from "../../hooks";
import { APIError, APIStudentsResponse } from "../../types/apiResponses";

export default function Students() {
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [width] = useWindowSize();
  useDocTitle("Students | Cornerstone App");
  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "fullName", width: (width - 344) / 4 },
      {
        Header: "Grade",
        accessor: "grade",
        Cell: ({ value }: any) => (value === 0 ? "K" : value),
        width: (width - 344) / (20 / 3),
      },
      { Header: "RenWeb ID", accessor: "customID", width: (width - 344) / (20 / 3) },
      { Header: "Email", accessor: "schoolEmail", width: (width - 344) / (20 / 9) },
    ],
    [width]
  );
  const data = useMemo(() => students, [students]);
  useEffect(() => {
    getStudents();

    async function getStudents() {
      try {
        const res = await axios.get<APIStudentsResponse>("/api/v2/students", {
          params: {
            sort: "grade,lastName",
            limit: 1000,
            status: "Active",
          },
        });
        setStudents(res.data.data.students);
      } catch (err) {
        console.log((err as AxiosError<APIError>).response!.data);
      }
    }
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 style={{ marginBottom: "10px" }}>Students</h1>
      </div>
      <Table columns={columns} data={data} sortBy="grade" />
    </div>
  );
}
