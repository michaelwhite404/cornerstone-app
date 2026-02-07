import axios, { AxiosError } from "axios";
import { Divider, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DepartmentModel, EmployeeModel, UserGroup } from "../../types/models";
import BackButton from "../../components/BackButton";
import LabeledInput2 from "../../components/LabeledInput2";
import { AddOnInput } from "../../components/Inputs";
import DepartmentList from "./UserData/DepartmentList";
import GroupList from "./UserData/GroupsList";
import { grades } from "../../utils/grades";
import { admin_directory_v1 } from "googleapis";
import MainContent from "../../components/MainContent";
import { APIError, APIUserResponse } from "../../types/apiResponses";
import { useToasterContext } from "../../hooks";

export default function UserData() {
  const [user, setUser] = useState<EmployeeModel>();
  const [userEdit, setUserEdit] = useState<EmployeeModel>();
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  const [groups, setGroups] = useState<admin_directory_v1.Schema$Group[]>([]);
  // const [pageState, setPageState] = useState<"loading" | "display" | "edit">("display");
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToaster } = useToasterContext();

  const locationState = location.state as any;

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(`/api/v2/users/${slug}`, { params: { projection: "FULL" } });
      setUser(res.data.data.user);
      setUserEdit(res.data.data.user);
    };

    const getDepartments = async () => {
      const res = await axios.get("/api/v2/departments");
      setDepartments(res.data.data.departments);
    };
    const getGroups = async () => {
      const res = await axios.get("/api/v2/groups");
      setGroups(res.data.data.groups);
    };
    getUser();
    getDepartments();
    getGroups();
  }, [slug]);

  const goToUsersPage = () => (locationState.fromUsersPage ? navigate(-1) : navigate("/users"));

  let image = user?.image || "../avatar_placeholder.png";
  if (image && image.endsWith("=s96-c")) {
    image = image.replace("=s96-c", "");
  }

  const handleChange = <T extends HTMLElement>(e: React.ChangeEvent<T>) => {
    //@ts-ignore
    let { name, value } = e.target as { name: string; value: string };
    if (name === "email") value = value.concat("@cornerstone-schools.org");
    //@ts-ignore
    setUserEdit({ ...userEdit, [name]: value });
  };

  const addDepartmentMember = async (
    department: {
      _id: string;
      name: string;
    },
    role: "MEMBER" | "LEADER"
  ) => {
    if (!user) return;
    await axios.post(`/api/v2/departments/${department._id}/members`, {
      users: [{ id: user._id, role }],
    });
    if (!user.departments) return setUser({ ...user, departments: [{ ...department, role }] });
    const sortedDepartments = [...user.departments, { ...department, role }].sort((a, b) =>
      a.name!.localeCompare(b.name!)
    );
    setUser({ ...user, departments: sortedDepartments });
  };

  const addGroupMember = async (email: string, role: string) => {
    if (!user) return;
    const emailStart = email.replace("@cornerstone-schools.org", "");
    const res = await axios.post(`/api/v2/groups/${emailStart}/members`, {
      users: [{ email: user.email, role }],
    });
    const member = res.data.data.members[0] as admin_directory_v1.Schema$Member | undefined;
    if (!member) return;
    const group = groups.find((g) => g.email === email);
    if (!group) return;
    const userGroup: UserGroup = {
      email,
      id: group.id!,
      name: group.name!,
      role,
      status: "ACTIVE",
      type: "USER",
    };
    if (!user.groups) return setUser({ ...user, groups: [userGroup] });
    const sortedGroups = [...user.groups, userGroup].sort((a, b) =>
      a.email!.localeCompare(b.email!)
    );
    setUser({ ...user, groups: sortedGroups });
  };

  const canUpdate = () => {
    if (!user || !userEdit) return false;
    const keys: (keyof EmployeeModel)[] = [
      "firstName",
      "lastName",
      "title",
      "role",
      "email",
      "homeroomGrade",
      "timesheetEnabled",
    ];
    return keys.some((key) => {
      switch (key) {
        case "homeroomGrade":
          // @ts-ignore
          if (user.homeroomGrade === undefined && userEdit.homeroomGrade === "") return false;
          // @ts-ignore
          if (user.homeroomGrade === 0 && userEdit.homeroomGrade === "") return true;
          if (user.homeroomGrade === undefined && userEdit.homeroomGrade === undefined)
            return false;
          return Number(user.homeroomGrade) !== Number(userEdit.homeroomGrade);
        case "timesheetEnabled":
          if (user.timesheetEnabled === undefined && userEdit.timesheetEnabled === false)
            return false;
          return user.timesheetEnabled !== userEdit.timesheetEnabled;
        default:
          return user[key] !== userEdit[key];
      }
    });
  };

  const handleUserUpdate = async () => {
    if (!user || !canUpdate()) return;
    try {
      const res = await axios.patch<APIUserResponse>(`/api/v2/users/${user._id}`, userEdit);
      const updatedUser = res.data.data.user;
      setUser({ groups: user.groups, ...updatedUser });
      setUserEdit({ groups: user.groups, ...updatedUser });
      showToaster("User Updated", "success");
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  return (
    <div className="flex h-full">
      <MainContent>
        <MainContent.InnerWrapper>
          <MainContent.Header>
            <div className="flex items-center h-6">
              <BackButton onClick={goToUsersPage} />
              <span style={{ fontWeight: 500, fontSize: 16 }}>Back to Users</span>
            </div>
            {canUpdate() && (
              <button
                type="button"
                className="absolute right-6 w-auto justify-center inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                onClick={handleUserUpdate}
              >
                Save Updates
              </button>
            )}
          </MainContent.Header>
          <div className="flex flex-col sm:px-6 px-4 pb-6 pt-2.5 overflow-y-scroll">
            <div className="flex px-5">
              <img
                className="rounded-full md:w-36 md:h-36 w-28 h-28 border-blue-400 border-solid border-4 p-1 md:p-1.5"
                src={image}
                onError={(e) => (e.currentTarget.src = "../avatar_placeholder.png")}
                alt={user?.fullName}
              />
              <div className="ml-4 pt-4">
                <span className="block font-black mb-1 md:mb-2.5 text-2xl md:text-4xl">
                  {user?.fullName}
                </span>
                <span className="md:text-lg text-md font-light text-gray-500">{user?.title}</span>
              </div>
            </div>
            <Divider className="py-3" />
            <div className="mt-5 px-5 grid md:grid-cols-2 grid-cols-1 gap-6">
              <div>
                <LabeledInput2
                  name="firstName"
                  label="First Name"
                  value={userEdit?.firstName || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <LabeledInput2
                  name="lastName"
                  label="Last Name"
                  value={userEdit?.lastName || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2 md:w-3/5">
                <LabeledInput2
                  name="title"
                  label="Title"
                  value={userEdit?.title || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2 md:w-3/5">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    name="role"
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={userEdit?.role || ""}
                    onChange={handleChange}
                  >
                    <option>Super Admin</option>
                    <option>Admin</option>
                    <option>Development</option>
                    <option>Instructor</option>
                    <option>Maintenance</option>
                    <option>Intern</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-2 md:w-3/5">
                <AddOnInput
                  addOnSide="right"
                  name="email"
                  label="Email Address"
                  addOnText="@cornerstone-schools.org"
                  value={userEdit?.email.split("@")[0] || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2 md:w-3/5">
                <LabeledInput2
                  className="bg-gray-200"
                  name="slug"
                  label="Slug"
                  value={userEdit?.slug || ""}
                  disabled
                  readOnly
                />
              </div>
              <div className="md:col-span-2 md:w-44">
                <label htmlFor="homeroomGrade" className="block text-sm font-medium text-gray-700">
                  Homeroom Grade
                </label>
                <select
                  name="homeroomGrade"
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={String(userEdit?.homeroomGrade) || ""}
                  onChange={handleChange}
                >
                  <option value="">None</option>
                  {grades.map((value, i) => (
                    <option key={value} value={i}>
                      {i === 0 ? "Kindergarten" : `${value} Grade`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="">
                <div className="flex align-center">
                  <label
                    htmlFor="timesheetEnabled"
                    className="block text-sm font-medium text-gray-700 mr-5"
                  >
                    Timesheet Enabled
                  </label>
                  <Switch
                    name="timesheetEnabled"
                    checked={userEdit?.timesheetEnabled || false}
                    onChange={() =>
                      handleChange({
                        //@ts-ignore
                        target: { name: "timesheetEnabled", value: !userEdit?.timesheetEnabled },
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="py-10 px-20">
              <Divider />
            </div>
            <div className="mx-5">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1">
                  <DepartmentList
                    user={user}
                    departments={departments}
                    addDepartmentMember={addDepartmentMember}
                  />
                </div>
                <div className="px-5 py-5 md:py-0">
                  <Divider className="hidden md:block" orientation="vertical" />
                  <Divider className="md:hidden" orientation="horizontal" />
                </div>
                <div className="flex-1">
                  <GroupList
                    user={user}
                    userGroups={user?.groups || []}
                    groups={groups}
                    addGroupMember={addGroupMember}
                  />
                </div>
              </div>
            </div>
          </div>
        </MainContent.InnerWrapper>
      </MainContent>
    </div>
  );
}
