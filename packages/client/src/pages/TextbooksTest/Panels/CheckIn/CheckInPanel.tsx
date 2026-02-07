import { Button, Classes, HTMLSelect, OptionProps } from "@blueprintjs/core";
import { PanelActions } from "@blueprintjs/core/lib/esm/components/panel-stack2/panelTypes";
import { AxiosError } from "axios";
import { useState } from "react";
import { TextbookModel } from "../../../../types/models/textbookTypes";
import BackButton from "../../../../components/BackButton";
import { useToasterContext } from "../../../../hooks";
import useTextbook from "../../../../hooks/useTextbook";
import { APIError } from "../../../../types/apiResponses";

interface CheckInProps extends PanelActions {
  data: TextbookModel[];
}

export default function CheckInPanel({ data, ...props }: CheckInProps) {
  const { checkinTextbook } = useTextbook();
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
        props.closePanel();
      })
      .catch((err) => {
        showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
      });
  };
  return (
    <div className="main-content-inner-wrapper">
      <div className="main-content-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <BackButton onClick={props.closePanel} />
          <span style={{ fontWeight: 500, fontSize: 16 }}>Check In Textbooks</span>
        </div>
      </div>
      <div style={{ overflowY: "scroll" }}>
        <div className="textbooks-drawer-container">
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
                    <th className="sticky-header" key={"header" + i}>
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
      <div className="main-content-footer">
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            text="Check In"
            intent="primary"
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
  const options: OptionProps[] = [];
  let flag = false;
  QualityEnum.forEach((value) => {
    options.unshift({ disabled: flag, value });
    value === textbook.quality && (flag = true);
  });
  return (
    <tr>
      <td></td>
      <td>{textbook.textbookSet.title}</td>
      <td>{textbook.bookNumber}</td>
      <td>{textbook.lastUser!.fullName}</td>
      <td>
        <HTMLSelect
          options={options}
          value={value.quality}
          onChange={(e) => updateBook(textbook._id, e.target.value)}
        />
      </td>
    </tr>
  );
}
