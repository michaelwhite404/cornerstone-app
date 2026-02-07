import React, { useState } from "react";
import { Button, HTMLSelect } from "@blueprintjs/core";
import { TextbookModel } from "../../types/models/textbookTypes";
import axios, { AxiosError } from "axios";
import { APIError } from "../../types/apiResponses";

interface CheckoutTableProps {
  data: TextbookModel[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTextbooks: React.Dispatch<React.SetStateAction<TextbookModel[]>>;
  showToaster: (message: string, intent: "success" | "danger") => void;
}

export default function CheckinTable({
  data,
  setOpen,
  setTextbooks,
  showToaster,
}: CheckoutTableProps) {
  const [checkinData, setCheckinData] = useState<{ id: string; quality: string }[]>(
    data.map((t) => ({ id: t._id, quality: t.quality }))
  );
  const checkinsFinished = checkinData.filter((row) => row.quality !== null).length;
  const submittable = checkinData.length - checkinsFinished === 0;

  const updateBookData = (bookId: string, quality: string) => {
    const data = [...checkinData];
    const index = data.findIndex((book) => book.id === bookId);
    if (index > -1) {
      data[index] = { id: bookId, quality };
      setCheckinData(data);
    }
  };

  const completeCheckout = async () => {
    try {
      const result = await axios.patch("/api/v2/textbooks/books/check-in", {
        books: checkinData,
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
  };

  return (
    <>
      <div className="textbooks-drawer-container" id="checkin-table-container">
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
                <th className="sticky-header">Student</th>
                <th className="sticky-header">Quality</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t, i) => (
                <CheckinTableRow
                  key={`${t._id}-row-${i}`}
                  textbook={t}
                  updateBookData={updateBookData}
                  value={checkinData[i]}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="checkout-table-footer">
        <Button intent="primary" disabled={!submittable} onClick={completeCheckout}>
          Check In
        </Button>
      </div>
    </>
  );
}

function CheckinTableRow({
  textbook,
  updateBookData,
  value,
}: {
  textbook: TextbookModel;
  updateBookData: (bookId: string, quality: string) => void;
  value: { id: string; quality: string };
}) {
  const QualityEnum = ["Excellent", "Good", "Acceptable", "Poor"];
  return (
    <tr>
      <td></td>
      <td>{textbook.textbookSet.title}</td>
      <td>{textbook.bookNumber}</td>
      <td>{textbook.lastUser!.fullName}</td>
      <td>
        <HTMLSelect
          options={QualityEnum}
          value={value.quality}
          onChange={(e) => updateBookData(textbook._id, e.target.value)}
        />
      </td>
    </tr>
  );
}
