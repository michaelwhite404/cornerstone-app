import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { TextbookSetModel } from "../../../types/models/textbookSetTypes";
import { TextbookModel } from "../../../types/models/textbookTypes";
import TextbookStatusBadge from "../../../components/Badges/TextbookStatusBadge";
import TextbookQualityBadge from "../../../components/Badges/TextbookQualityBadge";
import { APITextbooksResponse } from "../../../types/apiResponses";
import { numberToGrade } from "../../../utils/grades";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import { Button } from "../../../components/ui";
import BooksTable from "../BooksTable/BooksTable";
import pluralize from "pluralize";
import BackButton from "../../../components/BackButton";
import FadeIn from "../../../components/FadeIn";

type PanelView =
  | { type: "main" }
  | { type: "addBook"; textbook: TextbookSetModel; books: TextbookModel[] }
  | { type: "checkOut"; data: TextbookModel[] }
  | { type: "checkIn"; data: TextbookModel[] };

export default function TextbooksTestContent({
  textbook,
  setSelected,
  setPageState,
  openPanel,
  closePanel,
}: {
  textbook: TextbookSetModel;
  setSelected: React.Dispatch<React.SetStateAction<TextbookSetModel | undefined>>;
  setPageState: React.Dispatch<React.SetStateAction<"blank" | "view" | "add">>;
  openPanel: (panel: PanelView) => void;
  closePanel: () => void;
}) {
  const [books, setBooks] = useState<TextbookModel[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<TextbookModel[]>([]);

  const canCheckOut = selectedBooks.filter((t) => t.status === "Available");
  const canCheckIn = selectedBooks.filter((t) => t.status === "Checked Out");

  useEffect(() => {
    getBooks();

    async function getBooks() {
      const res = await axios.get<APITextbooksResponse>(`/api/v2/textbooks/${textbook._id}/books`);
      setBooks(res.data.data.books);
    }
  }, [textbook._id]);

  const columns = useMemo(
    () => [
      { Header: "#", accessor: "bookNumber" },
      {
        Header: "Quality",
        accessor: "quality",
        Cell: ({ row: { original } }: { row: { original: TextbookModel } }) => (
          <TextbookQualityBadge quality={original.quality} />
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row: { original } }: { row: { original: TextbookModel } }) => (
          <TextbookStatusBadge status={original.status} />
        ),
      },
      {
        Header: "Student",
        accessor: "lastUser.fullName",
        Cell: ({ row: { original } }: { row: { original: TextbookModel } }) => {
          return original?.status === "Checked Out" && original.lastUser
            ? `${original.lastUser.fullName} (${numberToGrade(original.lastUser.grade!)})`
            : "";
        },
      },
    ],
    []
  );
  const data = useMemo(() => books, [books]);

  const addBookPanel = () =>
    openPanel({ type: "addBook", textbook, books });

  const checkOutBooksPanel = () =>
    openPanel({ type: "checkOut", data: canCheckOut });

  const checkInBooksPanel = () =>
    openPanel({ type: "checkIn", data: canCheckIn });

  const showFooter = canCheckOut.length > 0 || canCheckIn.length > 0;
  const handleBack = () => {
    setSelected(undefined);
    setPageState("blank");
  };

  return (
    <div className="flex flex-col max-h-full">
      <div className="py-3 px-6 items-center flex justify-between bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center w-[68%] max-[379px]:w-full">
          <BackButton onClick={handleBack} />
          <span
            style={{
              fontWeight: 500,
              fontSize: 16,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {textbook.title}
          </span>
        </div>
        <div className="max-[379px]:mt-2.5">
          <PrimaryButton onClick={addBookPanel}>+ Add Book</PrimaryButton>
        </div>
      </div>
      <div style={{ overflowY: "scroll" }}>
        <FadeIn>
          <BooksTable columns={columns} data={data} setSelectedBooks={setSelectedBooks} />
        </FadeIn>
      </div>
      {showFooter && (
        <div className="mt-auto py-3 px-6 items-center flex justify-end bg-white border-t border-[#e5e7eb]">
          <div className="flex justify-end gap-2 p-4">
            {canCheckIn.length > 0 && (
              <Button onClick={checkInBooksPanel}>
                Check In {pluralize("Book", canCheckIn.length, true)}
              </Button>
            )}
            {canCheckOut.length > 0 && (
              <Button onClick={checkOutBooksPanel}>
                Check Out {pluralize("Book", canCheckOut.length, true)}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
