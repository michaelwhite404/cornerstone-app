import { LockClosedIcon, PencilIcon } from "@heroicons/react/solid";
import { AxiosError } from "axios";
import pluralize from "pluralize";
import { useContext, useState } from "react";
import { TextbookSetModel } from "../../types/models/textbookSetTypes";
import { TextbookModel } from "../../types/models/textbookTypes";
import { Button } from "../../components/ui";
import BackButton from "../../components/BackButton";
import FadeIn from "../../components/FadeIn";
import LabeledInput from "../../components/Inputs/LabeledInput";
import LabeledNumbericInput from "../../components/Inputs/LabeledNumbericInput";
import LabeledSelect from "../../components/Inputs/LabeledSelect";
import { useToasterContext } from "../../hooks";
import { useTextbookActions } from "../../api";
import { APIError } from "../../types/apiResponses";
import { grades } from "../../utils/grades";
import AddBooksTable from "./AddBooksTable";
import { TextbookContext } from "./TextbooksTest";

interface AddTextbookProps {
  setPageState: React.Dispatch<React.SetStateAction<"blank" | "view" | "add">>;
  setSelected: React.Dispatch<React.SetStateAction<TextbookSetModel | undefined>>;
}

interface PreBook {
  passed: boolean;
  bookNumber: number;
  quality: "Excellent" | "Good" | "Acceptable" | "Poor" | "Lost";
  status: "Available" | "Checked Out" | "Replaced" | "Not Available";
}

const defaultPreBook = (bookNumber: number, passed = true): PreBook => ({
  passed,
  bookNumber,
  quality: "Excellent",
  status: "Available",
});

export default function AddTextbook(props: AddTextbookProps) {
  const { createSetAndBooks } = useTextbookActions();
  const { showToaster } = useToasterContext();
  const { getTextbookSets } = useContext(TextbookContext);
  const [data, setData] = useState({ title: "", class: "", grade: 0, num: 1 });
  const [booksToAdd, setBooksToAdd] = useState<PreBook[]>([defaultPreBook(1)]);
  const [dataLocked, setDataLocked] = useState(false);

  const toggleLock = () => setDataLocked(!dataLocked);

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value }: any = e.target;
    if (name === "grade") value = +value;
    setData({ ...data, [name]: value });
  };
  const handleNumberChange = (valueAsNumber: number) => {
    if (valueAsNumber < 0 || isNaN(valueAsNumber)) return;
    setData({ ...data, num: valueAsNumber });
    setBooksToAdd((books) => {
      if (valueAsNumber < books.length) return books.slice(0, valueAsNumber);
      const lastBookNumber = books.slice(-1)[0]?.bookNumber || 0;
      return books.concat(
        Array.from({ length: valueAsNumber - books.length }).map((_, i) =>
          defaultPreBook(i + lastBookNumber + 1)
        )
      );
    });
  };

  const inputs = [
    {
      label: "Textbook Name",
      Component: LabeledInput,
      width: 100,
      props: {
        required: true,
        value: data.title,
        name: "title",
        onChange: handleDataChange,
        disabled: dataLocked,
      },
    },
    {
      label: "Class",
      Component: LabeledInput,
      width: 50,
      props: {
        required: true,
        value: data.class,
        name: "class",
        onChange: handleDataChange,
        disabled: dataLocked,
      },
    },
    {
      label: "Grade",
      Component: LabeledSelect,
      width: 50,
      props: {
        required: true,
        options: grades.map((g, i) => ({ label: g, value: i })),
        value: data.grade,
        name: "grade",
        onChange: handleDataChange,
        disabled: dataLocked,
      },
    },
    {
      label: "# of Books To Add",
      Component: LabeledNumbericInput,
      width: 50,
      props: {
        // style: { width: "100px" },
        required: true,
        value: data.num,
        name: "num",
        onValueChange: handleNumberChange,
        min: 1,
        allowNumericCharactersOnly: true,
        fill: true,
        disabled: dataLocked,
      },
    },
  ];

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
    findDuplicateIndexes([], copiedBooks);
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

  const deleteBook = (index: number) =>
    setBooksToAdd((b) => {
      const books = b.filter((_, i) => i !== index);
      findDuplicateIndexes([], books);
      setData((data) => ({ ...data, num: books.length }));
      return books;
    });

  const dataPassed =
    data.title.length > 0 && data.class.length > 0 && data.grade > -1 && data.num > 0;
  const booksPassed = booksToAdd.filter((book) => book.passed === false).length === 0;
  const submittable = dataPassed && dataLocked && booksPassed;

  const handleBack = () => props.setPageState("blank");

  const handleSubmit = () => {
    createSetAndBooks({ ...data, books: booksToAdd })
      .then((data) => {
        showToaster(
          `Textbook created with ${pluralize("book", data.books.length, true)} `,
          "success"
        );
        getTextbookSets();
        props.setSelected(data.textbook);
        props.setPageState("view");
      })
      .catch((err) => showToaster((err as AxiosError<APIError>).response!.data.message, "danger"));
  };
  return (
    <div className="flex flex-col h-full">
      <FadeIn>
        <div className="py-3 px-6 items-center flex justify-between bg-white border-b border-gray-200 sticky top-0 z-50">
          <div style={{ display: "flex", alignItems: "center" }}>
            <BackButton onClick={handleBack} />
            <span style={{ fontWeight: 500, fontSize: 16 }}>Create New Textbook</span>
          </div>
        </div>
        <div style={{ overflowY: "scroll" }}>
          <div className="p-5 border-b border-gray-200 max-[992px]:py-2.5 max-[992px]:px-1">
            <div className="flex flex-wrap">
              {inputs.map(({ label, Component, width, props }) => (
                <div style={{ width: `${width}%` }} className="px-4 py-2" key={label}>
                  {/**@ts-ignore */}
                  <Component label={label} {...props} />
                </div>
              ))}
              <div className="self-center w-1/2 h-full mt-[5px] px-[15px]">
                <Button
                  variant={dataLocked ? "secondary" : "success"}
                  icon={
                    dataLocked ? (
                      <PencilIcon className="h-5 w-5" />
                    ) : (
                      <LockClosedIcon className="h-5 w-5" />
                    )
                  }
                  onClick={toggleLock}
                  disabled={!dataPassed}
                  fill
                >
                  {dataLocked ? "Edit" : "Lock"}
                </Button>
              </div>
            </div>
          </div>
          <div>
            <AddBooksTable
              booksToAdd={booksToAdd}
              changeBook={changeBook}
              deleteBook={deleteBook}
              dataLocked={dataLocked}
            />
          </div>
        </div>
        <div className="mt-auto py-3 px-6 items-center flex justify-end bg-white border-t border-[#e5e7eb]">
          <div className="flex justify-end gap-2">
            <Button text="Cancel" onClick={handleBack} />
            <Button
              text="Create Textbook"
              variant="primary"
              disabled={!submittable}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
