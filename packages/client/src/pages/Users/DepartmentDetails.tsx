import { useQueryClient } from "@tanstack/react-query";
import pluralize from "pluralize";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { departmentKeys, useDepartment, useAddDepartmentMembers } from "../../api";
import BackButton from "../../components/BackButton";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Tabs2 from "../../components/Tabs2";
import { useToasterContext } from "../../hooks";
import AddDepartmentUserModal from "./AddDepartmentUserModal";
import DepartmentMembers from "./DepartmentMembers";
import DepartmentSettings from "./DepartmentSettings";

const tabs = [
  { name: "Members", value: "MEMBERS" },
  { name: "Settings", value: "SETTINGS" },
];

export default function DepartmentDetails() {
  const [open, setOpen] = useState(false);
  const [pageState, setPageState] = useState("MEMBERS");
  const { id } = useParams<"id">();
  const { showToaster } = useToasterContext();
  const queryClient = useQueryClient();

  const { data: department } = useDepartment(id || "");
  const addMembersMutation = useAddDepartmentMembers();

  const fetchDepartment = async () => {
    await queryClient.invalidateQueries({ queryKey: departmentKeys.detail(id || "") });
  };

  const addMembersToGroup = async (users: { id: string; role: string }[]) => {
    if (department) {
      try {
        const returnedMembers = await addMembersMutation.mutateAsync({
          departmentId: department._id,
          users,
        });
        showToaster(pluralize("members", returnedMembers.length, true) + " added!", "success");
      } catch {
        showToaster("There was a problem with the request. Please try again", "danger");
      }
    }
  };

  return (
    <div className="flex flex-col" style={{ padding: "10px 25px 25px" }}>
      <div className="my-4 hover:underline cursor-pointer">
        <BackButton />
        Back to departments
      </div>
      {department && (
        <div>
          <div className="flex justify-between items-center">
            <h1>{department?.name}</h1>
            <PrimaryButton
              className="sm:w-auto"
              text="+ Add Members"
              onClick={() => setOpen(true)}
            />
          </div>
          <Tabs2 tabs={tabs} value={pageState} onChange={(tab) => setPageState(tab.value)} />
          <div className="mt-3">
            {/* <div className="sm:flex justify-between">
              <div className="relative mb-2 sm:mb-0">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <SearchIcon className="w-4" />
                </div>
                <input
                  type="search"
                  id="search"
                  className="block p-2 pl-10 w-full sm:w-64 text-sm text-gray-900 bg-white rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search for members"
                />
              </div>
              <PrimaryButton
                className="w-full sm:w-auto"
                text="+ Add Members"
                onClick={() => setOpen(true)}
              />
            </div> */}
            {pageState === "MEMBERS" && (
              <DepartmentMembers department={department} fetchDepartment={fetchDepartment} />
            )}
            {pageState === "SETTINGS" && <DepartmentSettings department={department} />}
          </div>
          <AddDepartmentUserModal
            open={open}
            setOpen={setOpen}
            departmentName={department.name}
            addMembersToGroup={addMembersToGroup}
            currentUsers={department.members || []}
          />
        </div>
      )}
    </div>
  );
}
