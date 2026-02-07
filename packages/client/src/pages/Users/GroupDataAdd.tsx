import { CheckIcon, PlusIcon, XCircleIcon } from "@heroicons/react/solid";
import axios from "axios";
import capitalize from "capitalize";
import classNames from "classnames";
import { admin_directory_v1 } from "googleapis";
import { useEffect, useState } from "react";
import Combobox from "../../components/Combobox";
import Menu from "../../components/Menu";
import Modal from "../../components/Modal";

interface GroupDataAddProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupName: string;
  addMembersToGroup: (
    users: {
      name: string;
      email: string;
      role: string;
    }[]
  ) => Promise<void>;
}

export default function GroupDataAdd(props: GroupDataAddProps) {
  const { addMembersToGroup, groupName, open, setOpen } = props;
  const [googleUsers, setGoogleUsers] = useState<admin_directory_v1.Schema$User[]>([]);
  const [memberToAdd, setMemberToAdd] = useState<{
    user?: admin_directory_v1.Schema$User;
    role: string;
  }>({ role: "MEMBER" });
  const [futureMembers, setFutureMembers] = useState<Required<typeof memberToAdd>[]>([]);

  useEffect(() => {
    const fetchGoogleUsers = async () => {
      const res = await axios.get("/api/v2/users/from-google?active=true");
      setGoogleUsers(res.data.data.users);
    };
    fetchGoogleUsers();
  }, []);

  const displayValue = (option?: admin_directory_v1.Schema$User) => option?.name?.fullName || "";

  const roleOptions = ["MEMBER", "MANAGER", "OWNER"].map((role) => ({
    label: capitalize(role.toLowerCase()),
    value: role,
  }));

  const handleComboboxChange = (value?: admin_directory_v1.Schema$User) =>
    value && setMemberToAdd({ ...memberToAdd, user: value });

  const handleRoleChange = ({ value }: { value: string }) => {
    setMemberToAdd({ ...memberToAdd, role: value });
  };

  const close = () => {
    setOpen(false);
    setMemberToAdd({ role: "MEMBER" });
    setFutureMembers([]);
  };

  const addMember = () => {
    if (memberToAdd.user && memberToAdd.role) {
      setGoogleUsers(
        [...googleUsers].filter((user) => user.primaryEmail !== memberToAdd.user?.primaryEmail)
      );
      setFutureMembers([{ user: memberToAdd.user, role: memberToAdd.role }, ...futureMembers]);
      setMemberToAdd({ role: "MEMBER" });
    }
  };

  const handleDelete = (email: string) =>
    setFutureMembers(futureMembers.filter((m) => m.user.primaryEmail !== email));

  const submit = () => {
    const usersArg = futureMembers.map((fM) => ({
      name: fM.user.name!.fullName!,
      email: fM.user.primaryEmail!,
      role: fM.role,
    }));
    addMembersToGroup(usersArg).then(close);
  };

  return (
    <Modal open={open} setOpen={setOpen} disableOverlayClick onClose={close}>
      <div className="font-medium text-xl mb-5">Add Members</div>
      <div>
        <div className="mb-5">
          <div className="uppercase text-gray-400 text-xs font-medium mb-2">
            Add members to {groupName}
          </div>
          <div className="grid gap-2" style={{ gridTemplateColumns: "1fr auto auto" }}>
            <div>
              <Combobox
                value={memberToAdd.user}
                options={googleUsers}
                displayValue={displayValue}
                filterFunction={(user, currentValue) =>
                  user.name!.fullName!.toLowerCase().includes(currentValue.toLowerCase()) ||
                  user.primaryEmail!.toLowerCase().includes(currentValue.toLowerCase())
                }
                onChange={handleComboboxChange}
                renderItem={(user, { active, selected }) => (
                  <>
                    <span className={classNames("block truncate", selected && "font-semibold")}>
                      {user.name?.fullName}{" "}
                      <span
                        className={classNames("text-xs", active ? "text-white" : "text-gray-400")}
                      >
                        ({user.primaryEmail})
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
              <Menu options={roleOptions} onChange={handleRoleChange} />
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
                <div className="flex justify-between items-center py-2" key={m.user.id}>
                  <div>
                    <div className="font-medium">{m.user.name?.fullName}</div>
                    <div className="font-light text-gray-400 text-xs">{m.user.primaryEmail}</div>
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
                        onClick={() => handleDelete(m.user.primaryEmail!)}
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
          Add to Group
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
