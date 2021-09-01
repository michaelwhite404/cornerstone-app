import { Button, HTMLSelect, InputGroup, NumericInput, Toaster } from "@blueprintjs/core";
import { XCircleIcon } from "@heroicons/react/solid";
import React, { useState } from "react";
import { TextbookModel } from "../../../../src/types/models/textbookTypes";
import TableToolbox from "../../components/Table/TableToolbox";
import { grades } from "../../utils/grades";

interface CheckoutTableProps {
  data: TextbookModel[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTextbooks: React.Dispatch<React.SetStateAction<TextbookModel[]>>;
  toasterRef: React.RefObject<Toaster>;
}

interface PreBook {
  passed: boolean;
  bookNumber: number;
  quality: "Excellent" | "Good" | "Acceptable" | "Poor" | "Lost";
  status: "Available" | "Checked Out" | "Replaced" | "Not Available";
}

export default function AddTable() {
  const [data, setData] = useState({ title: "", class: 0, num: 0 });
  const [dataLocked, setDataLocked] = useState(false);
  const [books, setBooks] = useState<PreBook[]>([]);

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value }: any = e.target;
    if (name === "class") value = +value;
    setData({ ...data, [name]: value });
  };

  const handleNumberChange = (valueAsNumber: number) => {
    setData({ ...data, num: valueAsNumber });
    setBooks(
      Array.from({ length: valueAsNumber }).map((b, i) => ({
        passed: true,
        bookNumber: i + 1,
        quality: "Excellent",
        status: "Available",
      }))
    );
  };

  const toggleLock = () => {
    setDataLocked(!dataLocked);
  };

  const changeBook = (index: number, key: keyof PreBook, value: string) => {
    const copiedBooks = books.map((book) => ({ ...book, passed: true }));
    const book = copiedBooks.find((_, i) => i === index)!;
    if (key === "bookNumber") {
      book.bookNumber = Number(value);
      if (book.bookNumber === 0 || isNaN(book.bookNumber)) {
        book.passed = false;
      }
    } else {
      // @ts-ignore
      book[key] = value;
    }
    copiedBooks[index] = book;
    findDuplicateIndexes(copiedBooks);
    setBooks(copiedBooks);
  };

  const findDuplicateIndexes = (books: PreBook[]) => {
    const obj: { [x: number]: number[] } = {};
    const dupeIndexes: number[] = [];
    books.forEach((book, index) => {
      obj[book.bookNumber] ? obj[book.bookNumber].push(index) : (obj[book.bookNumber] = [index]);
    });

    for (const num in obj) if (obj[num].length > 1) dupeIndexes.push(...obj[num]);
    books.forEach(
      (book, index) => (book.passed = !dupeIndexes.includes(index) && book.passed === true)
    );
  };

  const dataPassed = data.title.length > 0 && data.class > -1 && data.num > 0;
  const booksPassed = books.filter((book) => book.passed === false).length === 0;
  const submittable = dataPassed && dataLocked && booksPassed;
  return (
    <>
      <div>
        <div className="add-textbook-info">
          <TableToolbox>
            <div
              className="flex justify-space-between"
              style={{ width: "100%", padding: "0 25px" }}
            >
              <div className="w-h-full flex align-center">
                <div className="table-toolbox-item">
                  <span>Name of Textbook</span>
                  <InputGroup
                    type="text"
                    value={data.title}
                    name="title"
                    onChange={handleDataChange}
                    disabled={dataLocked}
                  />
                </div>
                <div className="table-toolbox-item">
                  <span>Grade</span>
                  <HTMLSelect
                    options={grades.map((g, i) => ({ label: g, value: i }))}
                    value={data.class}
                    name="class"
                    onChange={handleDataChange}
                    style={{ width: 100 }}
                    disabled={dataLocked}
                  />
                </div>
                <div className="table-toolbox-item">
                  <span>Number of Textbooks</span>
                  <NumericInput
                    value={data.num.toString()}
                    name="num"
                    onValueChange={handleNumberChange}
                    min={0}
                    style={{ width: 50 }}
                    allowNumericCharactersOnly
                    disabled={dataLocked}
                  />
                </div>
              </div>
              <div>
                <Button
                  intent={dataLocked ? "warning" : "primary"}
                  icon={dataLocked ? "edit" : "lock"}
                  onClick={toggleLock}
                  disabled={!dataPassed}
                >
                  {dataLocked ? "Edit" : "Lock"}
                </Button>
              </div>
            </div>
          </TableToolbox>
        </div>
        <table id="add-textbook-table">
          <colgroup>
            <col span={1} style={{ width: "10%" }} />
            <col span={1} style={{ width: "30%" }} />
            <col span={1} style={{ width: "30%" }} />
            <col span={1} style={{ width: "30%" }} />
          </colgroup>
          <thead>
            <tr>
              <th></th>
              <th>Book Number</th>
              <th>Quality</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <TableRow
                book={book}
                key={`book-index-${index}`}
                dataLocked={dataLocked}
                index={index}
                changeBook={changeBook}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="checkout-table-footer">
        <Button intent="primary" disabled={!submittable}>
          Add Textbooks
        </Button>
      </div>
    </>
  );
}

function TableRow({
  dataLocked,
  index,
  book,
  changeBook,
}: {
  dataLocked: boolean;
  index: number;
  book: PreBook;
  changeBook: (index: number, key: keyof PreBook, value: string) => void;
}) {
  return (
    <tr key={`book-index-${index}`}>
      <td style={{ textAlign: "center" }}>
        {!book.passed && <XCircleIcon color="#c50f0f" width={25} />}
      </td>
      <td>
        <InputGroup
          value={`${book.bookNumber}`}
          style={{ width: 50 }}
          disabled={!dataLocked}
          onChange={(e) => changeBook(index, "bookNumber", e.target.value)}
        />
      </td>
      <td>
        <HTMLSelect
          options={["Excellent", "Good", "Acceptable", "Poor", "Lost"]}
          disabled={!dataLocked}
          value={book.quality}
          onChange={(e) => changeBook(index, "quality", e.target.value)}
        />
      </td>
      <td>
        <HTMLSelect
          options={["Available", "Replaced", "Not Available"]}
          disabled={!dataLocked}
          value={book.status}
          onChange={(e) => changeBook(index, "status", e.target.value)}
        />
      </td>
    </tr>
  );
}
