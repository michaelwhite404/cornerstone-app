import { Link } from "react-router-dom";
import { DepartmentModel } from "../../types/models";
// import AvatarList from "../../components/AvatarList";
import TableWrapper from "../../components/TableWrapper";

export default function DepartmentsTable({ departments }: { departments: DepartmentModel[] }) {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th className="pl-6">Department Name</th>
            <th className="">Members</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => (
            <tr key={department._id}>
              <td className="pl-6 py-2 text-blue-500 font-medium border-b ">
                <Link to={department._id}>
                  <span className="text-blue-500 font-medium">{department.name}</span>
                </Link>
              </td>
              <td className="py-2 text-gray-400 border-b ">{department.membersCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}
