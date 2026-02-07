import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { TextbookSetModel } from "../../../types/models/textbookSetTypes";
import { TextbookModel } from "../../../types/models/textbookTypes";
import TextbookStatusBadge from "../../../components/Badges/TextbookStatusBadge";
import TextbookQualityBadge from "../../../components/Badges/TextbookQualityBadge";
import { APITextbooksResponse } from "../../../types/apiResponses";
import { numberToGrade } from "../../../utils/grades";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import { PanelActions } from "@blueprintjs/core/lib/esm/components/panel-stack2/panelTypes";
import AddBookPanel from "./AddBook/AddBookPanel";
import { Button, Classes } from "@blueprintjs/core";
import BooksTable from "../BooksTable/BooksTable";
import pluralize from "pluralize";
import BackButton from "../../../components/BackButton";
import CheckOutPanel from "./CheckOut/CheckOutPanel";
import CheckInPanel from "./CheckIn/CheckInPanel";
import FadeIn from "../../../components/FadeIn";

export default function TextbooksTestContent({
  textbook,
  setSelected,
  setPageState,
  ...props
}: {
  textbook: TextbookSetModel;
  setSelected: React.Dispatch<React.SetStateAction<TextbookSetModel | undefined>>;
  setPageState: React.Dispatch<React.SetStateAction<"blank" | "view" | "add">>;
} & PanelActions) {
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
    props.openPanel({
      props: { textbook, books },
      renderPanel: AddBookPanel,
    });

  const checkOutBooksPanel = () =>
    props.openPanel({
      props: { data: canCheckOut },
      renderPanel: CheckOutPanel,
    });

  const checkInBooksPanel = () =>
    props.openPanel({
      props: { data: canCheckIn },
      renderPanel: CheckInPanel,
    });

  const showFooter = canCheckOut.length > 0 || canCheckIn.length > 0;
  const handleBack = () => {
    setSelected(undefined);
    setPageState("blank");
  };

  return (
    <div className="main-content-inner-wrapper">
      <div className="main-content-header">
        <div className="content-header-text">
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
        <div className="button-wrapper">
          <PrimaryButton onClick={addBookPanel}>+ Add Book</PrimaryButton>
        </div>
      </div>
      <div style={{ overflowY: "scroll" }}>
        <FadeIn>
          <BooksTable columns={columns} data={data} setSelectedBooks={setSelectedBooks} />
        </FadeIn>
      </div>
      {showFooter && (
        <div className="main-content-footer">
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
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
