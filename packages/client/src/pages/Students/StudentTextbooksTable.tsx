import { StudentTextbook } from "../../types/models";
import TableWrapper from "../../components/TableWrapper";

interface Props {
  textbooks: StudentTextbook[];
}

export default function StudentTextbooksTable({ textbooks }: Props) {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th className="pl-4 ">Title</th>
            <th>#</th>
            <th className="hidden lg:table-cell pr-2">Class</th>
            <th className="pr-2">Quality</th>
          </tr>
        </thead>
        <tbody>
          {textbooks.map((textbook, i) => (
            <tr className={i !== textbooks.length - 1 ? "border-b" : ""} key={textbook._id}>
              <td className="pl-4 pr-6 py-2.5 font-medium w-[1%] whitespace-nowrap">
                {textbook.textbookSet.title}
              </td>
              <td className="w-10">{textbook.bookNumber}</td>
              <td className="hidden lg:table-cell pr-2">{textbook.textbookSet.class}</td>
              <td className="pr-2">{textbook.quality}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}
