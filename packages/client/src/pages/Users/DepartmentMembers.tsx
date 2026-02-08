import classNames from "classnames";
import pluralize from "pluralize";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DepartmentMember, DepartmentModel } from "../../types/models";
import { useDeleteDepartmentMember, useUpdateDepartmentMember } from "../../api";
import Menuuuu from "../../components/Menu";
import TableWrapper from "../../components/TableWrapper";
import { useChecker2, useToasterContext } from "../../hooks";

interface Props {
  department: DepartmentModel;
  fetchDepartment: () => Promise<void>;
}

interface DirtyRow {
  _id: string;
  role: string;
}

export default function DepartmentMembers(props: Props) {
  const { department, fetchDepartment } = props;
  const {
    allSelected,
    checkboxRef,
    toggleAll,
    selectedData: selectedMembers,
    data: members,
    setSelectedData: setSelectedMembers,
  } = useChecker2(department.members || []);
  const { showToaster } = useToasterContext();
  const [dirtyRows, setDirtyRows] = useState<DirtyRow[]>([]);

  const deleteMemberMutation = useDeleteDepartmentMember();
  const updateMemberMutation = useUpdateDepartmentMember();

  const handleDeleteMembers = async () => {
    const response = await Promise.allSettled(
      selectedMembers.map((member) =>
        deleteMemberMutation.mutateAsync({
          departmentId: department._id,
          memberId: member._id,
        })
      )
    );
    fetchDepartment();
    setSelectedMembers([]);
    showToaster(
      pluralize(
        "members",
        response.filter((result) => result.status === "fulfilled").length,
        true
      ) + " deleted!",
      "success"
    );
  };

  const handleUpdateMembers = async () => {
    const response = await Promise.allSettled(
      dirtyRows.map((row) =>
        updateMemberMutation.mutateAsync({
          departmentId: department._id,
          memberId: row._id,
          role: row.role,
        })
      )
    );
    fetchDepartment();
    setSelectedMembers([]);
    setDirtyRows([]);
    showToaster(
      pluralize(
        "members",
        response.filter((result) => result.status === "fulfilled").length,
        true
      ) + " updated!",
      "success"
    );
  };

  return (
    <div>
      <div className="sm:h-[35px] sm:flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900">
          Showing {pluralize("Members", members.length, true)}
        </span>
        <div className="sm:block flex space-x-3  pt-2 sm:pt-0">
          {selectedMembers.length > 0 && (
            <button
              type="button"
              className="w-full sm:w-auto justify-center inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={handleDeleteMembers}
            >
              Remove {pluralize("Members", selectedMembers.length, true)}
            </button>
          )}
          {dirtyRows.length > 0 && (
            <button
              type="button"
              className="w-full sm:w-auto justify-center inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              onClick={handleUpdateMembers}
            >
              Update {pluralize("Members", dirtyRows.length, true)}
            </button>
          )}
        </div>
      </div>
      <TableWrapper overflow>
        <table className="table-auto rounded [&_td]:p-0 [&_th]:px-0">
          <thead>
            <tr>
              <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8 border-b">
                <input
                  type="checkbox"
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                  ref={checkboxRef}
                  checked={allSelected && members.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th>Name</th>
              <th className="hidden md:table-cell">Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <MemberRow
                key={member._id}
                member={member}
                selectedMembers={selectedMembers}
                setSelectedMembers={setSelectedMembers}
                setDirtyRows={setDirtyRows}
                dirty={dirtyRows.some((row) => row._id === member._id)}
              />
            ))}
          </tbody>
        </table>
      </TableWrapper>
    </div>
  );
}

function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
}

const MemberRow = ({
  member,
  selectedMembers,
  setSelectedMembers,
  setDirtyRows,
  dirty,
}: {
  member: DepartmentMember;
  selectedMembers: DepartmentMember[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<DepartmentMember[]>>;
  setDirtyRows: React.Dispatch<React.SetStateAction<DirtyRow[]>>;
  dirty: boolean;
}) => {
  const [role, setRole] = useState(member.role);
  const selected = selectedMembers.includes(member);

  const handleRowChange = (option: { label: string; value: string }) => {
    if (!dirty && role === option.value) return;
    setRole(option.value as "LEADER" | "MEMBER");
    setDirtyRows((rows) => {
      const copiedRows = [...rows];
      const index = copiedRows.findIndex((row) => row._id === member._id);
      if (index < 0) return copiedRows.concat({ _id: member._id, role: option.value });
      copiedRows[index].role = option.value;
      return copiedRows;
    });
  };

  return (
    <tr
      className={classNames({ "bg-indigo-50": selected }, { "hover:bg-gray-100": !selected })}
      key={member._id}
    >
      <td className="relative w-12 px-6 sm:w-16 sm:px-8 pl-4 py-2.5 border-b border-gray-300">
        <div className={`absolute w-1 h-full top-0 left-0 ${dirty ? "bg-amber-500" : ""}`} />
        <input
          type="checkbox"
          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
          value={member._id!}
          checked={selected}
          onChange={(e) =>
            setSelectedMembers(
              e.target.checked
                ? [...selectedMembers, member]
                : selectedMembers.filter((m) => m !== member)
            )
          }
        />
      </td>
      <td className="border-b border-gray-300 py-2">
        <div>
          <Link to={`/users/${slugify(member.fullName)}`}>
            <span className="text-blue-500 font-medium">{member.fullName}</span>
          </Link>
          <div className="text-gray-400 text-xs md:hidden">{member.email}</div>
        </div>
      </td>
      <td className="border-b border-gray-300 text-gray-400 hidden md:table-cell">
        {member.email}
      </td>
      <td className="border-b border-gray-300 text-gray-400 md:w-1/6 w-1/6 pr-4">
        <Menuuuu
          inRow
          options={[
            { label: "Member", value: "MEMBER" },
            { label: "Leader", value: "LEADER" },
          ]}
          value={role}
          onChange={handleRowChange}
        />
      </td>
    </tr>
  );
};
