import { createContext, useMemo, useState } from "react";
import { TextbookSetModel } from "../../types/models/textbookSetTypes";
import ContentPanels from "./ContentPanels";
import AddTextbook from "./AddTextbook";
import { useDocTitle, useWindowSize } from "../../hooks";
import FadeIn from "../../components/FadeIn";
import CreateTextbookButton from "./CreateTextbookButton";
import SideTable from "../../components/SideTable/SideTable";
import TextbookSetRow from "./TextbookSetRow/TextbookSetRow";
import PageHeader from "../../components/PageHeader";
import { Row } from "react-table";
import { useTextbookSets } from "../../api";

interface TextbookContextProps {
  getTextbookSets: () => Promise<void>;
}

export const TextbookContext = createContext<TextbookContextProps>({} as TextbookContextProps);
type PageState = "blank" | "view" | "add";

export default function Textbooks() {
  const { data: textbookSets = [], refetch } = useTextbookSets();
  const [pageState, setPageState] = useState<PageState>("blank");
  const [selected, setSelected] = useState<TextbookSetModel>();
  const [width] = useWindowSize();
  useDocTitle("Textbooks | Cornerstone App");

  const getTextbookSets = async () => {
    await refetch();
  };

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
            <div className="pt-6 px-6 pb-4 border-b border-gray-200">
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
        <main className="flex-grow overflow-auto bg-white">
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
            <div className="w-full h-full flex flex-col items-center justify-center">
              <FadeIn>
                <div className="py-16 px-24 border-2 border-gray-200 border-dashed rounded-2xl">
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
