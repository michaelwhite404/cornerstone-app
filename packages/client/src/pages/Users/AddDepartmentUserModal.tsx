import { CheckIcon, PlusIcon, XCircleIcon } from "@heroicons/react/solid";
import axios from "axios";
import capitalize from "capitalize";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { DepartmentModel, EmployeeModel } from "../../types/models";
import Combobox from "../../components/Combobox";
import Menu from "../../components/Menu";
import Modal from "../../components/Modal";
import { APIUsersResponse } from "../../types/apiResponses";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  departmentName: string;
  addMembersToGroup: (
    users: {
      id: string;
      role: string;
    }[]
  ) => Promise<void>;
  currentUsers: NonNullable<DepartmentModel["members"]>;
}

type Role = "MEMBER" | "LEADER";

interface PotentialMember {
  user?: EmployeeModel;
  role?: Role;
}
type FutureMember = Required<PotentialMember>;

export default function AddDepartmentUserModal(props: Props) {
  const { open, setOpen, departmentName, addMembersToGroup } = props;
  const [users, setUsers] = useState<PotentialMember[]>([]);
  const [memberToAdd, setMemberToAdd] = useState<{
    user?: EmployeeModel;
    role: Role;
  }>({ role: "MEMBER" });

  useEffect(() => {
    const fetchUsers = async () => {
      const { users } = (await axios.get<APIUsersResponse>("/api/v2/users?active=true")).data.data;
      const potentialMembers: PotentialMember[] = users.map((user) => ({ user }));
      const currentUsersIds = props.currentUsers.map((user) => user._id as string);
      setUsers(potentialMembers.filter(({ user }) => !currentUsersIds.includes(user?._id)));
    };
    fetchUsers();
  }, [props.currentUsers]);

  const futureMembers = users.filter((u) => u.role) as FutureMember[];

  const roleOptions = ["MEMBER", "LEADER"].map((role) => ({
    label: capitalize(role.toLowerCase()),
    value: role,
  }));

  const handleComboboxChange = (value?: PotentialMember) =>
    value && setMemberToAdd({ ...memberToAdd, user: value.user });

  //@ts-ignore
  const handleRoleChange: (value: { label: string; value: string }) => void = ({
    value,
  }: {
    value: Role;
  }) => {
    setMemberToAdd({ ...memberToAdd, role: value });
  };

  const close = () => {
    setOpen(false);
    setMemberToAdd({ role: "MEMBER" });
  };

  const addMember = () => {
    if (memberToAdd.user && memberToAdd.role) {
      // setUsers([...users].filter((user) => user.email !== memberToAdd.user?.email));
      const index = users.findIndex(({ user }) => user?._id === memberToAdd.user?._id);
      if (index > -1) {
        const copy = [...users];
        copy[index].role = memberToAdd.role;
        setUsers(copy);
      }

      // setFutureMembers([{ user: memberToAdd.user, role: memberToAdd.role }, ...futureMembers]);
      setMemberToAdd({ role: "MEMBER" });
    }
  };

  const handleDelete = (email: string) => {
    const copy = [...users];
    const i = copy.findIndex(({ user }) => user?.email === email);
    if (i > -1) {
      copy[i].role = undefined;
      setUsers(copy);
    }
  };

  const submit = () => {
    const usersArg = futureMembers.map((fM) => ({
      id: fM.user._id,
      role: fM.role,
    }));
    addMembersToGroup(usersArg).then(close);
  };

  const displayValue = (option?: PotentialMember) => option?.user?.fullName || "";

  return (
    <Modal open={open} setOpen={setOpen} disableOverlayClick onClose={close}>
      <div className="font-medium text-xl mb-5">Add Members</div>
      <div>
        <div className="mb-5">
          <div className="uppercase text-gray-400 text-xs font-medium mb-2">
            Add members to {departmentName} Department
          </div>
          <div className="grid gap-2" style={{ gridTemplateColumns: "1fr auto auto" }}>
            <div>
              <Combobox
                value={memberToAdd}
                options={users.filter(({ role }) => !role)}
                displayValue={displayValue}
                filterFunction={({ user }, currentValue) =>
                  user?.fullName!.toLowerCase().includes(currentValue.toLowerCase()) ||
                  user?.email!.toLowerCase().includes(currentValue.toLowerCase()) ||
                  false
                }
                onChange={handleComboboxChange}
                renderItem={({ user }, { active, selected }) => (
                  <>
                    <span className={classNames("block truncate", selected && "font-semibold")}>
                      {user?.fullName}{" "}
                      <span
                        className={classNames("text-xs", active ? "text-white" : "text-gray-400")}
                      >
                        ({user?.email})
                      </span>
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 left-0 flex items-center pl-1.5",
                          active ? "text-white" : "text-blue-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <Menu options={roleOptions} onChange={handleRoleChange} value={memberToAdd.role} />
            </div>
            <div>
              <button
                type="button"
                className="disabled:bg-gray-300 w-full inline-flex items-center justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                disabled={!memberToAdd.user}
                onClick={addMember}
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="uppercase text-gray-400 text-xs font-medium mb-2">
            Members to Add ({futureMembers.length})
          </div>
          <div className="h-32 overflow-scroll">
            <div>
              {futureMembers.map((m) => (
                <div className="flex justify-between items-center py-2" key={m.user._id}>
                  <div>
                    <div className="font-medium">{m.user.fullName}</div>
                    <div className="font-light text-gray-400 text-xs">{m.user.email}</div>
                  </div>
                  <div className="flex items-center">
                    <div>
                      <div className="flex items-center rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        {capitalize(m.role.toLowerCase())}
                      </div>
                    </div>
                    <div className="mx-3 flex items-center">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-red-400"
                        onClick={() => handleDelete(m.user.email!)}
                      >
                        <XCircleIcon className="w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="disabled:bg-gray-300 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={submit}
          disabled={futureMembers.length === 0}
        >
          Add to Department
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
