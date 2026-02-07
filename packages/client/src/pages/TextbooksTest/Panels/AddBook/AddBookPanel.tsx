import { Button } from "@blueprintjs/core";
import { PanelActions } from "@blueprintjs/core/lib/esm/components/panel-stack2/panelTypes";
import axios, { AxiosError } from "axios";
import pluralize from "pluralize";
import { useContext, useState } from "react";
import { TextbookSetModel } from "../../../../types/models/textbookSetTypes";
import { TextbookModel } from "../../../../types/models/textbookTypes";
import BackButton from "../../../../components/BackButton";
import { useToasterContext } from "../../../../hooks";
import { APIError, APITextbooksResponse } from "../../../../types/apiResponses";
import AddBooksTable from "../../AddBooksTable";
import { TextbookContext } from "../../TextbooksTest";
import "./AddBookPanel.sass";

interface PreBook {
  passed: boolean;
  bookNumber: number;
  quality: "Excellent" | "Good" | "Acceptable" | "Poor" | "Lost";
  status: "Available" | "Checked Out" | "Replaced" | "Not Available";
}

interface AddBookProps extends PanelActions {
  textbook: TextbookSetModel;
  books: TextbookModel[];
}

const defaultPreBook = (bookNumber: number, passed = true): PreBook => ({
  passed,
  bookNumber,
  quality: "Excellent",
  status: "Available",
});

export default function AddBookPanel({ textbook, books, ...props }: AddBookProps) {
  const { showToaster } = useToasterContext();
  const { getTextbookSets } = useContext(TextbookContext);
  const [booksToAdd, setBooksToAdd] = useState<PreBook[]>([
    defaultPreBook(books[books.length - 1].bookNumber + 1),
  ]);

  const changeBook = (index: number, key: keyof PreBook, value: string) => {
    const copiedBooks = booksToAdd.map((book) => ({ ...book, passed: true }));
    const book = copiedBooks.find((_, i) => i === index)!;
    if (key === "bookNumber") {
      const castValue = Number(value);
      book.bookNumber = isNaN(castValue) ? 0 : castValue;
      if (book.bookNumber <= 0) book.passed = false;
    } else {
      // @ts-ignore
      book[key] = value;
    }
    copiedBooks[index] = book;
    findDuplicateIndexes(books, copiedBooks);
    setBooksToAdd(copiedBooks);
  };

  const findDuplicateIndexes = (originalBooks: TextbookModel[], preBooks: PreBook[]) => {
    const mergedArray = [
      ...originalBooks.map((b) => b.bookNumber),
      ...preBooks.map((b) => b.bookNumber),
    ];
    const dupes = mergedArray.filter((item, index) => mergedArray.indexOf(item) !== index);
    preBooks.forEach((book) => {
      if (book.bookNumber <= 0) book.passed = false;
      book.passed = !dupes.includes(book.bookNumber) && book.passed === true;
    });
  };

  const addRow = () => {
    const number = booksToAdd[booksToAdd.length - 1].bookNumber + 1;
    const add = [...booksToAdd, defaultPreBook(number, number > 0)];
    findDuplicateIndexes(books, add);
    setBooksToAdd(add);
  };

  const deleteBook = (index: number) => setBooksToAdd((b) => b.filter((_, i) => i !== index));
  const submittable = booksToAdd.filter((book) => book.passed === false).length === 0;

  const handleSubmit = async () => {
    try {
      const res = await axios.post<APITextbooksResponse>(
        `/api/v2/textbooks/${textbook._id}/books/bulk`,
        {
          books: booksToAdd,
        }
      );
      showToaster(pluralize("book", res.data.data.books.length, true) + " added", "success");
      props.closePanel();
      getTextbookSets();
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  return (
    <div className="main-content-inner-wrapper">
      <div className="main-content-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <BackButton onClick={props.closePanel} />
          <span style={{ fontWeight: 500, fontSize: 16 }}>Add {textbook.title} Book</span>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <AddBooksTable booksToAdd={booksToAdd} changeBook={changeBook} deleteBook={deleteBook} />
        <div style={{ padding: 20 }}>
          <Button onClick={addRow} icon="add" text="Add Another Book" />
        </div>
      </div>

      <div className="main-content-footer">
        <div className="bp4-dialog-footer-actions">
          <Button text="Cancel" onClick={props.closePanel} />
          <Button
            text={`Add ${pluralize("Book", booksToAdd.length, true)}`}
            intent="primary"
            disabled={!submittable}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
