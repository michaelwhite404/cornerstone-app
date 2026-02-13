import { XCircleIcon } from "@heroicons/react/solid";
import { LockClosedIcon, PencilIcon } from "@heroicons/react/solid";
import React, { useState } from "react";
import { Button, Input, Select } from "../../components/ui";
import TableToolbox from "../../components/Table/TableToolbox";
import { useCreateSetAndBooks } from "../../api";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { grades } from "../../utils/grades";

interface AddTableProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
  showToaster: (message: string, intent: "success" | "danger") => void;
}

interface PreBook {
  passed: boolean;
  bookNumber: number;
  quality: "Excellent" | "Good" | "Acceptable" | "Poor" | "Lost";
  status: "Available" | "Checked Out" | "Replaced" | "Not Available";
}

export default function AddTable({ setOpen, onSuccess, showToaster }: AddTableProps) {
  const createSetAndBooksMutation = useCreateSetAndBooks();
  const [data, setData] = useState({ title: "", class: "", grade: 0, num: 1 });
  const [dataLocked, setDataLocked] = useState(false);
  const [books, setBooks] = useState<PreBook[]>([
    {
      passed: true,
      bookNumber: 1,
      quality: "Excellent",
      status: "Available",
    },
  ]);

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value }: any = e.target;
    if (name === "grade") value = +value;
    setData({ ...data, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueAsNumber = parseInt(e.target.value, 10);
    if (isNaN(valueAsNumber) || valueAsNumber < 1) return;
    setData({ ...data, num: valueAsNumber });
    setBooks(
      Array.from({ length: valueAsNumber }).map((_, i) => ({
        passed: true,
        bookNumber: i + 1,
        quality: "Excellent",
        status: "Available",
      }))
    );
  };

  const toggleLock = () => setDataLocked(!dataLocked);

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

  const dataPassed =
    data.title.length > 0 && data.class.length > 0 && data.grade > -1 && data.num > 0;
  const booksPassed = books.filter((book) => book.passed === false).length === 0;
  const submittable = dataPassed && dataLocked && booksPassed;

  const submit = async () => {
    if (submittable) {
      try {
        const booksData = books.map(({ bookNumber, quality }) => ({ bookNumber, quality }));
        const result = await createSetAndBooksMutation.mutateAsync({
          title: data.title,
          class: data.class,
          grade: data.grade,
          books: booksData,
        });
        onSuccess();
        setOpen(false);
        showToaster(`${result.textbook.title} with ${result.books.length} books created!`, "success");
      } catch (err) {
        showToaster(getErrorMessage(err), "danger");
      }
    }
  };
  return (
    <>
      <TableToolbox>
        <div className="flex justify-between" style={{ width: "100%", padding: "0 25px" }}>
          <div className="w-full h-full flex items-center">
            <div className="flex items-center mr-[45px] [&_span]:mr-2.5">
              <span>Name of Textbook</span>
              <Input
                type="text"
                value={data.title}
                name="title"
                onChange={handleDataChange}
                disabled={dataLocked}
              />
            </div>
            <div className="flex items-center mr-[45px] [&_span]:mr-2.5">
              <span>Class</span>
              <Input
                type="text"
                value={data.class}
                name="class"
                onChange={handleDataChange}
                disabled={dataLocked}
              />
            </div>
            <div className="flex items-center mr-[45px] [&_span]:mr-2.5">
              <span>Grade</span>
              <Select
                options={grades.map((g, i) => ({ label: g, value: i }))}
                value={data.grade}
                name="grade"
                onChange={handleDataChange}
                style={{ width: 100 }}
                disabled={dataLocked}
              />
            </div>
            <div className="flex items-center mr-[45px] [&_span]:mr-2.5">
              <span>Number of Textbooks</span>
              <Input
                type="number"
                value={data.num}
                name="num"
                onChange={handleNumberChange}
                min={1}
                style={{ width: 50 }}
                disabled={dataLocked}
              />
            </div>
          </div>
          <div>
            <Button
              variant={dataLocked ? "secondary" : "primary"}
              icon={
                dataLocked ? (
                  <PencilIcon className="h-5 w-5" />
                ) : (
                  <LockClosedIcon className="h-5 w-5" />
                )
              }
              onClick={toggleLock}
              disabled={!dataPassed}
            >
              {dataLocked ? "Edit" : "Lock"}
            </Button>
          </div>
        </div>
      </TableToolbox>
      <div
        className="w-full flex items-center flex-col h-[calc(100%-145px)]"
        id="add-table-container"
      >
        <div
          style={{
            width: "100%",
            overflow: "auto",
          }}
        >
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
      </div>
      <div className="justify-end min-h-[50px] shadow-[0_-1px_0_rgba(16,22,26,0.15)] mt-auto bg-white z-[1] flex items-center pr-[25px]">
        <Button variant="primary" disabled={!submittable} onClick={submit}>
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
        <Input
          value={`${book.bookNumber}`}
          style={{ width: 50 }}
          disabled={!dataLocked}
          onChange={(e) => changeBook(index, "bookNumber", e.target.value)}
        />
      </td>
      <td>
        <Select
          options={["Excellent", "Good", "Acceptable", "Poor", "Lost"].map((q) => ({
            label: q,
            value: q,
          }))}
          disabled={!dataLocked}
          value={book.quality}
          onChange={(e) => changeBook(index, "quality", e.target.value)}
        />
      </td>
      <td>
        <Select
          options={["Available", "Replaced", "Not Available"].map((s) => ({
            label: s,
            value: s,
          }))}
          disabled={!dataLocked}
          value={book.status}
          onChange={(e) => changeBook(index, "status", e.target.value)}
        />
      </td>
    </tr>
  );
}
