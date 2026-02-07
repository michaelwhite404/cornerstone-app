import React, { useEffect, useState } from "react";
import { TextbookSetModel } from "../../types/models/textbookSetTypes";
import { TextbookModel } from "../../types/models/textbookTypes";
import TextbooksTestContent from "./Panels/TextbooksTestPanel";
import AddBookPanel from "./Panels/AddBook/AddBookPanel";
import CheckOutPanel from "./Panels/CheckOut/CheckOutPanel";
import CheckInPanel from "./Panels/CheckIn/CheckInPanel";

type PanelView =
  | { type: "main" }
  | { type: "addBook"; textbook: TextbookSetModel; books: TextbookModel[] }
  | { type: "checkOut"; data: TextbookModel[] }
  | { type: "checkIn"; data: TextbookModel[] };

export default function ContentPanels({
  textbook,
  setSelected,
  setPageState,
}: {
  textbook: TextbookSetModel;
  setSelected: React.Dispatch<React.SetStateAction<TextbookSetModel | undefined>>;
  setPageState: React.Dispatch<React.SetStateAction<"blank" | "view" | "add">>;
}) {
  const [currentPanel, setCurrentPanel] = useState<PanelView>({ type: "main" });

  useEffect(() => {
    setCurrentPanel({ type: "main" });
  }, [textbook._id]);

  const openPanel = (panel: PanelView) => setCurrentPanel(panel);
  const closePanel = () => setCurrentPanel({ type: "main" });

  return (
    <div className="h-full">
      {currentPanel.type === "main" && (
        <TextbooksTestContent
          textbook={textbook}
          setSelected={setSelected}
          setPageState={setPageState}
          openPanel={openPanel}
          closePanel={closePanel}
        />
      )}
      {currentPanel.type === "addBook" && (
        <AddBookPanel
          textbook={currentPanel.textbook}
          books={currentPanel.books}
          closePanel={closePanel}
        />
      )}
      {currentPanel.type === "checkOut" && (
        <CheckOutPanel data={currentPanel.data} closePanel={closePanel} />
      )}
      {currentPanel.type === "checkIn" && (
        <CheckInPanel data={currentPanel.data} closePanel={closePanel} />
      )}
    </div>
  );
}
