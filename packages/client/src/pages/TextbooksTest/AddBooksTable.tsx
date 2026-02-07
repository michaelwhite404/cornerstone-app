import { XCircleIcon, TrashIcon } from "@heroicons/react/solid";
import { Button, Input, Select } from "../../components/ui";

interface PreBook {
  passed: boolean;
  bookNumber: number;
  quality: "Excellent" | "Good" | "Acceptable" | "Poor" | "Lost";
  status: "Available" | "Checked Out" | "Replaced" | "Not Available";
}

interface Props {
  booksToAdd: PreBook[];
  changeBook: (index: number, key: keyof PreBook, value: string) => void;
  deleteBook: (index: number) => void;
  dataLocked?: boolean;
}

export default function AddBooksTable({ booksToAdd, changeBook, deleteBook, dataLocked }: Props) {
  return (
    <table id="add-book-table">
      <colgroup>
        {[10, 20, 32, 32, 6].map((w, i) => (
          <col span={1} style={{ width: `${w}%` }} key={"col" + i} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {["", "#", "Quality", "Status", ""].map((h, i) => (
            <th className="sticky top-0 z-[2] shadow-[0_-1px_#d1d5db_inset] border-b-0" key={"header" + i}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {booksToAdd.map((book, index) => (
          <TableRow
            book={book}
            key={`book-index-${index}`}
            index={index}
            changeBook={changeBook}
            deleteBook={deleteBook}
            dataLocked={dataLocked}
          />
        ))}
      </tbody>
    </table>
  );
}

function TableRow({
  index,
  book,
  changeBook,
  deleteBook,
  dataLocked,
}: {
  index: number;
  book: PreBook;
  changeBook: (index: number, key: keyof PreBook, value: string) => void;
  deleteBook: (index: number) => void;
  dataLocked?: boolean;
}) {
  if (dataLocked === undefined) dataLocked = true;
  const handleDelete = () => deleteBook(index);

  return (
    <tr key={`book-index-${index}`}>
      <td style={{ textAlign: "center" }} className="py-0.5">
        {!book.passed && <XCircleIcon color="#c50f0f" width={25} />}
      </td>
      <td className="py-0.5">
        <Input
          value={`${book.bookNumber}`}
          style={{ width: 50 }}
          onChange={(e) => changeBook(index, "bookNumber", e.target.value)}
          className="py-0.5"
          disabled={!dataLocked}
        />
      </td>
      <td className="py-0.5">
        <Select
          options={["Excellent", "Good", "Acceptable", "Poor", "Lost"].map((q) => ({
            label: q,
            value: q,
          }))}
          value={book.quality}
          onChange={(e) => changeBook(index, "quality", e.target.value)}
          className="py-0.5"
          disabled={!dataLocked}
        />
      </td>
      <td className="py-0.5">
        <Select
          options={["Available", "Replaced", "Not Available"].map((s) => ({
            label: s,
            value: s,
          }))}
          value={book.status}
          onChange={(e) => changeBook(index, "status", e.target.value)}
          className="py-0.5"
          disabled={!dataLocked}
        />
      </td>
      <td className="py-0.5">
        {index > 0 && (
          <Button
            icon={<TrashIcon className="h-5 w-5" />}
            variant="minimal"
            onClick={handleDelete}
            disabled={!dataLocked}
            className="text-red-500 hover:text-red-700"
          />
        )}
      </td>
    </tr>
  );
}
