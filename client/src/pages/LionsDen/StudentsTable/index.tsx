import { Checkbox } from "@mui/material";
import classNames from "classnames";
import pluralize from "pluralize";
import { useEffect, useState } from "react";
import Badge from "../../../components/Badge/Badge";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import TableWrapper from "../../../components/TableWrapper";
import { numberToGrade } from "../../../utils/grades";
import "./StudentsTable.sass";

type RemoveArray<T> = T extends any[] ? T[number] : never;
type CheckboxStates = "unchecked" | "checked" | "indeterminate";

interface StudentTableProps {
  students: StudentAftercareStat[];
  removeStudents: (
    students: {
      _id: string;
    }[]
  ) => Promise<void>;
}

export default function StudentTable({ students, removeStudents }: StudentTableProps) {
  const [rows, setRows] = useState(students.map((s) => ({ ...s, checked: false })));
  const [main, setMain] = useState<CheckboxStates>("unchecked");

  const checkedLength = () => rows.filter((r) => r.checked).length;

  const RemoveButton = () => (
    <div style={{ boxShadow: "#d2d2d2 0px 0px 2px 1px", width: "fit-content", borderRadius: 4 }}>
      <PrimaryButton
        text={`Remove ${pluralize("Students", checkedLength(), true)}`}
        style={{
          backgroundColor: "white",
          color: "black",
          padding: "7px 14px",
        }}
        onClick={handleRemove}
      />
    </div>
  );

  const mainCheckboxClick = () => {
    if (main === "checked") {
      switchAll(false);
      return setMain("unchecked");
    }
    switchAll(true);
    setMain("checked");
  };
  const headings = [
    {
      comp: (
        <Checkbox
          onClick={mainCheckboxClick}
          indeterminate={main === "indeterminate"}
          checked={main === "checked"}
        />
      ),
      className: "sm:w-24 w-20",
      key: "Checkbox",
    },
    {
      comp: main === "unchecked" ? "Student" : <RemoveButton />,
      className: "",
      key: "Student",
    },
    { comp: "Grade", className: "hidden sm:table-cell", key: "Grade" },
    { comp: "Days Present", className: "hidden sm:table-cell", key: "Days" },
    { comp: "Late Pickup", className: "hidden sm:table-cell", key: "Late" },
  ];

  useEffect(() => {
    setRows(students.map((s) => ({ ...s, checked: false })));
  }, [students]);

  useEffect(() => {
    const numChecked = rows.filter((r) => r.checked).length;
    if (numChecked === 0) return setMain("unchecked");
    if (numChecked === rows.length) return setMain("checked");
    setMain("indeterminate");
  }, [rows]);

  const onCheckboxChange = (row: RemoveArray<typeof rows>) => {
    const copiedRows = [...rows];
    const findIndex = copiedRows.findIndex((r) => r._id === row._id);
    rows[findIndex].checked = !rows[findIndex].checked;
    setRows(copiedRows);
  };

  const switchAll = (checked: boolean) => setRows([...rows].map((row) => ({ ...row, checked })));

  const handleRemove = () => removeStudents(rows.filter((r) => r.checked));

  return (
    <TableWrapper>
      <table className="aftercare-student-table">
        <thead>
          <tr>
            {headings.map((h) => (
              <th className={h.className} key={h.key}>
                {h.comp}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((student) => (
            <tr
              className={classNames({ checked: student.checked })}
              style={{ borderBottom: "1px #e5e7eb solid" }}
              key={student._id}
            >
              <td className="relative">
                {student.checked && (
                  <div
                    className="absolute inset-y-0 left-0 w-0.5"
                    style={{ backgroundColor: "#1976d2" }}
                  />
                )}
                <Checkbox checked={student.checked} onChange={() => onCheckboxChange(student)} />
              </td>
              <td>
                <span style={{ color: student.checked ? "#1976d2" : undefined, marginRight: 4 }}>
                  <span className={!student.aftercare ? "mr-1" : undefined}>
                    {student.fullName}
                  </span>
                  {!student.aftercare && <Badge color="sky" text="Unenrolled" noDot />}
                </span>
                <div className="block sm:hidden sub-td">
                  {student.grade !== undefined && <div>Grade: {numberToGrade(student.grade)}</div>}
                  {/* <div>Days Present: {student.entriesCount}</div>
                  <div>Days Late: {student.lateCount}</div> */}
                </div>
              </td>
              <td className="hidden sm:table-cell">
                {student.grade === undefined ? "" : numberToGrade(student.grade)}
              </td>
              <td className="hidden sm:table-cell">{student.entriesCount}</td>
              <td className="hidden sm:table-cell">{student.lateCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}

interface StudentAftercareStat {
  entriesCount: number;
  lateCount: number;
  _id: any;
  fullName: string;
  grade?: number | undefined;
  schoolEmail: string;
  aftercare: boolean;
}
