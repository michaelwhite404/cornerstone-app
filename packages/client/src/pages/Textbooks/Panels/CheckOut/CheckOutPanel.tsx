import { CheckCircleIcon } from "@heroicons/react/solid";
import { useCallback, useEffect, useState } from "react";
import { TextbookModel } from "../../../../types/models/textbookTypes";
import { Button, ProgressBar, GradeSelect, StudentSelect } from "../../../../components/ui";
import BackButton from "../../../../components/BackButton";
import TableToolbox from "../../../../components/Table/TableToolbox";
import { useToasterContext } from "../../../../hooks";
import { useTextbookActions, useClassSelection } from "../../../../api";
import { getErrorMessage } from "../../../../utils/getErrorMessage";

interface ClassGroup {
  grade: number;
  students: { id: string; fullName: string }[];
}

interface CheckOutProps {
  data: TextbookModel[];
  closePanel: () => void;
}

export default function CheckOutPanel({ data, closePanel }: CheckOutProps) {
  const { checkoutTextbook } = useTextbookActions();
  const { showToaster } = useToasterContext();
  const [checkoutData, setCheckoutData] = useState<{ book: string; student: string }[]>(
    data.map((t) => ({ book: t._id, student: "-1" }))
  );
  const [gradeSelect, setGradeSelect] = useState(checkoutData.map(() => -1));
  const checkoutsFinished = checkoutData.filter((row) => row.student !== "-1").length;
  const { classes, gradePicked, gradeOptions, changeGrade } = useClassSelection();

  useEffect(() => {
    const arr = Array(checkoutData.length).fill(gradePicked);
    setCheckoutData((cD) => cD.map((d) => ({ book: d.book, student: "-1" })));
    setGradeSelect(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradePicked]);

  const updateBook = useCallback((bookId: string, student: string) => {
    setCheckoutData((data) => {
      const copiedData = [...data];
      const index = copiedData.findIndex((book) => book.book === bookId);
      if (index > -1) copiedData[index] = { book: bookId, student };
      return copiedData;
    });
  }, []);

  const updateGrade = (grade: number, index: number) => {
    const grades = [...gradeSelect];
    grades[index] = grade;
    setGradeSelect(grades);
  };

  const submittable = checkoutData.length === checkoutsFinished;

  const handleCheckout = () => {
    checkoutTextbook(checkoutData)
      .then((message) => {
        showToaster(message, "success");
        closePanel();
      })
      .catch((err) => showToaster(getErrorMessage(err), "danger"));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="py-3 px-6 items-center flex justify-between bg-white border-b border-gray-200 sticky top-0 z-50">
        <div style={{ display: "flex", alignItems: "center" }}>
          <BackButton onClick={closePanel} />
          <span style={{ fontWeight: 500, fontSize: 16 }}>Check Out Textbooks</span>
        </div>
      </div>
      <div style={{ overflowY: "scroll" }}>
        <TableToolbox>
          <div className="w-full h-full flex items-center justify-between">
            <span style={{ marginLeft: "25px" }}>
              Change All Grades: {"  "}
              <GradeSelect value={gradePicked} options={gradeOptions} onChange={changeGrade} />
            </span>
            <span className="flex" style={{ width: "25%", marginRight: "25px" }}>
              <ProgressBar value={checkoutsFinished / checkoutData.length} intent="success" />
            </span>
          </div>
        </TableToolbox>
        <div className="w-full flex items-center flex-col">
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
                <col span={1} style={{ width: "10%" }} />
                <col span={1} style={{ width: "23%" }} />
                <col span={1} style={{ width: "23%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="sticky top-0 z-[2] shadow-[0_-1px_#d1d5db_inset] border-b-0"></th>
                  <th className="sticky top-0 z-[2] shadow-[0_-1px_#d1d5db_inset] border-b-0">
                    Book Name
                  </th>
                  <th className="sticky top-0 z-[2] shadow-[0_-1px_#d1d5db_inset] border-b-0">#</th>
                  <th className="sticky top-0 z-[2] shadow-[0_-1px_#d1d5db_inset] border-b-0">
                    Grade
                  </th>
                  <th className="sticky top-0 z-[2] shadow-[0_-1px_#d1d5db_inset] border-b-0">
                    Student
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((t, i) => (
                  <TableRow
                    textbook={t}
                    value={checkoutData[i]}
                    classes={classes as ClassGroup[]}
                    grade={gradeSelect[i]}
                    updateBook={updateBook}
                    updateGrade={updateGrade}
                    index={i}
                    key={"table-row" + i}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-auto py-3 px-6 items-center flex justify-end bg-white border-t border-[#e5e7eb]">
        <div className="flex justify-end gap-2">
          <Button
            text="Check Out"
            variant="primary"
            disabled={!submittable}
            onClick={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}

const GRADES = [
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
];

const TableRow = ({
  textbook,
  value,
  classes,
  grade,
  updateBook,
  updateGrade,
  index,
}: {
  textbook: TextbookModel;
  value: {
    book: string;
    student: string;
  };
  classes: ClassGroup[];
  grade: number;
  updateBook: (bookId: string, student: string) => void;
  updateGrade: (index: number, grade: number) => void;
  index: number;
}) => {
  // Build options directly - don't use useClassSelection to avoid state conflicts
  const gradeOptions = [
    { value: "-1", label: "Select a grade" },
    ...GRADES.map((label, i) => ({ value: String(i), label })),
  ];

  const studentOptions =
    grade < 0 || classes.length === 0
      ? [{ value: "-1", label: "Select A Student" }]
      : [
          { value: "-1", label: "Select A Student" },
          ...classes[grade].students.map((s) => ({
            value: s.id,
            label: s.fullName,
          })),
        ];

  const handleGradeChange = (newGrade: number) => {
    updateGrade(newGrade, index);
    updateBook(textbook._id, "-1");
  };

  const handleStudentChange = (studentId: string) => {
    updateBook(textbook._id, studentId);
  };

  return (
    <tr>
      <td>
        <span
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {value.student !== "-1" && <CheckCircleIcon color="#2cc65f" width={25} />}
        </span>
      </td>
      <td>{textbook.textbookSet.title}</td>
      <td>{textbook.bookNumber}</td>
      <td>
        <GradeSelect value={grade} options={gradeOptions} onChange={handleGradeChange} />
      </td>
      <td>
        <StudentSelect
          value={value.student}
          options={studentOptions}
          onChange={handleStudentChange}
          disabled={grade < 0}
        />
      </td>
    </tr>
  );
};
