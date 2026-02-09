import { useMemo } from "react";
import { useStudents } from "../../api";
import Table from "../../components/Table/Table";
import { useDocTitle, useWindowSize } from "../../hooks";

export default function Students() {
  const { data: students = [] } = useStudents();
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

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 style={{ marginBottom: "10px" }}>Students</h1>
      </div>
      <Table columns={columns} data={students} sortBy="grade" />
    </div>
  );
}
