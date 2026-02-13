import { useState } from "react";
import { TextbookModel } from "../../../../types/models/textbookTypes";
import { Button, Select } from "../../../../components/ui";
import BackButton from "../../../../components/BackButton";
import { useToasterContext } from "../../../../hooks";
import { useTextbookActions } from "../../../../api";
import { getErrorMessage } from "../../../../utils/getErrorMessage";

interface CheckInProps {
  data: TextbookModel[];
  closePanel: () => void;
}

export default function CheckInPanel({ data, closePanel }: CheckInProps) {
  const { checkinTextbook } = useTextbookActions();
  const { showToaster } = useToasterContext();
  const [checkinData, setCheckinData] = useState<{ id: string; quality: string }[]>(
    data.map((t) => ({ id: t._id, quality: t.quality }))
  );
  const checkinsFinished = checkinData.filter((row) => row.quality !== null).length;

  const updateBook = (bookId: string, quality: string) =>
    setCheckinData((data) => {
      const copiedData = [...data];
      const index = copiedData.findIndex((book) => book.id === bookId);
      if (index > -1) copiedData[index] = { id: bookId, quality };
      return copiedData;
    });

  const submittable = checkinData.length - checkinsFinished === 0;
  const handleCheckin = () => {
    checkinTextbook(checkinData)
      .then((message) => {
        showToaster(message, "success");
        closePanel();
      })
      .catch((err) => {
        showToaster(getErrorMessage(err), "danger");
      });
  };
  return (
    <div className="flex flex-col h-full">
      <div className="py-3 px-6 items-center flex justify-between bg-white border-b border-gray-200 sticky top-0 z-50">
        <div style={{ display: "flex", alignItems: "center" }}>
          <BackButton onClick={closePanel} />
          <span style={{ fontWeight: 500, fontSize: 16 }}>Check In Textbooks</span>
        </div>
      </div>
      <div style={{ overflowY: "scroll" }}>
        <div className="w-full flex items-center flex-col">
          <div style={{ width: "100%" }}>
            <table style={{ width: "100%" }} id="textbook-checkout-table">
              <colgroup>
                {[8, 23, 10, 23, 23].map((w, i) => (
                  <col span={1} style={{ width: `${w}%` }} key={"col" + i} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {["", "Book Name", "#", "Student", "Quality"].map((h, i) => (
                    <th
                      className="sticky top-0 z-[2] shadow-[0_-1px_#d1d5db_inset] border-b-0"
                      key={"header" + i}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((t, i) => (
                  <CheckinTableRow
                    key={`${t._id}-row-${i}`}
                    textbook={t}
                    updateBook={updateBook}
                    value={checkinData[i]}
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
            text="Check In"
            variant="primary"
            disabled={!submittable}
            onClick={handleCheckin}
          />
        </div>
      </div>
    </div>
  );
}

function CheckinTableRow({
  textbook,
  updateBook,
  value,
}: {
  textbook: TextbookModel;
  updateBook: (bookId: string, quality: string) => void;
  value: { id: string; quality: string };
}) {
  const QualityEnum = ["Poor", "Acceptable", "Good", "Excellent"];
  const options: { label: string; value: string; disabled?: boolean }[] = [];
  let flag = false;
  QualityEnum.forEach((val) => {
    options.unshift({ disabled: flag, value: val, label: val });
    if (val === textbook.quality) flag = true;
  });
  return (
    <tr>
      <td></td>
      <td>{textbook.textbookSet.title}</td>
      <td>{textbook.bookNumber}</td>
      <td>{textbook.lastUser!.fullName}</td>
      <td>
        <Select value={value.quality} onChange={(e) => updateBook(textbook._id, e.target.value)}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </Select>
      </td>
    </tr>
  );
}
