import { PlusIcon } from "@heroicons/react/solid";
import axios, { AxiosError } from "axios";
import pluralize from "pluralize";
import { useContext, useState } from "react";
import { TextbookSetModel } from "../../../../types/models/textbookSetTypes";
import { TextbookModel } from "../../../../types/models/textbookTypes";
import { Button } from "../../../../components/ui";
import BackButton from "../../../../components/BackButton";
import { useToasterContext } from "../../../../hooks";
import { APIError, APITextbooksResponse } from "../../../../types/apiResponses";
import AddBooksTable from "../../AddBooksTable";
import { TextbookContext } from "../../TextbooksTest";


interface PreBook {
  passed: boolean;
  bookNumber: number;
  quality: "Excellent" | "Good" | "Acceptable" | "Poor" | "Lost";
  status: "Available" | "Checked Out" | "Replaced" | "Not Available";
}

interface AddBookProps {
  textbook: TextbookSetModel;
  books: TextbookModel[];
  closePanel: () => void;
}

const defaultPreBook = (bookNumber: number, passed = true): PreBook => ({
  passed,
  bookNumber,
  quality: "Excellent",
  status: "Available",
});

export default function AddBookPanel({ textbook, books, closePanel }: AddBookProps) {
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
      closePanel();
      getTextbookSets();
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  return (
    <div className="flex flex-col max-h-full">
      <div className="py-3 px-6 items-center flex justify-between bg-white border-b border-gray-200 sticky top-0 z-50">
        <div style={{ display: "flex", alignItems: "center" }}>
          <BackButton onClick={closePanel} />
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
          <Button
            onClick={addRow}
            icon={<PlusIcon className="h-5 w-5" />}
            text="Add Another Book"
          />
        </div>
      </div>

      <div className="mt-auto py-3 px-6 items-center flex justify-end bg-white border-t border-[#e5e7eb]">
        <div className="flex justify-end gap-2 p-4">
          <Button text="Cancel" onClick={closePanel} />
          <Button
            text={`Add ${pluralize("Book", booksToAdd.length, true)}`}
            variant="primary"
            disabled={!submittable}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
