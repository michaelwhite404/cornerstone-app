import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { EmployeeModel } from "../../types/models";
import Tabs from "../../components/Tabs";
import PageUsers from "./Users";
import Departments from "./Departments";
import UserData from "./UserData";
import Groups from "./Groups";
import GroupData from "./GroupData";

const tabs = [
  { title: "Users", name: "users", href: "" },
  { title: "Departments", name: "departments", href: "/departments" },
  { title: "Groups", name: "groups", href: "/groups" },
];

function Users() {
  const [users, setUsers] = useState<EmployeeModel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("/api/v2/users", {
        params: {
          sort: "-active,lastName",
        },
      });
      setUsers(res.data.data.users);
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col relative" style={{ padding: "10px 25px 25px" }}>
      {/* Header */}
      <div className="flex flex-col items-start justify-between">
        <h1 style={{ marginBottom: "10px" }}>User Management</h1>
        <p>Manage the team and account permissions here</p>
      </div>
      <div className="my-4">
        <Tabs>
          {tabs.map((tab, i) => (
            <Tabs.Tab
              key={i}
              current={tab.name === window.location.href.split("/").pop()}
              onClick={() => navigate(`/users${tab.href}`)}
            >
              {tab.title}
            </Tabs.Tab>
          ))}
        </Tabs>
      </div>
      <Outlet context={{ users }} />
    </div>
  );
}

Users.Users = PageUsers;
Users.Departments = Departments;
Users.UserData = UserData;
Users.Groups = Groups;
Users.GroupData = GroupData;

export default Users;
