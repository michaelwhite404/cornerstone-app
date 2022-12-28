import capitalize from "capitalize";
import { EmployeeModel, UserGroup } from "../../../../src/types/models";

interface TeamsProps {
  user: EmployeeModel;
  groups: UserGroup[];
}

export default function Teams({ user, groups }: TeamsProps) {
  return (
    <>
      <div className="mt-10 divide-y divide-gray-200">
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Departments</h3>
        </div>
        <div className="mt-6">
          <div className="divide-y divide-gray-200">
            {user.departments?.map((dept) => (
              <div key={dept._id} className="py-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:py-5">
                <span className="text-sm font-medium text-gray-500">{dept.name}</span>
                <div className="mt-1 flex text-sm text-gray-900 sm:mt-0">
                  {capitalize(dept.role.toLowerCase())}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10 divide-y divide-gray-200">
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Groups</h3>
        </div>
        <div className="mt-6">
          <div className="divide-y divide-gray-200">
            {groups.map((group) => (
              <div key={group.id} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <span className="text-sm font-medium text-gray-500">{group.name}</span>
                <span className="mt-1 flex text-sm text-gray-900 sm:mt-0">{group.email}</span>
                <span className="text-sm font-medium text-gray-500 justify-self-end">
                  {capitalize(group.role.toLowerCase())}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
