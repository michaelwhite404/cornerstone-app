import axios from "axios";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { TextbookSetModel } from "../../types/models/textbookSetTypes";
import { APITextbookSetsResponse } from "../../types/apiResponses";
import "./TextbooksTest.sass";
import ContentPanels from "./ContentPanels";
import AddTextbook from "./AddTextbook";
import { useDocTitle, useWindowSize } from "../../hooks";
import FadeIn from "../../components/FadeIn";
import CreateTextbookButton from "./CreateTextbookButton";
import SideTable from "../../components/SideTable/SideTable";
import TextbookSetRow from "./TextbookSetRow/TextbookSetRow";
import PageHeader from "../../components/PageHeader";
import "../Textbooks/Table.sass";
import { Row } from "react-table";

interface TextbookContextProps {
  getTextbookSets: () => Promise<void>;
}

export const TextbookContext = createContext<TextbookContextProps>({} as TextbookContextProps);
type PageState = "blank" | "view" | "add";

export default function TextbooksTest() {
  const [textbookSets, setTextbookSets] = useState<TextbookSetModel[]>([]);
  const [pageState, setPageState] = useState<PageState>("blank");
  const [selected, setSelected] = useState<TextbookSetModel>();
  const [width] = useWindowSize();
  useDocTitle("Textbooks | Cornerstone App");

  useEffect(() => {
    getTextbookSets();
  }, []);
  async function getTextbookSets() {
    const res = await axios.get<APITextbookSetsResponse>("/api/v2/textbooks", {
      params: {
        sort: "title",
      },
    });
    setTextbookSets(res.data.data.textbooks);
  }

  const handleAddTextbookClick = () => {
    setPageState("add");
    setSelected(undefined);
  };

  const handleSetClick = (set: TextbookSetModel) => {
    pageState !== "view" && setPageState("view");
    setSelected(set);
  };

  const data = useMemo(() => textbookSets, [textbookSets]);
  const columns = useMemo(
    () => [
      {
        Header: "Class",
        accessor: "class",
      },
      {
        Header: "Count",
        accessor: "count",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "First Letter",
        id: "firstLetter",
        accessor: ({ title }: { title: string }) => title[0].toUpperCase(),
      },
    ],
    []
  );

  const customMethod = (rows: Row<{}>[]) => {
    // @ts-ignore
    rows.sort((row1, row2) => (row1.groupByVal as string).localeCompare(row2.groupByVal));
  };

  return (
    <TextbookContext.Provider value={{ getTextbookSets }}>
      <div style={{ display: "flex", height: "100%" }}>
        {!(width < 768 && pageState !== "blank") && (
          <SideTable<TextbookSetModel>
            data={data}
            columns={columns}
            rowComponent={TextbookSetRow}
            groupBy="firstLetter"
            onSelectionChange={handleSetClick}
            selected={selected?._id || ""}
            customMethod={customMethod}
          >
            <div className="side-table-top">
              <PageHeader text="Textbooks" />
              <p>Search directory of many books</p>
              <CreateTextbookButton
                fill
                onClick={handleAddTextbookClick}
                disabled={pageState === "add"}
              />
            </div>
          </SideTable>
        )}
        <main className="main-content">
          {pageState === "view" && selected && (
            <ContentPanels
              textbook={selected}
              setSelected={setSelected}
              setPageState={setPageState}
            />
          )}
          {pageState === "add" && (
            <AddTextbook setPageState={setPageState} setSelected={setSelected} />
          )}
          {pageState === "blank" && (
            <div className="empty-state-container">
              <FadeIn>
                <div className="empty-state-border">
                  <div style={{ fontWeight: 500, textAlign: "center" }}>Select a textbook OR</div>
                  <CreateTextbookButton onClick={handleAddTextbookClick} />
                </div>
              </FadeIn>
            </div>
          )}
        </main>
      </div>
    </TextbookContext.Provider>
  );
}
