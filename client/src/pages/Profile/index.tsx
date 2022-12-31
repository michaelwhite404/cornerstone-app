import { useEffect, useState } from "react";
import { useAuth, useDocTitle } from "../../hooks";
import Tabs2, { TabOption } from "../../components/Tabs2";
import General from "./General";
import Password from "./Password";
import Teams from "./Teams";
import Notifications from "./Notifications";
import axios from "axios";
import { UserGroup } from "../../../../src/types/models";

type PageState = "GENERAL" | "PASSWORD" | "NOTIFICATIONS" | "TEAMS";

export default function Profile() {
  useDocTitle("Profile | Cornerstone App");
  const [pageState, setPageState] = useState<PageState>("GENERAL");
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const getGroups = async () => {
      const res = await axios.get("/api/v2/users/me", { params: { projection: "FULL" } });
      setGroups(
        (res.data.data.user.groups as UserGroup[])?.sort((a, b) => {
          const nameA = a.name!.toUpperCase();
          const nameB = b.name!.toUpperCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        }) || []
      );
    };

    getGroups();
  }, [user?._id]);

  const tabs: TabOption<PageState>[] = [
    { name: "General", value: "GENERAL" },
    { name: "Password", value: "PASSWORD" },
    { name: "Notifications", value: "NOTIFICATIONS" },
    { name: "Teams", value: "TEAMS" },
  ];

  return (
    <div className="flex flex-col" style={{ padding: "10px 25px 25px" }}>
      <div className="sm:flex sm:justify-between align-center">
        {/* Header */}
        <div className="page-header">
          <h1 style={{ marginBottom: "10px" }}>Profile</h1>
        </div>
      </div>
      <div className="sm:mt-0 mt-3">
        <Tabs2 tabs={tabs} value={pageState} onChange={({ value }) => setPageState(value)} />
      </div>
      {pageState === "GENERAL" && <General user={user!} />}
      {pageState === "PASSWORD" && <Password />}
      {pageState === "TEAMS" && <Teams user={user!} groups={groups} />}
      {pageState === "NOTIFICATIONS" && <Notifications />}
    </div>
  );
}
