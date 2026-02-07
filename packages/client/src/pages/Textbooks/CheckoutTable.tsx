import { Button, HTMLSelect, ProgressBar } from "@blueprintjs/core";
import { CheckCircleIcon } from "@heroicons/react/solid";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { TextbookModel } from "../../types/models/textbookTypes";
import TableToolbox from "../../components/Table/TableToolbox";
import { APIError } from "../../types/apiResponses";
import { grades } from "../../utils/grades";
import Class from "../../types/class";
import "./Table.sass";

const gradeValues = grades.map((value, i) => ({
  value: `${i}`,
  label: i === 0 ? "Kindergarten" : value,
}));
gradeValues.unshift({ value: "-1", label: "Select a grade" });

interface CheckoutTableProps {
  data: TextbookModel[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTextbooks: React.Dispatch<React.SetStateAction<TextbookModel[]>>;
  showToaster: (message: string, intent: "success" | "danger") => void;
}

export default function CheckoutTable({
  data,
  setOpen,
  setTextbooks,
  showToaster,
}: CheckoutTableProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [checkoutData, setCheckoutData] = useState<{ book: string; student: string | null }[]>(
    data.map((t) => ({ book: t._id, student: null }))
  );
  const [gradeSelect, setGradeSelect] = useState(checkoutData.map(() => -1));
  const checkoutsFinished = checkoutData.filter((row) => row.student !== null).length;
  const submittable = checkoutData.length - checkoutsFinished === 0;

  const updateBookData = (bookId: string, student: string | null) => {
    const data = [...checkoutData];
    const index = data.findIndex((book) => book.book === bookId);
    if (index > -1) {
      data[index] = { book: bookId, student };
      setCheckoutData(data);
    }
  };

  const changeAllGrades = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const arr = Array(checkoutData.length).fill(+e.target.value);
    setCheckoutData(checkoutData.map((d) => ({ book: d.book, student: null })));
    setGradeSelect(arr);
  };

  const completeCheckout = async () => {
    if (submittable) {
      try {
        const result = await axios.post("/api/v2/textbooks/books/check-out", {
          data: checkoutData,
        });
        try {
          const res = await axios.get("/api/v2/textbooks/books", {
            params: {
              sort: "textbookSet,bookNumber",
              active: true,
            },
          });
          setTextbooks(res.data.data.books);
          setOpen(false);
          showToaster(result.data.message, "success");
        } catch (err) {
          showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
        }
      } catch (err) {
        showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
      }
    }
  };

  useEffect(() => {
    getStudents();

    async function getStudents() {
      try {
        const res = await axios.get("/api/v2/students/group");
        setClasses(res.data.data.grades);
      } catch (err) {
        console.log((err as AxiosError<APIError>).response!.data);
      }
    }
  }, []);

  return (
    <>
      <TableToolbox>
        <div className="w-h-full flex align-center justify-space-between">
          <span style={{ marginLeft: "25px" }}>
            Change All Grades: {"  "}
            <HTMLSelect options={gradeValues} onChange={changeAllGrades} />
          </span>
          <span className="flex" style={{ width: "25%", marginRight: "25px" }}>
            <ProgressBar
              value={checkoutsFinished / checkoutData.length}
              intent="success"
              animate={false}
              stripes={false}
            />
          </span>
        </div>
      </TableToolbox>
      <div className="textbooks-drawer-container" id="checkout-table-container">
        <div
          style={{
            width: "100%",
            overflow: "auto",
          }}
        >
          <table style={{ width: "100%" }} id="textbook-checkout-table">
            <colgroup>
              <col span={1} style={{ width: "8%" }} />
              <col span={1} style={{ width: "23%" }} />
              <col span={1} style={{ width: "23%" }} />
              <col span={1} style={{ width: "23%" }} />
              <col span={1} style={{ width: "23%" }} />
            </colgroup>
            <thead>
              <tr>
                <th className="sticky-header"></th>
                <th className="sticky-header">Book Name</th>
                <th className="sticky-header">Number</th>
                <th className="sticky-header">Grade</th>
                <th className="sticky-header">Student</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t, i) => (
                <CheckoutTableRow
                  key={`${t._id}-row-${i}`}
                  textbook={t}
                  classes={classes}
                  updateBookData={updateBookData}
                  gradeSelect={gradeSelect}
                  setGradeSelect={setGradeSelect}
                  index={i}
                  currentValue={checkoutData[i]}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="checkout-table-footer">
        <Button intent="primary" disabled={!submittable} onClick={completeCheckout}>
          Check Out
        </Button>
      </div>
    </>
  );
}

function CheckoutTableRow({
  textbook,
  classes,
  updateBookData,
  gradeSelect,
  setGradeSelect,
  index,
  currentValue,
}: {
  textbook: TextbookModel;
  classes: Class[];
  updateBookData: (id: string, student: string | null) => void;
  gradeSelect: number[];
  setGradeSelect: React.Dispatch<React.SetStateAction<number[]>>;
  index: number;
  currentValue: {
    book: string;
    student: string | null;
  };
}) {
  const studentOptions =
    gradeSelect[index] === -1
      ? undefined
      : classes[gradeSelect[index]].students.map((s) => ({
          label: s.fullName,
          value: s.id,
        }));
  studentOptions?.unshift({ label: "Select A Student", value: "-1" });

  const changeGrade = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const grades = [...gradeSelect];
    grades[index] = +e.target.value;
    setGradeSelect(grades);
    updateBookData(textbook._id, null);
  };

  return (
    <tr>
      <td>
        <span
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {currentValue.student !== null && <CheckCircleIcon color="#2cc65f" width={25} />}
        </span>
      </td>
      <td>{textbook.textbookSet.title}</td>
      <td>{textbook.bookNumber}</td>
      <td>
        <HTMLSelect options={gradeValues} value={gradeSelect[index]} onChange={changeGrade} />
      </td>
      <td>
        {gradeSelect[index] !== -1 && (
          <HTMLSelect
            options={studentOptions}
            onChange={(e) =>
              updateBookData(textbook._id, e.target.value === "-1" ? null : e.target.value)
            }
          />
        )}
      </td>
    </tr>
  );
}
