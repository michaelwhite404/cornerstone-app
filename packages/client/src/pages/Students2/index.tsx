import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StudentModel } from "../../types/models/studentTypes";
import { useDocTitle, useWindowSize } from "../../hooks";
import cstone from "../../cstone";
import SideTable from "../../components/SideTable/SideTable";
import { Row } from "react-table";
import PageHeader from "../../components/PageHeader";
import SideTableFilter from "../../components/SideTable/SideTableFilter";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import EmptyState from "./EmptyState";
import CreateStudent from "./CreateStudent";
import StudentDetails from "./StudentDetails";

function Students2() {
  useDocTitle("Students | Cornerstone App");
  const [students, setStudents] = useState<StudentModel[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams<"slug">();
  const [selected, setSelected] = useState<StudentModel>();
  const width = useWindowSize()[0];

  const getPageState = useCallback(() => {
    if (location.pathname.endsWith("add")) return "add";
    if (slug) return "student";
    setSelected(undefined);
    return "blank";
  }, [location.pathname, slug]);

  const [pageState, setPageState] = useState<"blank" | "student" | "add">(getPageState);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    const getStudents = async () => {
      const students = await cstone.students.list({
        limit: 500,
      });
      setStudents(students);
    };
    getStudents();
  }, []);

  useEffect(() => {
    location.pathname === "/students" && setSelected(undefined);
  }, [location.pathname]);

  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "fullName" },
      {
        Header: "Grade",
        accessor: "grade",
        id: "grade",
      },
      {
        Header: "Numeric Grade",
        accessor: "grade",
        id: "numericGrade",
      },
      { Header: "RenWeb ID", accessor: "customID" },
      { Header: "Email", accessor: "schoolEmail" },
    ],
    []
  );
  const customMethod = (rows: Row<{}>[]) => {
    //@ts-ignore
    if (rows.length > 0 && rows[0].groupByVal === "0") rows[0].groupByVal = "K";
  };

  const data = useMemo(() => students, [students]);

  const handleSelection = (student: StudentModel) => {
    setSelected(student);
    setPageState("student");
    navigate(`/students/${student.slug}`);
  };
  const handleBack = () => {
    setPageState("blank");
    setSelected(undefined);
    navigate(`/students`);
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {!(width < 768 && pageState !== "blank") && (
        <SideTable
          columns={columns}
          data={data}
          groupBy="grade"
          rowComponent={Comp}
          filterValue={filter}
          selected={selected?._id || ""}
          customMethod={customMethod}
          onSelectionChange={handleSelection}
        >
          <div className="side-table-top">
            <PageHeader text="Students" />
            <SideTableFilter value={filter} onChange={(value) => setFilter(value)} />
          </div>
        </SideTable>
      )}
      <main className="main-content">
        <Outlet
          context={{
            student: selected,
            setSelectedStudent: setSelected,
            onBack: handleBack,
          }}
        />
      </main>
    </div>
  );
}

const Comp = ({ fullName, schoolEmail }: { fullName: string; schoolEmail: string }) => (
  <div style={{ padding: "10px 20px" }}>
    <div>{fullName}</div>
    <div style={{ fontSize: 11.5, color: "#9f9f9f" }}>{schoolEmail}</div>
  </div>
);

Students2.EmptyState = EmptyState;
Students2.CreateStudent = CreateStudent;
Students2.StudentDetails = StudentDetails;

export default Students2;
