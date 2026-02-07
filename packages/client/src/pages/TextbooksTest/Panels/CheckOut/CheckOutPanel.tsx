import { Button, Classes, ProgressBar } from "@blueprintjs/core";
import { PanelActions } from "@blueprintjs/core/lib/esm/components/panel-stack2/panelTypes";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { TextbookModel } from "../../../../types/models/textbookTypes";
import BackButton from "../../../../components/BackButton";
import TableToolbox from "../../../../components/Table/TableToolbox";
import { useClasses, useToasterContext } from "../../../../hooks";
import useTextbook from "../../../../hooks/useTextbook";
import { APIError } from "../../../../types/apiResponses";
import Class from "../../../../types/class";
import "./CheckOutPanel.sass";

interface CheckOutProps extends PanelActions {
  data: TextbookModel[];
}

export default function CheckOutPanel({ data, ...props }: CheckOutProps) {
  const { checkoutTextbook } = useTextbook();
  const { showToaster } = useToasterContext();
  const [checkoutData, setCheckoutData] = useState<{ book: string; student: string }[]>(
    data.map((t) => ({ book: t._id, student: "-1" }))
  );
  const [gradeSelect, setGradeSelect] = useState(checkoutData.map(() => -1));
  const checkoutsFinished = checkoutData.filter((row) => row.student !== "-1").length;
  const { classes, gradePicked, GradeSelect } = useClasses();

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
        props.closePanel();
      })
      .catch((err) => showToaster((err as AxiosError<APIError>).response!.data.message, "success"));
  };

  return (
    <div className="main-content-inner-wrapper">
      <div className="main-content-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <BackButton onClick={props.closePanel} />
          <span style={{ fontWeight: 500, fontSize: 16 }}>Check Out Textbooks</span>
        </div>
      </div>
      <div style={{ overflowY: "scroll" }}>
        <TableToolbox>
          <div className="w-h-full flex align-center justify-space-between">
            <span style={{ marginLeft: "25px" }}>
              Change All Grades: {"  "}
              <GradeSelect />
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
        <div className="textbooks-drawer-container">
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
                  <th className="sticky-header"></th>
                  <th className="sticky-header">Book Name</th>
                  <th className="sticky-header">#</th>
                  <th className="sticky-header">Grade</th>
                  <th className="sticky-header">Student</th>
                </tr>
              </thead>
              <tbody>
                {data.map((t, i) => (
                  <TableRow
                    textbook={t}
                    value={checkoutData[i]}
                    classes={classes}
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
      <div className="main-content-footer">
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            text="Check Out"
            intent="primary"
            disabled={!submittable}
            onClick={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}

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
  classes: Class[];
  grade: number;
  updateBook: (bookId: string, student: string) => void;
  updateGrade: (index: number, grade: number) => void;
  index: number;
}) => {
  const { GradeSelect, StudentSelect } = useClasses(classes);

  const handleGradeChange = (value: number) => {
    updateGrade(value, index);
    updateBook(textbook._id, "-1");
  };

  const handleStudentChange = (value: string) => {
    updateBook(textbook._id, value);
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
        <GradeSelect value={grade} onChange={handleGradeChange} />
      </td>
      <td>
        <StudentSelect value={value.student} onChange={handleStudentChange} />
      </td>
    </tr>
  );
};
