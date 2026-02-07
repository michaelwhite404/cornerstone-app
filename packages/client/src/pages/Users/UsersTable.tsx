import { Link } from "react-router-dom";
import { EmployeeModel } from "../../types/models";
import TableWrapper from "../../components/TableWrapper";

export default function UsersTable(props: UsersTableProps) {
  const { users } = props;

  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th className="pl-4 sticky-header">Name</th>
            <th className="xl:table-cell sticky-header hidden">Email</th>
            <th className="md:table-cell hidden sticky-header">Title</th>
            <th className="sticky-header">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="pl-4 py-1.5 border-b">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                    <img src={`${user.image || "./avatar_placeholder.png"}`} alt={user.fullName} />
                  </div>
                  <div className="">
                    <Link to={`/users/${user.slug}`} state={{ fromUsersPage: true, user }}>
                      <span className="text-blue-500 font-medium">{user.fullName}</span>
                    </Link>
                    <div className="xl:hidden text-gray-400 font-light text-sm">{user.email}</div>
                    <div className="md:hidden mt-1 text-gray-400 text-xs">{user.title}</div>
                  </div>
                </div>
              </td>
              <td className="xl:table-cell hidden border-b text-gray-400">{user.email}</td>
              <td className="md:table-cell hidden border-b text-gray-400">{user.title}</td>
              <td className="border-b text-gray-400">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}

interface UsersTableProps {
  users: EmployeeModel[];
}
