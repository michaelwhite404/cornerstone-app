import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Dot from "../../components/Dot";
import Tabs from "../../components/Tabs";
import { useDocTitle, useSocket } from "../../hooks";
import { CurrentSession } from "../../types/aftercareTypes";
import { APICurrentSessionResponse } from "../../types/apiResponses";

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
  const [currentSession, setCurrentSession] = useState<CurrentSession>({
    session: null,
    attendance: [],
  });

  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentSession = useCallback(async () => {
    const res = await axios.get<APICurrentSessionResponse>("/api/v2/aftercare/session/today");
    setCurrentSession(res.data.data);
  }, []);

  useEffect(() => {
    const getPageState = () => {
      const paths = location.pathname.split("/").filter((p) => p !== "");
      if (paths.length === 1) return setPageState("current-session");
      setPageState(paths[paths.length - 1] as LionsDenPageState);
    };
    getPageState();
  }, [location.pathname]);

  useEffect(() => {
    getCurrentSession();
  }, [getCurrentSession]);

  useEffect(() => {
    socket?.on("aftercareSignOutSuccess", getCurrentSession);
    socket?.on("aftercareAddEntries", getCurrentSession);
    socket?.on("newDay", () =>
      setCurrentSession({
        session: null,
        attendance: [],
      })
    );
    socket?.on("aftercareSessionStart", setCurrentSession);
  }, [getCurrentSession, socket]);

  const finished =
    currentSession.session && currentSession.attendance.every((entry) => entry.signOutDate);

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      {/* Header */}
      <div className="page-header">
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
          getCurrentSession,
          currentSession,
          setCurrentSession,
        }}
      />
    </div>
  );
}
