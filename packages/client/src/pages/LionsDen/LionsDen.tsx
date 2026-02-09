import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Dot from "../../components/Dot";
import Tabs from "../../components/Tabs";
import { useDocTitle, useSocket } from "../../hooks";
import { CurrentSession } from "../../types/aftercareTypes";
import { useTodaySession } from "../../api";

const tabs = [
  { title: "Current Session", name: "current-session", href: "" },
  // { title: "Overview", name: "overview", href: "/overview" },
  { title: "Sessions", name: "sessions", href: "/sessions" },
  { title: "Students", name: "students", href: "/students" },
];

type LionsDenPageState = "current-session" | "sessions" | "students" | "overview";

export default function LionsDen() {
  useDocTitle("Lions Den | Cornerstone App");
  const socket = useSocket();
  const [pageState, setPageState] = useState<LionsDenPageState>();
  const { data: fetchedSession, refetch } = useTodaySession();
  const [currentSession, setCurrentSession] = useState<CurrentSession>({
    session: null,
    attendance: [],
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Sync fetched session to local state
  useEffect(() => {
    if (fetchedSession) {
      setCurrentSession(fetchedSession);
    }
  }, [fetchedSession]);

  useEffect(() => {
    const getPageState = () => {
      const paths = location.pathname.split("/").filter((p) => p !== "");
      if (paths.length === 1) return setPageState("current-session");
      setPageState(paths[paths.length - 1] as LionsDenPageState);
    };
    getPageState();
  }, [location.pathname]);

  useEffect(() => {
    const handleRefetch = () => { refetch(); };
    socket?.on("aftercareSignOutSuccess", handleRefetch);
    socket?.on("aftercareAddEntries", handleRefetch);
    socket?.on("newDay", () =>
      setCurrentSession({
        session: null,
        attendance: [],
      })
    );
    socket?.on("aftercareSessionStart", setCurrentSession);

    return () => {
      socket?.off("aftercareSignOutSuccess", handleRefetch);
      socket?.off("aftercareAddEntries", handleRefetch);
    };
  }, [refetch, socket]);

  const finished =
    currentSession.session && currentSession.attendance.every((entry) => entry.signOutDate);

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 style={{ marginBottom: "10px" }}>Lions Den</h1>
      </div>
      {/* Tabs */}
      <div className="hidden sm:block mb-10">
        <nav className="lions-den-tabs" aria-label="Tabs">
          <Tabs>
            {tabs.map((tab, i) => (
              <Tabs.Tab
                key={tab.name}
                current={pageState === tab.name}
                onClick={() => navigate(`/lions-den${tab.href}`)}
              >
                {tab.title}
                {currentSession.session && (
                  <span className="absolute -top-1 -right-1 b">
                    {tab.name === "current-session" && (
                      <Dot color={finished ? "#4caf50" : "red"} blinking={!finished} />
                    )}
                  </span>
                )}
              </Tabs.Tab>
            ))}
          </Tabs>
        </nav>
      </div>
      <Outlet
        context={{
          getCurrentSession: refetch,
          currentSession,
          setCurrentSession,
        }}
      />
    </div>
  );
}
