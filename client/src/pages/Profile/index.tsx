import { useState } from "react";
import { useAuth, useDocTitle } from "../../hooks";
import Tabs2, { TabOption } from "../../components/Tabs2";
import General from "./General";

type PageState = "GENERAL" | "PASSWORD" | "NOTIFICATIONS" | "TEAMS";

export default function Profile() {
  useDocTitle("Profile | Cornerstone App");
  const [pageState, setPageState] = useState<PageState>("GENERAL");
  const { user } = useAuth();

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
    </div>
  );
}
